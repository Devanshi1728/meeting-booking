export type AuthUser = {
  id: string
  name: string
  email: string
}

export type AuthState = {
  user: AuthUser | null
}

export type RegisterFormValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export type LoginFormValues = {
  email: string
  password: string
}
