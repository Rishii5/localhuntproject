// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// exports.register = async (req, res) => {
//     const { name, email, password, role } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     try {
//         const newUser = new User({ name, email, password: hashedPassword, role });
//         await newUser.save();
//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (err) {
//         res.status(400).json({ error: 'User already exists or invalid data' });
//     }
// };

// exports.login = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user) return res.status(401).json({ error: 'Invalid credentials' });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

//         const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
//         res.json({ token, user });
//     } catch (err) {
//         res.status(500).json({ error: 'Login failed' });
//     }
// };
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { validationResult } = require('express-validator');

// // Generate JWT
// const generateToken = (user) => {
//     return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//         expiresIn: '7d',
//     });
// };

// // @route POST /api/auth/register
// exports.registerUser = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//     const { name, email, password, role } = req.body;

//     try {
//         let user = await User.findOne({ email });
//         if (user) return res.status(400).json({ error: 'User already exists' });

//         user = new User({ name, email, password, role });

//         await user.save();

//         const token = generateToken(user);
//         res.status(201).json({ token, user });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// };

// // @route POST /api/auth/login
// exports.loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ error: 'Invalid credentials' });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

//         const token = generateToken(user);
//         res.json({ token, user });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// };
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // Register a new user
// const register = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     // Create new user
//     const newUser = new User({ name, email, password, role });
//     await newUser.save();

//     // Generate token
//     const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
//       expiresIn: '7d',
//     });

//     res.status(201).json({ token, user: newUser });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error during registration' });
//   }
// };

// // Login existing user
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: 'User not found' });

//     // ✅ Add this part — Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

//     // Generate token
//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//       expiresIn: '7d',
//     });

//     res.json({ token, user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error during login' });
//   }
// };

// module.exports = { register, login };
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { validationResult } = require('express-validator');

// // Generate JWT token
// const generateToken = (user) => {
//     return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//         expiresIn: '7d',
//     });
// };

// // Register controller
// const register = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//     const { name, email, password } = req.body;

//     try {
//         const userExists = await User.findOne({ email });
//         if (userExists) return res.status(400).json({ error: 'User already exists' });

//         const user = new User({ name, email, password });
//         await user.save();

//         const token = generateToken(user);
//         res.status(201).json({ token, user });
//     } catch (err) {
//         res.status(500).json({ error: 'Server error' });
//     }
// };

// // Login controller
// const login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ error: 'Invalid credentials' });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

//         const token = generateToken(user);
//         res.status(200).json({ token, user });
//     } catch (err) {
//         res.status(500).json({ error: 'Server error' });
//     }
// };

// // ✅ Export both functions
// module.exports = { register, login };
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { validationResult } = require('express-validator');

// // Generate JWT token
// const generateToken = (user) => {
//     return jwt.sign(
//         { id: user._id, role: user.role },
//         process.env.JWT_SECRET || 'default_jwt_secret',
//         { expiresIn: '7d' }
//     );
// };

// // Register controller
// const register = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//         return res.status(400).json({ errors: errors.array() });

//     const { name, email, password, role } = req.body;

//     try {
//         const userExists = await User.findOne({ email });
//         if (userExists)
//             return res.status(400).json({ error: 'User already exists' });

//         // Hash password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Create user
//         const user = new User({
//             name,
//             email,
//             password: hashedPassword,
//             role: role || 'customer'
//         });

//         await user.save();

//         const token = generateToken(user);

//         res.status(201).json({
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role
//             }
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Server error' });
//     }
// };

// // Login controller
// const login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user)
//             return res.status(400).json({ error: 'Invalid credentials' });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch)
//             return res.status(400).json({ error: 'Invalid credentials' });

//         const token = generateToken(user);

//         res.status(200).json({
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role
//             }
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Server error' });
//     }
// };

// // Export both functions
// module.exports = {
//     register,
//     login
// };

// controllers/authController.js
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const { registerSchema, loginSchema } = require('../validation/authValidation');
// const { successResponse, errorResponse } = require('../utils/response');

// exports.register = async (req, res, next) => {
//     try {
//         const { error, value } = registerSchema.validate(req.body);
//         if (error) return errorResponse(res, 400, error.details[0].message);

//         const { name, email, password, role } = value;
//         const existing = await User.findOne({ email });
//         if (existing) return errorResponse(res, 400, 'Email already in use');

//         const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
//         const hashed = await bcrypt.hash(password, saltRounds);

//         const user = await User.create({ name, email, password: hashed, role });
//         const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

//         return successResponse(res, 201, { user: { id: user._id, name, email, role }, token });
//     } catch (err) {
//         next(err);
//     }
// };

// exports.login = async (req, res, next) => {
//     try {
//         const { error, value } = loginSchema.validate(req.body);
//         if (error) return errorResponse(res, 400, error.details[0].message);

//         const { email, password } = value;
//         const user = await User.findOne({ email });
//         if (!user) return errorResponse(res, 400, 'Invalid credentials');

//         const ok = await bcrypt.compare(password, user.password);
//         if (!ok) return errorResponse(res, 400, 'Invalid credentials');

//         const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

//         return successResponse(res, 200, { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
//     } catch (err) {
//         next(err);
//     }
// };
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { registerSchema, loginSchema } = require("../validation/authValidation");
const { successResponse, errorResponse } = require("../utils/response");

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
exports.register = async (req, res, next) => {
    try {
        // ✅ Validate input
        const { error, value } = registerSchema.validate(req.body);
        if (error) return errorResponse(res, 400, error.details[0].message);

        const { name, email, password, role } = value;

        // ✅ Check for existing user
        const existing = await User.findOne({ email: email.trim().toLowerCase() });
        if (existing) return errorResponse(res, 400, "Email already in use");

        // ✅ Hash password
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // ✅ Create user
        const user = await User.create({
            name,
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            role,
        });

        // ✅ Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );

        // ✅ Return success response (never return password)
        return successResponse(res, 201, {
            user: { id: user._id, name, email: user.email, role: user.role },
            token,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc Login user
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = async (req, res, next) => {
    try {
        // ✅ Validate input
        const { error, value } = loginSchema.validate(req.body);
        if (error) return errorResponse(res, 400, error.details[0].message);

        const { email, password } = value;

        // ✅ Find user
        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) return errorResponse(res, 400, "Invalid credentials");

        // ✅ Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return errorResponse(res, 400, "Invalid credentials");

        // ✅ Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );

        // ✅ Return success response
        return successResponse(res, 200, {
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token,
        });
    } catch (err) {
        next(err);
    }
};
