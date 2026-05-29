const { pool } = require('../config/db');

const getAllRooms = async () => {
  const query = 'SELECT id, name, capacity, image_url, is_active, created_at FROM rooms ORDER BY id';
  const { rows } = await pool.query(query);
  return rows;
};

const getRoomById = async (id) => {
  const query = 'SELECT id, name, capacity, image_url, is_active, created_at FROM rooms WHERE id = $1';
  const { rows } = await pool.query(query, [id]);
  return rows[0];
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
