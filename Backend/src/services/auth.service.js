const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { pool } = require('../config/db')

const findUserByEmail = async (email) => {
  const query = 'SELECT id, name, email, password_hash, department_name, role, google_refresh_token, created_at FROM users WHERE email = $1'
  const { rows } = await pool.query(query, [email.toLowerCase()])
  return rows[0]
}

const findUserById = async (id) => {
  const query = 'SELECT id, name, email, department_name, role, google_refresh_token, created_at FROM users WHERE id = $1'
  const { rows } = await pool.query(query, [id])
  return rows[0]
}

const createUser = async ({ name, email, password, department_name, role = 'user' }) => {
  const password_hash = await bcrypt.hash(password, 10)
  const query = `
    INSERT INTO users (name, email, password_hash, department_name, role, created_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING id, name, email, department_name, role, created_at
  `
  const { rows } = await pool.query(query, [name.trim(), email.toLowerCase(), password_hash, department_name.trim(), role])
  return rows[0]
}

const createGoogleUser = async ({ name, email, department_name, role = 'user', google_refresh_token = null }) => {
  const password_hash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10)
  const query = `
    INSERT INTO users (name, email, password_hash, department_name, role, google_refresh_token, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    RETURNING id, name, email, department_name, role, google_refresh_token, created_at
  `
  const { rows } = await pool.query(query, [name.trim(), email.toLowerCase(), password_hash, department_name.trim(), role, google_refresh_token])
  return rows[0]
}

const updateGoogleRefreshToken = async (id, refreshToken) => {
  const query = `
    UPDATE users
    SET google_refresh_token = $1
    WHERE id = $2
    RETURNING id, name, email, department_name, role, google_refresh_token, created_at
  `
  const { rows } = await pool.query(query, [refreshToken, id])
  return rows[0]
}

const updateUserDepartment = async (id, department_name) => {
  const query = `
    UPDATE users
    SET department_name = $1
    WHERE id = $2
    RETURNING id, name, email, department_name, role, google_refresh_token, created_at
  `
  const { rows } = await pool.query(query, [department_name.trim(), id])
  return rows[0]
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  createGoogleUser,
  updateGoogleRefreshToken,
  updateUserDepartment,
}
