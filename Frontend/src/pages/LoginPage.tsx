import { type SyntheticEvent, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { validateEmail, validatePassword } from '../lib/validators'

export const LoginPage = () => {
  const { login, loginWithToken } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' })
  const [authenticatingGoogle, setAuthenticatingGoogle] = useState(false)

  useEffect(() => {
    const query = new URLSearchParams(location.search)
    const token = query.get('token')
    if (!token) return

    const authenticate = async () => {
      setAuthenticatingGoogle(true)
      const loginError = await loginWithToken(token)
      setAuthenticatingGoogle(false)

      if (loginError) {
        setError(loginError)
        return
      }

      navigate('/dashboard')
    }

    authenticate()
  }, [location.search, loginWithToken, navigate])

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
   <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans">
  <div className="w-[380px] rounded-2xl bg-white px-10 py-10 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.06)]">
    
    {/* Header */}
    <div className="mb-7 text-center">
      <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
        Welcome back
      </h1>
      <p className="mt-1.5 text-sm text-slate-500">Sign in to continue</p>
    </div>

    {/* Google Button */}
    
      <a href="http://localhost:5000/auth/google"
      className="inline-flex w-full items-center justify-center gap-3 rounded-[10px] border border-slate-200 bg-white px-5 py-3 text-[15px] font-semibold text-slate-800 shadow-sm transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.99]"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      Continue with Google
    </a>

    {/* Footer */}
    <p className="mt-5 text-center text-[13px] text-slate-400">
      By continuing, you agree to our{" "}
      
        <a href="/terms"
        className="font-medium text-indigo-500 hover:text-indigo-600 hover:underline"
      >
        Terms
      </a>{" "}
      and{" "}
      
        <a href="/privacy"
        className="font-medium text-indigo-500 hover:text-indigo-600 hover:underline"
      >
        Privacy Policy
      </a>
    </p>

  </div>
</div>

   
     
      
      
  )
}
