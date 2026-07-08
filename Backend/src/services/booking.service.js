const { pool } = require('../config/db');
const roomService = require('./room.service');
const googleService = require('./google.service');
const calendarSyncService = require('./calendarSync.service');

const getAllBookings = async ({ userId, roomId, date } = {}) => {
  await calendarSyncService.syncCancelledGoogleBookings({ userId, roomId, date });

  const filters = [];
  const params = [];

  if (userId !== undefined) {
    params.push(userId);
    filters.push(`b.user_id = $${params.length}`);
  }

  if (roomId !== undefined) {
    params.push(roomId);
    filters.push(`b.room_id = $${params.length}`);
  }

  if (date !== undefined) {
    params.push(date);
    filters.push(`b.date = $${params.length}`);
  }

  const query = `
    SELECT b.id, b.room_id, b.user_id, b.user_name, b.department_name, b.google_event_id, b.description,
           TO_CHAR(b.date, 'YYYY-MM-DD') AS date, b.start_time, b.end_time, 
           TO_CHAR(b.created_at, 'YYYY-MM-DD') AS created_at,
           r.name AS room_name, r.capacity, r.image_url, r.is_active
    FROM bookings b
    JOIN rooms r ON r.id = b.room_id
    ${filters.length ? `WHERE ${filters.join(' AND ')}` : ''}
    ORDER BY b.id DESC
  `;

  const { rows } = await pool.query(query, params);
  return rows;
};

const hasBookingConflict = async (room_id, date, start_time, end_time, excludeBookingId = null) => {
  await calendarSyncService.syncCancelledGoogleBookings({ roomId: room_id, date });

  const params = [room_id, date, end_time, start_time];
  let query = `
    SELECT 1
    FROM bookings
    WHERE room_id = $1
      AND date = $2
      AND start_time < $3
      AND end_time > $4
  `;

  if (excludeBookingId !== null) {
    params.push(excludeBookingId);
    query += ` AND id != $${params.length}`;
  }

  const { rowCount } = await pool.query(query, params);
  return rowCount > 0;
};

const createBooking = async ({ room_id, user_id, user_name, department_name, date, start_time, end_time, description, google_refresh_token, user_email }) => {
  const room = await roomService.getRoomById(room_id);
  if (!room) {
    const error = new Error('Room not found');
    error.statusCode = 400;
    throw error;
  }

  const conflict = await hasBookingConflict(room_id, date, start_time, end_time);
  if (conflict) {
    const error = new Error('Room is already booked for the selected date and time');
    error.statusCode = 400;
    throw error;
  }

  let google_event_id = null
  if (google_refresh_token) {
    google_event_id = await googleService.insertCalendarEvent({
      refreshToken: google_refresh_token,
      roomName: room.name,
      userName: user_name,
      userEmail: user_email,
      departmentName: department_name,
      date,
      startTime: start_time,
      endTime: end_time,
      description,
    })
  }

  const query = `
    INSERT INTO bookings (room_id, user_id, user_name, department_name, google_event_id, description, date, start_time, end_time, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
    RETURNING id, room_id, user_id, user_name, department_name, google_event_id, description, TO_CHAR(date, 'YYYY-MM-DD') AS date, start_time, end_time, TO_CHAR(created_at, 'YYYY-MM-DD') AS created_at
  `;

  const { rows } = await pool.query(query, [room_id, user_id, user_name, department_name, google_event_id, description, date, start_time, end_time]);
  return {
    ...rows[0],
    room_name: room.name,
    capacity: room.capacity,
    image_url: room.image_url,
    is_active: room.is_active,
  };
};

const updateBooking = async (id, { user_name, department_name, date, start_time, end_time, description }, userId, google_refresh_token, user_email) => {
  await calendarSyncService.syncCancelledGoogleBookings({ bookingId: id, userId });

  const bookingQuery = `
    SELECT room_id, user_id, google_event_id
    FROM bookings
    WHERE id = $1
  `;
  const bookingResult = await pool.query(bookingQuery, [id]);
  const existingBooking = bookingResult.rows[0];

  if (!existingBooking || Number(existingBooking.user_id) !== Number(userId)) {
    return null;
  }

  const conflict = await hasBookingConflict(existingBooking.room_id, date, start_time, end_time, id);
  if (conflict) {
    const error = new Error('Room is already booked for the selected date and time');
    error.statusCode = 400;
    throw error;
  }

  if (existingBooking.google_event_id && google_refresh_token) {
    try {
      const room = await roomService.getRoomById(existingBooking.room_id);
      await googleService.updateCalendarEvent({
        refreshToken: google_refresh_token,
        eventId: existingBooking.google_event_id,
        roomName: room?.name,
        userName: user_name,
        userEmail: user_email,
        departmentName: department_name,
        date,
        startTime: start_time,
        endTime: end_time,
        description,
      })
    } catch (error) {
      console.warn('Failed to update Google calendar event', error)
    }
  }

  const updateQuery = `
    UPDATE bookings
    SET user_name = $1,
        department_name = $2,
        description = $3,
        date = $4,
        start_time = $5,
        end_time = $6
    WHERE id = $7
    RETURNING id, room_id, user_id, user_name, department_name, google_event_id, description, TO_CHAR(date, 'YYYY-MM-DD') AS date, start_time, end_time, TO_CHAR(created_at, 'YYYY-MM-DD') AS created_at
  `;

  const { rows } = await pool.query(updateQuery, [user_name, department_name, description, date, start_time, end_time, id]);
  const booking = rows[0];

  if (!booking) {
    return null;
  }

  const room = await roomService.getRoomById(booking.room_id);

  return {
    ...booking,
    room_name: room?.name || null,
    capacity: room?.capacity || null,
    image_url: room?.image_url || null,
    is_active: room?.is_active || false,
  };
};

const cancelBooking = async (id, userId, google_refresh_token) => {
  await calendarSyncService.syncCancelledGoogleBookings({ bookingId: id, userId });

  const bookingQuery = `
    SELECT b.id, b.room_id, b.user_id, b.user_name, b.department_name, b.google_event_id, b.description,
           TO_CHAR(b.date, 'YYYY-MM-DD') AS date, b.start_time, b.end_time,
           TO_CHAR(b.created_at, 'YYYY-MM-DD') AS created_at,
           r.name AS room_name, r.capacity, r.image_url, r.is_active
    FROM bookings b
    JOIN rooms r ON r.id = b.room_id
    WHERE b.id = $1
  `;
  const bookingResult = await pool.query(bookingQuery, [id]);
  const booking = bookingResult.rows[0];

  if (!booking || Number(booking.user_id) !== Number(userId)) {
    return null;
  }

  if (booking.google_event_id && google_refresh_token) {
    await googleService.deleteCalendarEvent({
      refreshToken: google_refresh_token,
      eventId: booking.google_event_id,
    });
  }

  await pool.query('DELETE FROM bookings WHERE id = $1 AND user_id = $2', [id, userId]);
  return booking;
};

module.exports = {
  getAllBookings,
  createBooking,
  updateBooking,
  cancelBooking,
};
