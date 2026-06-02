const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'change-me'

const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }

  const token = authorization.split(' ')[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      department: payload.department_name,
    }
    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' })
  }
}

module.exports = authMiddleware
