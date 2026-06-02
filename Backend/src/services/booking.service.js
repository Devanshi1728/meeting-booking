const { pool } = require('../config/db');
const roomService = require('./room.service');

const getAllBookings = async ({ userId, roomId, date } = {}) => {
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
    SELECT b.id, b.room_id, b.user_id, b.user_name, b.department_name, b.date, b.start_time, b.end_time, b.created_at,
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

const createBooking = async ({ room_id, user_id, user_name, department_name, date, start_time, end_time }) => {
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

  const query = `
    INSERT INTO bookings (room_id, user_id, user_name, department_name, date, start_time, end_time, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    RETURNING id, room_id, user_id, user_name, department_name, date, start_time, end_time, created_at
  `;

  const { rows } = await pool.query(query, [room_id, user_id, user_name, department_name, date, start_time, end_time]);
  return {
    ...rows[0],
    room_name: room.name,
    capacity: room.capacity,
    image_url: room.image_url,
    is_active: room.is_active,
  };
};

const updateBooking = async (id, { user_name, department_name, date, start_time, end_time }, userId) => {
  const bookingQuery = `
    SELECT room_id, user_id
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

  const updateQuery = `
    UPDATE bookings
    SET user_name = $1,
        department_name = $2,
        date = $3,
        start_time = $4,
        end_time = $5
    WHERE id = $6
    RETURNING id, room_id, user_id, user_name, department_name, date, start_time, end_time, created_at
  `;

  const { rows } = await pool.query(updateQuery, [user_name, department_name, date, start_time, end_time, id]);
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

module.exports = {
  getAllBookings,
  createBooking,
  updateBooking,
};
