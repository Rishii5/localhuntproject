// const express = require('express');
// const router = express.Router();
// const { register, login } = require('../controllers/authController');

// router.post('/register', register);
// router.post('/login', login);

// module.exports = router;
// const express = require('express');
// const router = express.Router();
// const { register, login } = require('../controllers/authController');
// const { check } = require('express-validator');


// router.post(
//     '/register',
//     [
//         check('name', 'Name is required').notEmpty(),
//         check('email', 'Please include a valid email').isEmail(),
//         check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
//     ],
//     register
// );

// // @route   POST /api/auth/login
// // @desc    Login user & get token
// // @access  Public
// router.post(
//     '/login',
//     [
//         check('email', 'Please include a valid email').isEmail(),
//         check('password', 'Password is required').exists()
//     ],
//     login
// );

// module.exports = router;
// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User"); // adjust path to your User model

// const router = express.Router();

// // Login route
// router.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // 1. Find user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ message: "User not found" });
//         }

//         // 2. Compare entered password with stored hash
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         // 3. Generate JWT token
//         const token = jwt.sign(
//             { id: user._id, role: user.role }, // payload
//             process.env.JWT_SECRET || "secret123", // secret key
//             { expiresIn: "1h" }
//         );

//         res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// module.exports = router;
// 
// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User"); // adjust path to your User model

// const router = express.Router();

// // ---------------------- REGISTER ----------------------
// router.post("/register", async (req, res) => {
//     try {
//         const { name, email, password, role } = req.body;

//         // 1. Validate input
//         if (!name || !email || !password || !role) {
//             return res.status(400).json({ success: false, message: "Please fill all fields" });
//         }

//         // 2. Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ success: false, message: "User already exists" });
//         }

//         // 3. Hash password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // 4. Save new user
//         const newUser = new User({
//             name,
//             email,
//             password: hashedPassword,
//             role,
//         });
//         await newUser.save();

//         res.status(201).json({ success: true, message: "User registered successfully" });
//     } catch (err) {
//         console.error("Register error:", err.message);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// // ---------------------- LOGIN ----------------------
// router.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // 1. Validate input
//         if (!email || !password) {
//             return res.status(400).json({ success: false, message: "Please provide email and password" });
//         }

//         // 2. Find user
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ success: false, message: "Invalid credentials" });
//         }

//         // 3. Compare password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ success: false, message: "Invalid credentials" });
//         }

//         // 4. Generate JWT
//         const token = jwt.sign(
//             { id: user._id, role: user.role },
//             process.env.JWT_SECRET || "secret123",
//             { expiresIn: "1h" }
//         );

//         res.status(200).json({
//             success: true,
//             message: "Login successful",
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role,
//             },
//         });
//     } catch (err) {
//         console.error("Login error:", err.message);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// // ---------------------- TEST ROUTE ----------------------
// router.get("/test", (req, res) => {
//     res.json({ success: true, message: "Auth route is working ✅" });
// });

// module.exports = router;
// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User"); // adjust path to your User model

// const router = express.Router();

// // ---------------------- REGISTER ----------------------
// router.post("/register", async (req, res) => {
//     try {
//         const { name, email, password, role } = req.body;

//         // 1. Validate input
//         if (!name || !email || !password || !role) {
//             return res.status(400).json({ success: false, message: "Please fill all fields" });
//         }

//         // 2. Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ success: false, message: "User already exists" });
//         }

//         // 3. Hash password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // 4. Save new user
//         const newUser = new User({
//             name,
//             email,
//             password: hashedPassword,
//             role,
//         });
//         await newUser.save();

//         res.status(201).json({ success: true, message: "User registered successfully" });
//     } catch (err) {
//         console.error("Register error:", err.message);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// // ---------------------- LOGIN ----------------------
// router.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // 1. Validate input
//         if (!email || !password) {
//             return res.status(400).json({ success: false, message: "Please provide email and password" });
//         }

//         // 2. Find user
//         const user = await User.findOne({ email });
//         if (!user) {
//             console.log("❌ No user found with email:", email);
//             return res.status(400).json({ success: false, message: "User not found" });
//         }
//         // 3. Compare password
//         console.log("Entered password:", password);
//         console.log("Hashed in DB:", user.password);
//         const isMatch = await bcrypt.compare(password, user.password);
//         console.log("Compare result:", isMatch);


