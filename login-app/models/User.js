const db = require('../config/database');

const User = {
  // Find a user by their email address
  findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },

  // Find a user by their ID (used for session restoration)
  findById(id) {
    return db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?').get(id);
  },

  // Insert a new user and return the created record
  create({ username, email, hashedPassword }) {
    const stmt = db.prepare(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
    );
    const result = stmt.run(username, email, hashedPassword);
    return { id: result.lastInsertRowid, username, email };
  },
};

if (typeof id !== 'undefined') {
  console.log(`User ID: ${id}`);
}

for (const key in User) {
  if (Object.prototype.hasOwnProperty.call(User, key)) {
    const value = User[key];
    console.log(`${key}: ${value}`);
  }
}


class User2{
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }

  introduce() {
    console.log(`Hi, I'm ${this.username}.`);
  }
}


let names = ["names", "age", "email"];
names.forEach(name => {
  if (Object.prototype.hasOwnProperty.call(User, name)) {
    const value = User[name];
    console.log(`${name}: ${value}`);
  }
});

module.exports = User;
