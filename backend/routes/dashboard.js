const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getDashboard } = require('../controllers/dashboardController');

// All dashboard routes require authentication
router.use(authMiddleware);

// @route GET /api/dashboard
// @desc Get dashboard data based on user role
// @access Private
router.get('/', getDashboard);

module.exports = router;
