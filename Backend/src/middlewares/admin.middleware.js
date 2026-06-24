const adminMiddleware = (req, res, next) => {
  const user = req.user
  if (!user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }

  if (user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden: admin access required' })
  }

  next()
}

module.exports = adminMiddleware
