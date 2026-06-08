import { type SyntheticEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { validateEmail, validatePassword, validateName } from '../lib/validators'
import { fetchDepartments } from '../lib/api'
import type { Department } from '../types'
import { useQuery } from '@tanstack/react-query'

export const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', department_name: '' })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({ name: '', email: '', department_name: '', password: '', confirmPassword: '' })

  const { data: departments = [] } = useQuery<Department[]>({
  queryKey: ['departments'],
  queryFn: fetchDepartments,
  staleTime: 1000 * 60 * 5,
})

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nameError = validateName(form.name)
    const emailError = validateEmail(form.email)
    const departmentError = form.department_name ? '' : 'Department is required.'
    const passwordError = validatePassword(form.password)
    const confirmError = form.password === form.confirmPassword ? '' : 'Passwords do not match.'

    setFieldErrors({ name: nameError, email: emailError, department_name: departmentError, password: passwordError, confirmPassword: confirmError })
    if (nameError || emailError || departmentError || passwordError || confirmError) return

    const registerError = await register(form)
    if (registerError) {
      setError(registerError)
      return
    }

    navigate('/dashboard')
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10 sm:px-6">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-8 space-y-2 text-center">
          <div className="inline-flex items-center justify-center rounded-3xl bg-sky-600 px-4 py-3 text-white">RB</div>
          <h1 className="text-3xl font-semibold text-slate-900">Create an account</h1>
          <p className="text-sm text-slate-500">Get started with your booking dashboard quickly.</p>
        </div>

        {error ? <div className="rounded-3xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <Input
              label="Full name"
              type="text"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Alex Johnson"
            />
            {fieldErrors.name ? <p className="text-xs text-rose-600">{fieldErrors.name}</p> : null}
          </div>

          <div className="space-y-2">
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="hello@example.com"
            />
            {fieldErrors.email ? <p className="text-xs text-rose-600">{fieldErrors.email}</p> : null}
          </div>

           <div className="space-y-2">
            Department
            <select
              required
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              value={form.department_name}
              onChange={(event) => setForm({ ...form, department_name: event.target.value })}
              >
                <option value="">Select a department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            {fieldErrors.department_name ? <p className="text-xs text-rose-600">{fieldErrors.department_name}</p> : null}
          </div>

          <div className="space-y-2">
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="••••••••"
            />
            {fieldErrors.password ? <p className="text-xs text-rose-600">{fieldErrors.password}</p> : null}
          </div>

          <div className="space-y-2">
            <Input
              label="Confirm password"
              type="password"
              value={form.confirmPassword}
              onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
              placeholder="••••••••"
            />
            {fieldErrors.confirmPassword ? <p className="text-xs text-rose-600">{fieldErrors.confirmPassword}</p> : null}
          </div>

          <Button className="w-full" type="submit">
            Register
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link className="font-semibold text-sky-600 hover:text-sky-700" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
