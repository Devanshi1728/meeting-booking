const passport = require('passport')
const { Strategy: GoogleStrategy } = require('passport-google-oauth20')
const authService = require('../services/auth.service')
const crypto = require('crypto')

require('dotenv').config()

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback'

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn('Google OAuth client ID / secret are not configured. Google authentication will not work until these values are provided.')
}

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      accessType: 'offline',
      prompt: 'consent',
      includeGrantedScopes: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value
        if (!email) {
          return done(new Error('Google account does not expose an email address'), null)
        }

        let user = await authService.findUserByEmail(email)
        if (!user) {
          const name = profile.displayName || `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim() || 'Google User'
          user = await authService.createGoogleUser({
            name,
            email,
            department_name: '__select_department__',
            role: 'user',
            google_refresh_token: refreshToken,
          })
        } else if (refreshToken) {
          await authService.updateGoogleRefreshToken(Number(user.id), refreshToken)
          user = await authService.findUserByEmail(email)
        }

        return done(null, user)
      } catch (error) {
        return done(error, null)
      }
    }
  )
)

module.exports = passport
