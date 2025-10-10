// utils/jwtUtils.js
const jwt = require("jsonwebtoken");

const SECRET = "supersecretkey"; // 🔐 Move this to .env for production

/**
 * Generate JWT token
 * @param {Object} user - Mongoose user object
 * @returns {string} - JWT token
 */
function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    SECRET,
    { expiresIn: "1h" }
  );
}

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} - Decoded payload or null if invalid
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };
