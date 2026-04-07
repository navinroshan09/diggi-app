const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const initDb = async () => {
  try {
    await pool.query(createTableQuery);
    console.log("PostgreSQL Table 'users' is ready.");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
};

module.exports = { pool, initDb };
