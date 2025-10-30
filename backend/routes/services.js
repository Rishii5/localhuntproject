const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService
} = require('../controllers/serviceController');

// All routes require authentication
router.use(authMiddleware);

// Create service
router.post('/', createService);

// Get services (with optional filters)
router.get('/', getServices);

// Get service by ID
router.get('/:id', getServiceById);

// Update service
router.put('/:id', updateService);

// Delete service
router.delete('/:id', deleteService);

module.exports = router;
