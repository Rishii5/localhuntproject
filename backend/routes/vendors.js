// const express = require('express');
// const router = express.Router();
// const { addVendor, getVendors, getVendorById } = require('../controllers/vendorController');

// router.post('/add', addVendor);
// router.get('/', getVendors);
// router.get('/:id', getVendorById);

// module.exports = router;
// routes/vendorRoutes.js

// const express = require('express');
// const router = express.Router();
// const Vendor = require('../models/Vendor');

// // ✅ Search nearby vendors by category and location
// // Example: GET /api/vendors/search?lat=12.97&lng=77.59&category=Food
// router.get('/search', async (req, res) => {
//     const { lat, lng, category } = req.query;

//     if (!lat || !lng || !category) {
//         return res.status(400).json({ error: 'Latitude, longitude, and category are required' });
//     }

//     try {
//         const vendors = await Vendor.find({
//             category: category,
//             location: {
//                 $near: {
//                     $geometry: {
//                         type: 'Point',
//                         coordinates: [parseFloat(lng), parseFloat(lat)] // longitude first
//                     },
//                     $maxDistance: 5000 // 5 km radius
//                 }
//             }
//         });

//         res.json(vendors);
//     } catch (err) {
//         console.error('❌ Search error:', err);
//         res.status(500).json({ error: 'Search failed' });
//     }
// });

// // ✅ Temporary route to add a test vendor
// // Use: POST /api/vendors/add-test
// router.post('/add-test', async (req, res) => {
//     try {
//         const newVendor = new Vendor({
//             name: 'Test Kirana Shop',
//             category: 'Kirana',
//             location: {
//                 type: 'Point',
//                 coordinates: [78.486671, 17.385044] // [longitude, latitude]
//             }
//         });

//         await newVendor.save();
//         res.json({ message: '✅ Test vendor added', vendor: newVendor });
//     } catch (err) {
//         console.error('❌ Error adding test vendor:', err);
//         res.status(500).json({ error: 'Failed to add test vendor' });
//     }
// });

// module.exports = router;
// const express = require('express');
// const router = express.Router();
// const Vendor = require('../models/Vendor');
// console.log('✅ vendors.js route file loaded');
// router.get('/', (req, res) => {
//     res.json({ message: '✅ Vendors route is working' });
// });
// router.get('/search', async (req, res) => {
//     const { lat, lng, category } = req.query;

//     if (!lat || !lng || !category) {
//         return res.status(400).json({ error: 'Latitude, longitude, and category are required' });
//     }

//     try {
//         const vendors = await Vendor.find({
//             category: category,
//             location: {
//                 $near: {
//                     $geometry: {
//                         type: 'Point',
//                         coordinates: [parseFloat(lng), parseFloat(lat)] // Note: longitude first
//                     },
//                     $maxDistance: 5000 // in meters (5 km)
//                 }
//             }
//         });

//         res.json(vendors);
//     } catch (err) {
//         console.error('❌ Search error:', err);
//         res.status(500).json({ error: 'Search failed' });
//     }
// });
// router.post('/add-test', async (req, res) => {
//     try {
//         const newVendor = new Vendor({
//             name: 'Test Kirana Shop',
//             category: 'Kirana',
//             location: {
//                 type: 'Point',
//                 coordinates: [78.486671, 17.385044] // [longitude, latitude]
//             }
//         });

//         await newVendor.save();
//         res.status(201).json({ message: '✅ Test vendor added successfully', vendor: newVendor });
//     } catch (err) {
//         console.error('❌ Error adding test vendor:', err);
//         res.status(500).json({ error: 'Failed to add test vendor' });
//     }
// });
// module.exports = router;
// const express = require('express');
// const router = express.Router();
// const Vendor = require('../models/Vendor');
// const authMiddleware = require('../middleware/authMiddleware');
// const { successResponse, errorResponse } = require('../utils/response');
// const Joi = require('joi');

// // Vendor validation schema
// const vendorSchema = Joi.object({
//     name: Joi.string().min(3).max(50).required(),
//     category: Joi.string().required(),
//     lat: Joi.number().required(),
//     lng: Joi.number().required()
// });

// // @route   GET /vendors/test
// router.get('/test', (req, res) => {
//     res.json(successResponse('✅ Vendors route is working'));
// });

// // @route   POST /vendors/add
// // @desc    Add vendor (only vendor role allowed)
// router.post('/add', authMiddleware, async (req, res) => {
//     try {
//         if (req.user.role !== 'vendor') {
//             return res.status(403).json(errorResponse('Only vendors can add shops'));
//         }

//         const { error } = vendorSchema.validate(req.body);
//         if (error) return res.status(400).json(errorResponse(error.details[0].message));

