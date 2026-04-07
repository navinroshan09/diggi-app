const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { pool, initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';

app.use(cors());
app.use(express.json());

// Initialize the database
initDb();

// --- Auth Routes ---

// Sign Up
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name, phone } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists with this email." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to DB
    const newUser = await pool.query(
      'INSERT INTO users (email, password, name, phone) VALUES ($1, $2, $3, $4) RETURNING id, email, name, phone, created_at',
      [email, hashedPassword, name, phone]
    );

    res.status(201).json({ message: "User created successfully.", user: newUser.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during signup." });
  }
});

// Sign In
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // Check if user exists
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const user = userResult.rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Generate JWT (optional but good practice)
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        created_at: user.created_at
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login." });
  }
});

app.get('/health', (req, res) => res.send("Server is running"));

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
