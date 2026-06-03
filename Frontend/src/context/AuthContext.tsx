import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { AuthState, AuthUser, LoginFormValues, RegisterFormValues } from '../types'
import type { ReactNode } from 'react'

const AUTH_STATE_KEY = 'meeting-booking-auth'
const AUTH_TOKEN_KEY = 'meeting-booking-token'
const API_BASE_URL = 'http://localhost:5000'

type AuthContextValue = {
  user: AuthUser | null
  authenticated: boolean
  initializing: boolean
  login: (payload: LoginFormValues) => Promise<string | null>
  register: (payload: RegisterFormValues) => Promise<string | null>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const readAuthState = (): AuthState => {
  try {
    const raw = localStorage.getItem(AUTH_STATE_KEY)
    return raw ? JSON.parse(raw) : { user: null }
  } catch {
    return { user: null }
  }
}

const saveAuthState = (state: AuthState) => {
  localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(state))
}

const saveAuthToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

const clearAuth = () => {
  localStorage.removeItem(AUTH_STATE_KEY)
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => readAuthState())
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const initialize = async () => {
      const storedState = readAuthState()
      if (storedState.user) {
        setState(storedState)
        setInitializing(false)
        return
      }

      const token = localStorage.getItem(AUTH_TOKEN_KEY)
      if (!token) {
        setInitializing(false)
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()
        if (response.ok && data.data?.user) {
          setState({ user: data.data.user })
        } else {
          clearAuth()
        }
      } catch {
        clearAuth()
      } finally {
        setInitializing(false)
      }
    }

    initialize()
  }, [])

  useEffect(() => {
    saveAuthState(state)
  }, [state])

  const authenticated = useMemo(() => Boolean(state.user), [state.user])

  const login = async ({ email, password }: LoginFormValues) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        return data.message || 'Unable to log in.'
      }

      saveAuthToken(data.data.token)
      setState({ user: data.data.user })
      return null
    } catch {
      return 'Unable to log in. Please try again.'
    }
  }

  const register = async ({ name, email, department, password, confirmPassword }: RegisterFormValues) => {
    if (password !== confirmPassword) return 'Passwords do not match.'

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, department, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        return data.message || 'Unable to register.'
      }

      saveAuthToken(data.data.token)
      setState({ user: data.data.user })
      return null
    } catch {
      return 'Unable to register. Please try again.'
    }
  }

  const logout = () => {
    clearAuth()
    setState({ user: null })
  }

  return (
    <AuthContext.Provider value={{ user: state.user, authenticated, initializing, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