//         const { name, category, lat, lng } = req.body;

//         const newVendor = new Vendor({
//             name,
//             category,
//             owner: req.user.id,
//             location: {
//                 type: 'Point',
//                 coordinates: [lng, lat]
//             }
//         });

//         await newVendor.save();
//         res.status(201).json(successResponse('Vendor added successfully', newVendor));
//     } catch (err) {
//         console.error('❌ Error adding vendor:', err);
//         res.status(500).json(errorResponse('Failed to add vendor'));
//     }
// });

// // @route   GET /vendors
// // @desc    Get all vendors (with optional category filter)
// router.get('/', async (req, res) => {
//     try {
//         const { category } = req.query;
//         const filter = category ? { category } : {};
//         const vendors = await Vendor.find(filter);
//         res.json(successResponse('Vendors fetched successfully', vendors));
//     } catch (err) {
//         console.error('❌ Error fetching vendors:', err);
//         res.status(500).json(errorResponse('Failed to fetch vendors'));
//     }
// });

// // @route   GET /vendors/search/nearby
// // @desc    Search vendors near a location
// router.get('/search/nearby', async (req, res) => {
//     const { lat, lng, category } = req.query;

//     if (!lat || !lng) {
//         return res.status(400).json(errorResponse('Latitude and longitude are required'));
//     }

//     try {
//         const vendors = await Vendor.find({
//             ...(category && { category }),
//             location: {
//                 $near: {
//                     $geometry: {
//                         type: 'Point',
//                         coordinates: [parseFloat(lng), parseFloat(lat)]
//                     },
//                     $maxDistance: 5000 // 5 km
//                 }
//             }
//         });

//         res.json(successResponse('Nearby vendors fetched', vendors));
//     } catch (err) {
//         console.error('❌ Search error:', err);
//         res.status(500).json(errorResponse('Search failed'));
//     }
// });

// // @route   PUT /vendors/:id
// // @desc    Update vendor (only owner can update)
// router.put('/:id', authMiddleware, async (req, res) => {
//     try {
//         const vendor = await Vendor.findById(req.params.id);
//         if (!vendor) return res.status(404).json(errorResponse('Vendor not found'));

//         if (vendor.owner.toString() !== req.user.id) {
//             return res.status(403).json(errorResponse('Not authorized to update this vendor'));
//         }

//         const { name, category, lat, lng } = req.body;
//         if (lat && lng) {
//             vendor.location = { type: 'Point', coordinates: [lng, lat] };
//         }
//         if (name) vendor.name = name;
//         if (category) vendor.category = category;

//         await vendor.save();
//         res.json(successResponse('Vendor updated successfully', vendor));
//     } catch (err) {
//         console.error('❌ Update error:', err);
//         res.status(500).json(errorResponse('Failed to update vendor'));
//     }
// });

// // @route   DELETE /vendors/:id
// // @desc    Delete vendor (only owner can delete)
// router.delete('/:id', authMiddleware, async (req, res) => {
//     try {
//         const vendor = await Vendor.findById(req.params.id);
//         if (!vendor) return res.status(404).json(errorResponse('Vendor not found'));

//         if (vendor.owner.toString() !== req.user.id) {
//             return res.status(403).json(errorResponse('Not authorized to delete this vendor'));
//         }

//         await vendor.deleteOne();
//         res.json(successResponse('Vendor deleted successfully'));
//     } catch (err) {
//         console.error('❌ Delete error:', err);
//         res.status(500).json(errorResponse('Failed to delete vendor'));
//     }
// });

// module.exports = router;
// middleware/authMiddleware.js
// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//     try {
//         // Check for token
//         const authHeader = req.headers["authorization"];
//         if (!authHeader) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Authorization token missing",
//             });
//         }

//         // Token should be in format "Bearer <token>"
//         const token = authHeader.split(" ")[1];
//         if (!token) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Authorization token missing",
//             });
//         }

//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Attach user info from token to request
//         req.user = decoded;

//         next();
//     } catch (err) {
//         console.error("Auth Error:", err.message);
//         return res.status(401).json({
//             success: false,
//             message: "Invalid or expired token",
//         });
//     }
// };
// const express = require("express");
// const Vendor = require("../models/Vendor");
// const authMiddleware = require("../middleware/authMiddleware.js");

// const router = express.Router();

// /**
//  * @route   POST /api/vendors
//  * @desc    Register/Add new vendor
//  * @access  Private (requires token)
//  */
// router.post("/", authMiddleware, async (req, res) => {
//     try {
//         const { shopName, category, location } = req.body;