//         if (!isMatch) {
//             return res.status(400).json({ success: false, message: "Password is incorrect" });
//         }

//         // 4. Generate JWT
//         const token = jwt.sign(
//             { id: user._id, role: user.role },
//             process.env.JWT_SECRET || "secret123",
//             { expiresIn: "1h" }
//         );

//         res.status(200).json({
//             success: true,
//             message: "Login successful",
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role,
//             },
//         });
//     } catch (err) {
//         console.error("Login error:", err.message);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// // ---------------------- TEST ROUTE ----------------------
// router.get("/test", (req, res) => {
//     res.json({ success: true, message: "Auth route is working ✅" });
// });

// router.post("/parse-test", (req, res) => {
//     // Request parsing: Extract values from req.body
//     const { name, email } = req.body;

//     if (!name || !email) {
//         return res.status(400).json({
//             success: false,
//             message: "Missing required fields (name, email)",
//         });
//     }

//     res.json({
//         success: true,
//         message: "Request parsed successfully",
//         parsedData: { name, email }
//     });
// });

// // ---------------------- RESPONSE FORMATTING DEMO ----------------------
// router.get("/response-test", (req, res) => {
//     // Example formatted response
//     res.status(200).json({
//         success: true,
//         message: "Response formatting demo",
//         data: {
//             userId: "12345",
//             name: "Demo User",
//             email: "demo@example.com",
//             role: "tester"
//         }
//     });
// });

// module.exports = router;
// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User"); // adjust path to your User model

// const router = express.Router();

// // ---------------------- REGISTER ----------------------
// router.post("/register", async (req, res) => {
//     try {
//         const { name, email, password, role } = req.body;

//         // 1. Validate input
//         if (!name || !email || !password || !role) {
//             return res.status(400).json({ success: false, message: "Please fill all fields" });
//         }

//         // 2. Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ success: false, message: "User already exists" });
//         }

//         // 3. Hash password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // 4. Save new user
//         const newUser = new User({
//             name,
//             email,
//             password: hashedPassword,
//             role,
//         });
//         await newUser.save();

//         res.status(201).json({ success: true, message: "User registered successfully" });
//     } catch (err) {
//         console.error("Register error:", err.message);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// // ---------------------- LOGIN ----------------------
// router.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // 1. Validate input
//         if (!email || !password) {
//             return res.status(400).json({ success: false, message: "Please provide email and password" });
//         }

//         // 2. Find user
//         const user = await User.findOne({ email });
//         if (!user) {
//             console.log("❌ No user found with email:", email);
//             return res.status(400).json({ success: false, message: "User not found" });
//         }

//         // 3. Compare password
//         console.log("Entered password:", password);
//         console.log("Hashed in DB:", user.password);
//         const isMatch = await bcrypt.compare(password, user.password);
//         console.log("Compare result:", isMatch);

//         if (!isMatch) {
//             return res.status(400).json({ success: false, message: "Password is incorrect" });
//         }

//         // 4. Generate JWT
//         const token = jwt.sign(
//             { id: user._id, role: user.role },
//             process.env.JWT_SECRET || "secret123",
//             { expiresIn: "1h" }
//         );

//         res.status(200).json({
//             success: true,
//             message: "Login successful",
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role,
//             },
//         });
//     } catch (err) {
//         console.error("Login error:", err.message);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// // ---------------------- TEST ROUTE ----------------------
// router.get("/test", (req, res) => {
//     res.json({ success: true, message: "Auth route is working ✅" });
// });

// // ---------------------- BUSINESS LOGIC DEMO ----------------------
// router.get("/business-logic", (req, res) => {
//     const items = [
//         { name: "Book", price: 10 },
//         { name: "Pen", price: 2 },
//     ];
//     const total = items.reduce((sum, item) => sum + item.price, 0);

//     res.json({
//         success: true,
//         message: "Business logic executed successfully",
//         data: { items, total },
//     });
// });

