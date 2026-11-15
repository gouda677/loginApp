require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');

// Initialise the database (creates the file and table if needed)
require('./config/database');

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---

// Parse JSON request bodies
app.use(express.json());

// Session management
// Sessions are stored in memory by default, which is fine for local development.
// For production, swap out the store for a persistent one (e.g. connect-sqlite3).
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,                              // Prevents JS access to the cookie
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      maxAge: 1000 * 60 * 60 * 24,                // 24 hours
      sameSite: 'lax',
    },
  })
);

// Serve static files (HTML, CSS, JS) from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// --- API Routes ---
app.use('/api/auth', authRoutes);

// --- Catch-all: serve index.html for any unmatched route ---
// (Keeps direct navigation to /dashboard etc. working)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
