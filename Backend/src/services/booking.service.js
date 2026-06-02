const { pool } = require('../config/db');
const roomService = require('./room.service');

const getAllBookings = async () => {
  const query = `
    SELECT b.id, b.room_id, b.department_name, b.date, b.start_time, b.end_time, b.created_at,
           r.name AS room_name, r.capacity, r.image_url, r.is_active
    FROM bookings b
    JOIN rooms r ON r.id = b.room_id
    ORDER BY b.id DESC
  `;
  const { rows } = await pool.query(query);
  return rows;
};

const createBooking = async ({ room_id, department_name, date, start_time, end_time }) => {
  const room = await roomService.getRoomById(room_id);
  if (!room) {
    const error = new Error('Room not found');
    error.statusCode = 400;
    throw error;
  }

  const query = `
    INSERT INTO bookings (room_id, department_name, date, start_time, end_time, created_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING id, room_id, department_name, date, start_time, end_time, created_at
  `;

  const { rows } = await pool.query(query, [room_id, department_name, date, start_time, end_time]);
  return {
    ...rows[0],
    room_name: room.name,
    capacity: room.capacity,
    image_url: room.image_url,
    is_active: room.is_active,
  };
};

const updateBooking = async (id, { department_name, date, start_time, end_time }) => {
  const bookingQuery = `
    UPDATE bookings
    SET department_name = $1,
        date = $2,
        start_time = $3,
        end_time = $4
    WHERE id = $5
    RETURNING id, room_id, department_name, date, start_time, end_time, created_at
  `;

  const { rows } = await pool.query(bookingQuery, [department_name, date, start_time, end_time, id]);
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
