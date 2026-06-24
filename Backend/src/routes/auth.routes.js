const express = require('express')
const passport = require('passport')
const router = express.Router()
const authController = require('../controller/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'],
    accessType: 'offline',
    prompt: 'consent',
    includeGrantedScopes: true,
    session: false,
  })
)

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`, session: false }),
  authController.googleCallback
)

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/me', authMiddleware, authController.me)
router.put('/profile', authMiddleware, authController.updateProfile)

module.exports = router
