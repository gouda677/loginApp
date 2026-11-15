// Protect routes that require an authenticated session.
// Attach this middleware to any route or router that needs a logged-in user.
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next(); // User is authenticated — proceed
  }
  return res.status(401).json({ success: false, message: 'You must be logged in.' });
}

module.exports = { requireAuth };
