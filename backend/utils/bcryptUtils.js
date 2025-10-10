// utils/bcryptUtils.js
const bcrypt = require("bcryptjs");

/**
 * Hash a plain text password
 * @param {string} password - User's plain password
 * @returns {Promise<string>} - Hashed password
 */
async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10); // Generate salt (strength 10)
        const hashed = await bcrypt.hash(password, salt); // Hash the password with the salt
        return hashed;
    } catch (err) {
        console.error("Error hashing password:", err);
        throw new Error("Failed to hash password");
    }
}

/**
 * Verify a plain password against a hashed password
 * @param {string} plainPassword - Password entered by user
 * @param {string} hashedPassword - Password stored in DB
 * @returns {Promise<boolean>} - True if match, else false
 */
async function verifyPassword(plainPassword, hashedPassword) {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (err) {
        console.error("Error verifying password:", err);
        return false;
    }
}

module.exports = { hashPassword, verifyPassword };
