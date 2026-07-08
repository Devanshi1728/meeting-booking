const { pool } = require('../config/db')
const googleService = require('./google.service')

const isMissingGoogleEventError = (error) => [404, 410].includes(Number(error?.code || error?.response?.status))

const syncCancelledGoogleBookings = async ({ userId, roomId, date, bookingId } = {}) => {
  const filters = ['b.google_event_id IS NOT NULL', 'u.google_refresh_token IS NOT NULL']
  const params = []

  if (userId !== undefined) {
    params.push(userId)
    filters.push(`b.user_id = $${params.length}`)
  }

  if (roomId !== undefined) {
    params.push(roomId)
    filters.push(`b.room_id = $${params.length}`)
  }

  if (date !== undefined) {
    params.push(date)
    filters.push(`b.date = $${params.length}`)
  }

  if (bookingId !== undefined) {
    params.push(bookingId)
    filters.push(`b.id = $${params.length}`)
  }

  const { rows } = await pool.query(
    `
      SELECT b.id, b.google_event_id, u.google_refresh_token
      FROM bookings b
      JOIN users u ON u.id = b.user_id
      WHERE ${filters.join(' AND ')}
    `,
    params,
  )

  const cancelledBookingIds = []

  for (const booking of rows) {
    try {
      const event = await googleService.getCalendarEvent({
        refreshToken: booking.google_refresh_token,
        eventId: booking.google_event_id,
      })

      if (event?.status === 'cancelled') {
        cancelledBookingIds.push(booking.id)
      }
    } catch (error) {
      if (isMissingGoogleEventError(error)) {
        cancelledBookingIds.push(booking.id)
      } else {
        console.warn(`Failed to sync Google calendar event ${booking.google_event_id}`, error)
      }
    }
  }

  if (!cancelledBookingIds.length) {
    return []
  }

  const deleteResult = await pool.query(
    'DELETE FROM bookings WHERE id = ANY($1::int[]) RETURNING id',
    [cancelledBookingIds],
  )

  return deleteResult.rows.map((row) => row.id)
}

module.exports = {
  syncCancelledGoogleBookings,
}
