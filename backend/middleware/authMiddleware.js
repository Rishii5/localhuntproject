// // middleware/authMiddleware.js
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const { errorResponse } = require('../utils/response');

// module.exports = async (req, res, next) => {
//     try {
//         const header = req.headers.authorization;
//         if (!header || !header.startsWith('Bearer ')) {
//             return errorResponse(res, 401, 'Authorization token missing');
//         }

//         const token = header.split(' ')[1];
//         const payload = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(payload.id).select('-password');
//         if (!user) return errorResponse(res, 401, 'User not found');

//         req.user = user;
//         next();
//     } catch (err) {
//         return errorResponse(res, 401, 'Invalid or expired token');
//     }
// };
// const jwt = require("jsonwebtoken");

// function authMiddleware(req, res, next) {
//     // Get token from header
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

//     if (!token) {
//         return res.status(401).json({ message: "Access denied. No token provided." });
//     }

//     try {
//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
//         req.user = decoded; // attach payload (id, role) to req
//         next();
//     } catch (err) {
//         return res.status(403).json({ message: "Invalid or expired token." });
//     }
// }

// module.exports = authMiddleware;
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const { errorResponse } = require("../utils/response");

// exports.authMiddleware = async (req, res, next) => {
//     try {
//         // 1️⃣ Check for token in Authorization header
//         const authHeader = req.headers.authorization;
//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return errorResponse(res, 401, "Authorization token missing");
//         }

//         const token = authHeader.split(" ")[1];

//         // 2️⃣ Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // 3️⃣ Attach user to request (excluding password)
//         const user = await User.findById(decoded.id).select("-password");
//         if (!user) return errorResponse(res, 401, "User not found");

//         req.user = user; // ✅ now available in controllers
//         next();
//     } catch (err) {
//         console.error("Auth Middleware Error:", err.message);
//         return errorResponse(res, 401, "Invalid or expired token");
//     }
// };
// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    // Check if Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authorization token missing",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info (id, role, etc.) to request
        req.user = decoded;

        next(); // move to next middleware/route
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};

module.exports = authMiddleware;
