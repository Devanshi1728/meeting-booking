const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const connectDB = async () => {
  try {
    const client = await pool.connect();

    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS google_refresh_token TEXT`)
    await client.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS google_event_id TEXT`)

    console.log("Database connected");

    client.release();
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

module.exports = {
  pool,
  connectDB,
};