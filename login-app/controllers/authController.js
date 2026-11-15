const bcrypt = require('bcrypt');
const User = require('../models/User');

const SALT_ROUNDS = 12;

// POST /api/auth/register
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // --- Validate required fields ---
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    if (username.length < 2 || username.length > 30) {
      return res.status(400).json({ success: false, message: 'Username must be 2–30 characters.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    // --- Check for duplicate email ---
    const existing = User.findByEmail(email.toLowerCase());
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with that email already exists.' });
    }

    // --- Hash password and save user ---
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: { id: newUser.id, username: newUser.username },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // --- Look up user ---
    const user = User.findByEmail(email.toLowerCase().trim());
    if (!user) {
      // Use a generic message so we don't leak whether the email exists
      return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
    }

    // --- Verify password ---
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
    }

    // --- Create session ---
    req.session.userId = user.id;

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
}

// POST /api/auth/logout
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ success: false, message: 'Could not log out.' });
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({ success: true, message: 'Logged out.' });
  });
}

// GET /api/auth/me
function me(req, res) {
  // The requireAuth middleware already verified the session; userId is on req
  const user = User.findById(req.session.userId);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Not authenticated.' });
  }
  return res.status(200).json({ success: true, user });
}

module.exports = { register, login, logout, me };
