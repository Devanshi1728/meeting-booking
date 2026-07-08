const { pool } = require('../config/db');
const calendarSyncService = require('./calendarSync.service');

const getAllRooms = async () => {
  await calendarSyncService.syncCancelledGoogleBookings({ date: new Date().toISOString().slice(0, 10) });

  const query = `
    SELECT r.id,
           r.name,
           r.capacity,
           r.image_url,
           r.is_active,
           r.created_at,
           EXISTS(
             SELECT 1 FROM bookings b
             WHERE b.room_id = r.id
               AND b.date = CURRENT_DATE
               AND b.start_time < CURRENT_TIME
               AND b.end_time > CURRENT_TIME
           ) AS is_busy,
           COALESCE(
             json_agg(
               json_build_object(
                 'start_time', TO_CHAR(b.start_time, 'HH24:MI'),
                 'end_time', TO_CHAR(b.end_time, 'HH24:MI'),
                 'department_name', b.department_name
               ) ORDER BY b.start_time
             ) FILTER (WHERE b.id IS NOT NULL), '[]'::json
           ) AS today_bookings
    FROM rooms r
    LEFT JOIN bookings b ON b.room_id = r.id AND b.date = CURRENT_DATE
    GROUP BY r.id, r.name, r.capacity, r.image_url, r.is_active, r.created_at
    ORDER BY r.id
  `;
  const { rows } = await pool.query(query);
  return rows.map(row => ({
    ...row,
    today_bookings: typeof row.today_bookings === 'string' ? JSON.parse(row.today_bookings) : row.today_bookings
  }));
};

const getRoomById = async (id) => {
  await calendarSyncService.syncCancelledGoogleBookings({ roomId: id, date: new Date().toISOString().slice(0, 10) });

  const query = `
    SELECT r.id,
           r.name,
           r.capacity,
           r.image_url,
           r.is_active,
           r.created_at,
           EXISTS(
             SELECT 1 FROM bookings b
             WHERE b.room_id = r.id
               AND b.date = CURRENT_DATE
               AND b.start_time < CURRENT_TIME
               AND b.end_time > CURRENT_TIME
           ) AS is_busy,
           COALESCE(
             json_agg(
               json_build_object(
                 'start_time', TO_CHAR(b.start_time, 'HH24:MI'),
                 'end_time', TO_CHAR(b.end_time, 'HH24:MI'),
                 'department_name', b.department_name
               ) ORDER BY b.start_time
             ) FILTER (WHERE b.id IS NOT NULL), '[]'::json
           ) AS today_bookings
    FROM rooms r
    LEFT JOIN bookings b ON b.room_id = r.id AND b.date = CURRENT_DATE
    WHERE r.id = $1
    GROUP BY r.id, r.name, r.capacity, r.image_url, r.is_active, r.created_at
  `;
  const { rows } = await pool.query(query, [id]);
  const room = rows[0];
  if (!room) return null;
  return {
    ...room,
    today_bookings: typeof room.today_bookings === 'string' ? JSON.parse(room.today_bookings) : room.today_bookings
  };
};

const createRoom = async ({ name, capacity, image_url, is_active = true }) => {
  const query = `INSERT INTO rooms (name, capacity, image_url, is_active, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, name, capacity, image_url, is_active, created_at`;
  const { rows } = await pool.query(query, [name, capacity, image_url, is_active]);
  return rows[0];
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
};
