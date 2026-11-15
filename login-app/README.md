# Login App

A complete, working authentication system built with Node.js, Express, SQLite, and vanilla JavaScript.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (edit as needed)
cp .env .env.local   # or just edit .env directly

# 3. Start the server
npm start
```

Open **http://localhost:3000** in your browser.

---

## Project structure

```
login-app/
├── server.js                  # Entry point — Express app setup
├── package.json
├── .env                       # Environment variables
│
├── config/
│   └── database.js            # SQLite connection + table creation
│
├── routes/
│   └── auth.js                # API route definitions
│
├── controllers/
│   └── authController.js      # Request handlers (register / login / logout / me)
│
├── middleware/
│   └── authMiddleware.js      # requireAuth guard for protected routes
│
├── models/
│   └── User.js                # Database queries for the users table
│
└── public/                    # Static frontend files
    ├── index.html             # Root redirect (→ dashboard or login)
    ├── login.html
    ├── register.html
    ├── dashboard.html
    ├── css/style.css
    └── js/auth.js             # Shared fetch helper
```

---

## Environment variables (.env)

| Variable         | Default                              | Description                         |
|------------------|--------------------------------------|-------------------------------------|
| `PORT`           | `3000`                               | Port the server listens on          |
| `SESSION_SECRET` | `change-this-to-…`                   | Secret used to sign session cookies |
| `NODE_ENV`       | `development`                        | Set to `production` for HTTPS-only cookies |

**Change `SESSION_SECRET` before deploying anywhere public.**

---

## REST API

All endpoints return JSON. Example success response:

```json
{
  "success": true,
  "message": "Login successful.",
  "user": { "id": 1, "username": "Alice" }
}
```

### `POST /api/auth/register`

Register a new user.

**Body**
```json
{ "username": "Alice", "email": "alice@example.com", "password": "secret123" }
```

**Responses**
| Status | Meaning |
|--------|---------|
| 201    | User created |
| 400    | Validation error (missing/invalid fields) |
| 409    | Email already in use |
| 500    | Server error |

---

### `POST /api/auth/login`

Authenticate a user and start a session.

**Body**
```json
{ "email": "alice@example.com", "password": "secret123" }
```

**Responses**
| Status | Meaning |
|--------|---------|
| 200    | Login successful; session cookie set |
| 400    | Missing fields |
| 401    | Incorrect credentials |
| 500    | Server error |

---

### `POST /api/auth/logout`

Destroy the current session.

**Responses**
| Status | Meaning |
|--------|---------|
| 200    | Logged out |
| 500    | Server error |

---

### `GET /api/auth/me`

Return the currently authenticated user's profile. **Requires a valid session.**

**Responses**
| Status | Meaning |
|--------|---------|
| 200    | `{ user: { id, username, email, created_at } }` |
| 401    | Not authenticated |

---

## How it all fits together

```
Browser (HTML/CSS/JS)
        │
        │  fetch() JSON requests
        ▼
Express server (server.js)
        │
        ├── express-session middleware (reads/writes HTTP-only cookie)
        │
        ├── /api/auth/* routes → authController.js
        │           │
        │           ├── bcrypt  (hash + verify passwords)
        │           └── User model → better-sqlite3 → users.db
        │
        └── express.static → serves public/ files directly
```

**Registration flow**
1. Browser POSTs `{ username, email, password }` to `/api/auth/register`.
2. Controller validates input, rejects duplicates, hashes the password with bcrypt.
3. New row inserted in `users` table via a parameterised query.
4. Browser receives `201` and redirects to `/login.html`.

**Login flow**
1. Browser POSTs `{ email, password }` to `/api/auth/login`.
2. Controller looks up the user by email, compares password with bcrypt.
3. On success: `req.session.userId = user.id` — Express stores the session.
4. An HTTP-only cookie (`connect.sid`) is set on the browser.
5. Browser receives `200` and navigates to `/dashboard.html`.

**Dashboard / protected page**
1. `dashboard.html` loads and immediately calls `GET /api/auth/me`.
2. `requireAuth` middleware checks `req.session.userId`; if absent → `401`.
3. On `401`, the browser redirects to `/login.html`.
4. On `200`, user details are rendered on the page.

**Logout flow**
1. Browser POSTs to `/api/auth/logout`.
2. `req.session.destroy()` removes the session from the store.
3. The session cookie is cleared.
4. Browser redirects to `/login.html`.

---

## Security notes

- Passwords are **never stored in plain text** — bcrypt with 12 salt rounds.
- Session cookies are **HTTP-only** (invisible to JavaScript) and set `SameSite=lax`.
- All SQL queries use **parameterised statements** (no string concatenation).
- Password hashes are **never returned** by any API endpoint.
- In production, set `NODE_ENV=production` to enable the `secure` cookie flag (requires HTTPS).
