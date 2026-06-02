const bcrypt = require('bcryptjs')
const { pool } = require('../config/db')

const findUserByEmail = async (email) => {
  const query = 'SELECT id, name, email, password_hash, department_name, created_at FROM users WHERE email = $1'
  const { rows } = await pool.query(query, [email.toLowerCase()])
  return rows[0]
}

const findUserById = async (id) => {
  const query = 'SELECT id, name, email, department_name, created_at FROM users WHERE id = $1'
  const { rows } = await pool.query(query, [id])
  return rows[0]
}

const createUser = async ({ name, email, password, department_name }) => {
  const password_hash = await bcrypt.hash(password, 10)
  const query = `
    INSERT INTO users (name, email, password_hash, department_name, created_at)
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING id, name, email, department_name, created_at
  `
  const { rows } = await pool.query(query, [name.trim(), email.toLowerCase(), password_hash, department_name.trim()])
  return rows[0]
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
}