//         const vendor = new Vendor({
//             shopName,
//             category,
//             location,
//             createdBy: req.user.id, // comes from JWT
//         });

//         await vendor.save();

//         res.status(201).json({
//             success: true,
//             message: "Vendor created successfully",
//             data: vendor,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// /**
//  * @route   PUT /api/vendors/:id
//  * @desc    Update vendor (only creator or admin)
//  * @access  Private
//  */
// router.put("/:id", authMiddleware, async (req, res) => {
//     try {
//         const vendor = await Vendor.findById(req.params.id);
//         if (!vendor) {
//             return res.status(404).json({ success: false, message: "Vendor not found" });
//         }

//         // Only allow owner or admin to update
//         if (vendor.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
//             return res.status(403).json({ success: false, message: "Not authorized" });
//         }

//         const { shopName, category, location } = req.body;

//         vendor.shopName = shopName || vendor.shopName;
//         vendor.category = category || vendor.category;
//         vendor.location = location || vendor.location;

//         await vendor.save();

//         res.json({
//             success: true,
//             message: "Vendor updated successfully",
//             data: vendor,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// /**
//  * @route   GET /api/vendors
//  * @desc    Get all vendors
//  * @access  Public
//  */
// router.get("/", async (req, res) => {
//     try {
//         const vendors = await Vendor.find();
//         res.json({
//             success: true,
//             message: "Vendors retrieved successfully",
//             data: vendors,
//         });
//     } catch (err) {
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// /**
//  * @route   GET /api/vendors/search
//  * @desc    Search vendors by shopName, category, or location
//  * @access  Public
//  * Example: /api/vendors/search?shopName=coffee&location=NY
//  */
// router.get("/search", async (req, res) => {
//     try {
//         const { shopName, category, location } = req.query;

//         // Build a dynamic query
//         const query = {};
//         if (shopName) query.shopName = { $regex: shopName, $options: "i" };
//         if (category) query.category = { $regex: category, $options: "i" };
//         if (location) query.location = { $regex: location, $options: "i" };

//         const vendors = await Vendor.find(query);

//         res.json({
//             success: true,
//             message: "Vendors search results",
//             data: vendors,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// module.exports = router;
// routes/vendors.js
// const express = require("express");
// const Vendor = require("../models/Vendor");
// const authMiddleware = require("../middleware/authMiddleware");

// const router = express.Router();

// /**
//  * @route   POST /api/vendors
//  * @desc    Register/Add new vendor
//  * @access  Private (requires token)
//  */
// router.post("/", authMiddleware, async (req, res) => {
//     try {
//         const { shopName, category, location, address, phone, description } = req.body;

//         if (!shopName || !category || !location || !address) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Fields shopName, category, address, location are required",
//             });
//         }

//         const vendor = new Vendor({
//             owner: req.user.id, // comes from JWT
//             shopName,
//             category,
//             address,
//             phone,
//             description,
//             location,
//         });

//         await vendor.save();

//         res.status(201).json({
//             success: true,
//             message: "Vendor created successfully",
//             data: vendor,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// /**
//  * @route   PUT /api/vendors/:id
//  * @desc    Update vendor (only creator or admin)
//  * @access  Private
//  */
// router.put("/:id", authMiddleware, async (req, res) => {
//     try {
//         const vendor = await Vendor.findById(req.params.id);
//         if (!vendor) {
//             return res.status(404).json({ success: false, message: "Vendor not found" });
//         }

//         // Only allow owner or admin to update
//         if (vendor.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
//             return res.status(403).json({ success: false, message: "Not authorized" });
//         }

//         const { shopName, category, location } = req.body;

//         vendor.shopName = shopName || vendor.shopName;
//         vendor.category = category || vendor.category;
//         vendor.location = location || vendor.location;

//         await vendor.save();

//         res.json({
//             success: true,
//             message: "Vendor updated successfully",
//             data: vendor,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// /**
//  * @route   GET /api/vendors
//  * @desc    Get all vendors
//  * @access  Public
//  */
// router.get("/", async (req, res) => {
//     try {
//         const vendors = await Vendor.find();
//         res.json({
//             success: true,
//             message: "Vendors retrieved successfully",
//             data: vendors,
//         });
//     } catch (err) {
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// /**
//  * @route   GET /api/vendors/search
//  * @desc    Search vendors by shopName, category, or location
//  * @access  Public
//  * Example: /api/vendors/search?shopName=coffee&location=NY
//  */
// router.get("/search", async (req, res) => {
//     try {
//         const { shopName, category, location } = req.query;

//         // Build a dynamic query
//         const query = {};
//         if (shopName) query.shopName = { $regex: shopName, $options: "i" };
//         if (category) query.category = { $regex: category, $options: "i" };
//         if (location) query.location = { $regex: location, $options: "i" };

