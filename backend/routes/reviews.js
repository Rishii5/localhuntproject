const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createReview,
  getReviews,
  getReviewById,
  respondToReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

// All routes require authentication
router.use(authMiddleware);

// Create review
router.post('/', createReview);

// Get reviews (with optional filters)
router.get('/', getReviews);

// Get review by ID
router.get('/:id', getReviewById);

// Vendor respond to review
router.post('/:id/respond', respondToReview);

// Update review (customer only)
router.put('/:id', updateReview);

// Delete review
router.delete('/:id', deleteReview);

module.exports = router;
