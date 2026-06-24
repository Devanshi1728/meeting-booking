const { google } = require('googleapis')

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''
const TIMEZONE = process.env.GOOGLE_TIMEZONE || 'UTC'

const createOAuthClient = () => {
  const oAuth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
  return oAuth2Client
}

const insertCalendarEvent = async ({
  refreshToken,
  roomName,
  userName,
  userEmail,
  departmentName,
  date,
  startTime,
  endTime,
}) => {
  if (!refreshToken) {
    throw new Error('Google refresh token is required to create calendar event')
  }

  const oAuth2Client = createOAuthClient()
  const { tokens } = await oAuth2Client.refreshToken(refreshToken)
  oAuth2Client.setCredentials(tokens)

  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })
  const event = {
    summary: `Room booking: ${roomName}`,
    description: `Booking created by ${userName}\nDepartment: ${departmentName}\nRoom: ${roomName}`,
    start: {
      dateTime: `${date}T${startTime}:00`,
      timeZone: TIMEZONE,
    },
    end: {
      dateTime: `${date}T${endTime}:00`,
      timeZone: TIMEZONE,
    },
    attendees: userEmail ? [{ email: userEmail }] : undefined,
  }

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
    sendUpdates: 'all',
  })

  return response.data.id
}

module.exports = {
  insertCalendarEvent,
}
