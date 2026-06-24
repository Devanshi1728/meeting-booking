const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const authService = require('../services/auth.service')

const JWT_SECRET = process.env.JWT_SECRET || 'change-me'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

const signToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      name: user.name,
      email: user.email,
      department_name: user.department_name,
      role: user.role || 'user',
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

const register = async (req, res, next) => {
  try {
    const { name, email, password, department_name } = req.body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' })
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    if (!department_name || typeof department_name !== 'string' || !department_name.trim()) {
      return res.status(400).json({ success: false, message: 'Department is required' })
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' })
    }

    const existingUser = await authService.findUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' })
    }

    const user = await authService.createUser({
      name,
      email,
      password,
      department_name,
      role: 'user',
    })

    const token = signToken(user)
    res.status(201).json({ success: true, data: { user, token } })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: 'Password is required' })
    }

    const user = await authService.findUserByEmail(email)
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' })
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash)
    if (!passwordMatches) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' })
    }

    const token = signToken(user)
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      department_name: user.department_name,
      role: user.role || 'user',
    }

    res.status(200).json({ success: true, data: { user: safeUser, token } })
  } catch (error) {
    next(error)
  }
}

const googleCallback = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_auth_failed`)
    }

    const token = signToken(req.user)
    const redirectUrl = new URL(process.env.FRONTEND_URL || 'http://localhost:5173')
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('token', token)

    res.redirect(redirectUrl.toString())
  } catch (error) {
    next(error)
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const user = req.user
    const { department_name } = req.body

    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    if (!department_name || typeof department_name !== 'string' || !department_name.trim()) {
      return res.status(400).json({ success: false, message: 'Department is required' })
    }

    const updatedUser = await authService.updateUserDepartment(Number(user.id), department_name.trim())
    const safeUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      department_name: updatedUser.department_name,
      role: updatedUser.role || 'user',
    }

    res.status(200).json({ success: true, data: { user: safeUser } })
  } catch (error) {
    next(error)
  }
}

const me = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const user = await authService.findUserById(Number(req.user.id))
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      department_name: user.department_name,
      role: user.role || 'user',
    }

    res.status(200).json({ success: true, data: { user: safeUser } })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login,
  googleCallback,
  updateProfile,
  me,
}