//         const vendors = await Vendor.find(query);

//         res.json({
//             success: true,
//             message: "Vendors search results",
//             data: vendors,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// module.exports = router;
const express = require("express");
const Vendor = require("../models/Vendor");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ---------------------- CREATE VENDOR ----------------------
/**
 * @route   POST /api/vendors
 * @desc    Register/Add new vendor
 * @access  Private (requires token)
 */
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { shopName, category, location, address, phone, description } = req.body;

        if (!shopName || !category || !location || !address) {
            return res.status(400).json({
                success: false,
                message: "Fields shopName, category, address, location are required",
            });
        }

        // Check if vendor already exists for this owner
        const existingVendor = await Vendor.findOne({ shopName, owner: req.user.id });
        if (existingVendor) {
            return res.status(400).json({ success: false, message: "Vendor already exists for this user" });
        }

        const vendor = new Vendor({
            owner: req.user.id, // comes from JWT
            shopName,
            category,
            address,
            phone,
            description,
            location,
        });

        await vendor.save();

        res.status(201).json({
            success: true,
            message: "Vendor created successfully",
            data: vendor,
        });
    } catch (err) {
        console.error("Vendor creation error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ---------------------- UPDATE VENDOR ----------------------
/**
 * @route   PUT /api/vendors/:id
 * @desc    Update vendor (only creator or admin)
 * @access  Private
 */
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({ success: false, message: "Vendor not found" });
        }

        // Only allow owner or admin to update
        if (vendor.owner.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        const { shopName, category, location, address, phone, description } = req.body;

        vendor.shopName = shopName || vendor.shopName;
        vendor.category = category || vendor.category;
        vendor.location = location || vendor.location;
        vendor.address = address || vendor.address;
        vendor.phone = phone || vendor.phone;
        vendor.description = description || vendor.description;

        await vendor.save();

        res.json({
            success: true,
            message: "Vendor updated successfully",
            data: vendor,
        });
    } catch (err) {
        console.error("Vendor update error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ---------------------- GET ALL VENDORS ----------------------
/**
 * @route   GET /api/vendors
 * @desc    Get all vendors
 * @access  Public
 */
router.get("/", async (req, res) => {
    try {
        const { category } = req.query;
        const filter = {};
        if (category) {
            filter.category = { $regex: category, $options: "i" };
        }
        const vendors = await Vendor.find(filter);
        res.json({
            success: true,
            message: "Vendors retrieved successfully",
            data: vendors,
        });
    } catch (err) {
        console.error("Get vendors error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ---------------------- SEARCH VENDORS (text + optional location) ----------------------
/**
 * @route   GET /api/vendors/search
 * @desc    Search vendors by shopName/name/category/address and optional location radius
 * @access  Public
 * Examples:
 *   - /api/vendors/search?q=hotel
 *   - /api/vendors/search?q=hotel&lat=12.97&lng=77.59&radius=5000
 */
router.get("/search", async (req, res) => {
    try {
        const { q, lat, lng, radius, locationText } = req.query;

        const filters = [];
        if (q) {
            const regex = { $regex: String(q), $options: "i" };
            filters.push({ shopName: regex });
            filters.push({ category: regex });
            filters.push({ address: regex });
        }
        if (locationText && !lat && !lng) {
            const locRegex = { $regex: String(locationText), $options: "i" };
            // Make textual location an OR-match (do not over-restrict results when no geo provided)
            filters.push({ address: locRegex });
        }

        // Base query: OR across text fields if q provided, else empty (match all)
        let query = filters.length ? { $or: filters } : {};

        // Geospatial filter if lat/lng provided
        if (lat && lng) {
            const maxDistance = Math.min(parseInt(String(radius || 5000), 10), 50000) || 5000; // cap at 50km
            query = {
                ...query,
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [parseFloat(String(lng)), parseFloat(String(lat))],
                        },
                        $maxDistance: maxDistance,
                    },
                },
            };
        }

        // Note: when only locationText is provided, filters already include address regex via OR above

        const vendors = await Vendor.find(query).limit(100);

        res.json({
            success: true,
            message: "Vendors search results",
            data: vendors,
        });
    } catch (err) {
        console.error("Vendor search error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ---------------------- GET VENDOR BY ID ----------------------
/**
 * @route   GET /api/vendors/:id
 * @desc    Get vendor by id
 * @access  Public
 */
router.get("/:id", async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({ success: false, message: "Vendor not found" });
        }
        res.json({ success: true, message: "Vendor retrieved", data: vendor });
    } catch (err) {
        console.error("Get vendor by id error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
