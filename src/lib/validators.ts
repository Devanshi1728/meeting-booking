export const validateEmail = (value: string) => {
  if (!value) return 'Email is required.'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) return 'Enter a valid email address.'
  return ''
}

export const validatePassword = (value: string) => {
  if (!value) return 'Password is required.'
  if (value.length < 8) return 'Password must be at least 8 characters.'
  return ''
}

export const validateName = (value: string) => {
  if (!value) return 'Name is required.'
  if (value.trim().length < 2) return 'Name must be at least 2 characters.'
  return ''
}
