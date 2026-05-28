import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { AuthState, AuthUser, LoginFormValues, RegisterFormValues } from '../types'
import type { ReactNode } from 'react'


type AuthContextValue = {
  user: AuthUser | null
  authenticated: boolean
  login: (payload: LoginFormValues) => Promise<string | null>
  register: (payload: RegisterFormValues) => Promise<string | null>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'meeting-booking-auth'
const USERS_KEY = 'meeting-booking-users'

const readUsers = (): Array<AuthUser & { password: string }> => {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveUsers = (users: Array<AuthUser & { password: string }>) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

const readAuthState = (): AuthState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { user: null }
  } catch {
    return { user: null }
  }
}

const saveAuthState = (state: AuthState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({ user: null })

  useEffect(() => {
    setState(readAuthState())
  }, [])

  useEffect(() => {
    saveAuthState(state)
  }, [state])

  const authenticated = useMemo(() => Boolean(state.user), [state.user])

  const login = async ({ email, password }: LoginFormValues) => {
    const user = readUsers().find((record) => record.email === email.toLowerCase())
    if (!user) return 'No account found for this email.'
    if (user.password !== password) return 'Invalid password.'
    const authUser: AuthUser = { id: user.id, name: user.name, email: user.email }
    setState({ user: authUser })
    return null
  }

  const register = async ({ name, email, password, confirmPassword }: RegisterFormValues) => {
    if (password !== confirmPassword) return 'Passwords do not match.'
    const normalizedEmail = email.toLowerCase()
    const users = readUsers()
    if (users.some((record) => record.email === normalizedEmail)) {
      return 'An account with this email already exists.'
    }
    const newUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      password,
    }
    users.push(newUser)
    saveUsers(users)
    setState({ user: { id: newUser.id, name: newUser.name, email: newUser.email } })
    return null
  }

  const logout = () => {
    setState({ user: null })
  }

  return (
    <AuthContext.Provider value={{ user: state.user, authenticated, login, register, logout }}>
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
