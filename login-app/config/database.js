const Database = require('better-sqlite3');
const path = require('path');

// Create or open the SQLite database file
const db = new Database(path.join(__dirname, '..', 'users.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create the users table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    username  TEXT NOT NULL,
    email     TEXT UNIQUE NOT NULL,
    password  TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('Database connected and table ready.');

module.exports = db;
