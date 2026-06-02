const { pool } = require('../config/db');

const getAllDepartments = async () => {
  const query = 'SELECT id, name FROM departments ORDER BY name ASC';
  const { rows } = await pool.query(query);
  return rows;
};

module.exports = {
  getAllDepartments,
};