// // ---------------------- INPUT VALIDATION DEMO ----------------------
// router.post("/validate-demo", (req, res) => {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//         return res.status(400).json({ success: false, message: "All fields are required" });
//     }
//     if (!email.includes("@")) {
//         return res.status(400).json({ success: false, message: "Invalid email format" });
//     }
//     if (password.length < 6) {
//         return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
//     }

//     res.json({ success: true, message: "Validation passed", data: { name, email } });
// });

// // ---------------------- REQUEST PARSING DEMO ----------------------
// router.post("/parse-test", (req, res) => {
//     const { name, email } = req.body;

//     if (!name || !email) {
//         return res.status(400).json({
//             success: false,
//             message: "Missing required fields (name, email)",
//         });
//     }

//     res.json({
//         success: true,
//         message: "Request parsed successfully",
//         parsedData: { name, email },
//     });
// });

// // ---------------------- RESPONSE FORMATTING DEMO ----------------------
// router.get("/response-test", (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: "Response formatting demo",
//         data: {
//             userId: "12345",
//             name: "Demo User",
//             email: "demo@example.com",
//             role: "tester",
//         },
//     });
// });

// module.exports = router;

// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const router = express.Router();

// // ---------------------- REGISTER ----------------------
// router.post("/register", async (req, res) => {
//     try {
//         const { name, email, password, role } = req.body;

//         // 1. Validate input
//         if (!name || !email || !password || !role) {
//             return res.status(400).json({ success: false, message: "Please fill all fields" });
//         }

//         // 2. Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ success: false, message: "User already exists" });
//         }

//         // 3. Hash password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // 4. Save new user
//         const newUser = new User({
//             name,
//             email: email.toLowerCase().trim(),
//             password: hashedPassword,
//             role,
//         });
//         await newUser.save();

//         res.status(201).json({ success: true, message: "User registered successfully" });
//     } catch (err) {
//         console.error("Register error:", err.message);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// // ---------------------- LOGIN ----------------------
// router.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // 1. Validate input
//         if (!email || !password) {
//             return res.status(400).json({ success: false, message: "Please provide email and password" });
//         }

//         // 2. Find user
//         const user = await User.findOne({ email: email.toLowerCase().trim() });
//         if (!user) {
//             return res.status(400).json({ success: false, message: "User not found" });
//         }

//         // 3. Compare password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ success: false, message: "Password is incorrect" });
//         }

//         // 4. Generate JWT
//         const token = jwt.sign(
//             { id: user._id, role: user.role },
//             process.env.JWT_SECRET || "secret123",
//             { expiresIn: "1h" }
//         );

//         res.status(200).json({
//             success: true,
//             message: "Login successful",
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role,
//             },
//         });
//     } catch (err) {
//         console.error("Login error:", err.message);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// // ---------------------- TEST ROUTE ----------------------
// router.get("/test", (req, res) => {
//     res.json({ success: true, message: "Auth route is working ✅" });
// });

// module.exports = router;

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// ---------------------- REGISTER ----------------------
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Validate input
        if (!name || !email || !password || !role) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email: (email || '').toLowerCase().trim() });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // 3. Save new user (model pre-save will hash password)
        const newUser = new User({
            name,
            email: (email || '').toLowerCase().trim(),
            password,
            role,
        });
        await newUser.save();

        // 4. Generate JWT and return user + token (align with login response)
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET || "secret123",
            { expiresIn: "1h" }
        );

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (err) {
        console.error("Register error:", err.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

// ---------------------- LOGIN ----------------------
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password" });
        }

        // 2. Find user
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // --- DEBUG LOGS ---
        console.log("Email received:", email);
        console.log("Password received:", password);
        console.log("Password in DB:", user.password);

        console.log("Password received (hex):", Buffer.from(password, "utf-8").toString("hex"));
        console.log("Password length:", password.length);

        // 3. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Do they match?", isMatch); // Debug log

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Password is incorrect" });
        }

        // 4. Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || "secret123",
            { expiresIn: "1h" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ---------------------- TEST ROUTE ----------------------
router.get("/test", (req, res) => {
    res.json({ success: true, message: "Auth route is working ✅" });
});

module.exports = router;
