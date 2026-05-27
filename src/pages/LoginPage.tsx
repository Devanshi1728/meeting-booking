import { type SyntheticEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { validateEmail, validatePassword } from '../lib/validators'

export const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' })

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    const emailError = validateEmail(form.email)
    const passwordError = validatePassword(form.password)
    setFieldErrors({ email: emailError, password: passwordError })
    if (emailError || passwordError) return

    const loginError = await login(form)
    if (loginError) {
      setError(loginError)
      return
    }

    navigate('/dashboard')
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10 sm:px-6">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-8 space-y-2 text-center">
          <div className="inline-flex items-center justify-center rounded-3xl bg-sky-600 px-4 py-3 text-white">RB</div>
          <h1 className="text-3xl font-semibold text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-500">Log in to manage your meeting rooms and bookings.</p>
        </div>

        {error ? <div className="rounded-3xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="hello@example.com"
              aria-invalid={Boolean(fieldErrors.email)}
            />
            {fieldErrors.email ? <p className="text-xs text-rose-600">{fieldErrors.email}</p> : null}
          </div>

          <div className="space-y-2">
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="••••••••"
              aria-invalid={Boolean(fieldErrors.password)}
            />
            {fieldErrors.password ? <p className="text-xs text-rose-600">{fieldErrors.password}</p> : null}
          </div>

          <Button className="w-full" type="submit">
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          New to RoomBook?{' '}
          <Link className="font-semibold text-sky-600 hover:text-sky-700" to="/register">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
