si
const express = require("express");
const Vendor = require("../models/Vendor");
const Review = require("../models/Review");
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

// ---------------------- GET TOP RATED VENDORS ----------------------
/**
 * @route   GET /api/vendors/top-rated
 * @desc    Get top rated vendors with aggregated ratings
 * @access  Public
 * @query   sort: 'rating' (default), limit: number, category: string, timeframe: 'all'|'month'|'week'|'year'
 */
router.get("/top-rated", async (req, res) => {
    try {
        const { sort = 'rating', limit = 20, category, timeframe } = req.query;

        // Build match conditions
        const matchConditions = { status: 'approved' }; // Only approved reviews
        if (category && category !== 'all') {
            matchConditions.category = { $regex: category, $options: 'i' };
        }

        // Timeframe filter for reviews
        if (timeframe && timeframe !== 'all') {
            const now = new Date();
            let startDate;
            switch (timeframe) {
                case 'week':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'month':
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                case 'year':
                    startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    startDate = null;
            }
            if (startDate) {
                matchConditions.createdAt = { $gte: startDate };
            }
        }

        // Aggregate vendors with their average ratings and review counts
        const vendorsWithRatings = await Review.aggregate([
            { $match: matchConditions },
            {
                $group: {
                    _id: '$vendor',
                    averageRating: { $avg: '$rating' },
                    reviewCount: { $sum: 1 },
                    latestReview: { $max: '$createdAt' }
                }
            },
            {
                $lookup: {
                    from: 'vendors',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'vendor'
                }
            },
            { $unwind: '$vendor' },
            {
                $match: {
                    ...(category && category !== 'all' ? { 'vendor.category': { $regex: category, $options: 'i' } } : {})
                }
            },
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    name: '$vendor.shopName',
                    category: '$vendor.category',
                    address: '$vendor.address',
                    phone: '$vendor.phone',
                    rating: { $round: ['$averageRating', 1] },
                    reviewCount: 1,
                    verified: { $literal: true }, // Assume verified for now
                    isOpen: { $literal: true }, // Mock open status
                    distance: { $literal: "2.5 km" }, // Mock distance
                    tags: ['$vendor.category'], // Use category as tag
                    image: { $literal: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop" }, // Default image
                }
            },
            { $sort: { [sort === 'rating' ? 'rating' : 'reviewCount']: -1, latestReview: -1 } },
            { $limit: parseInt(limit) }
        ]);

        res.json({
            success: true,
            message: "Top rated vendors retrieved successfully",
            data: vendorsWithRatings,
        });
    } catch (err) {
        console.error("Get top rated vendors error:", err);
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

// ---------------------- GET REVIEWS FOR A VENDOR ----------------------
/**
 * @route   GET /api/vendors/:id/reviews
 * @desc    Get all reviews for a specific vendor
 * @access  Public
 */
router.get("/:id/reviews", async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({ success: false, message: "Vendor not found" });
        }

        const reviews = await Review.find({ vendor: req.params.id }).populate('customer', 'name email').sort({ createdAt: -1 });
        res.json({
            success: true,
            message: "Reviews retrieved successfully",
            data: reviews,
        });
    } catch (err) {
        console.error("Get reviews error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
