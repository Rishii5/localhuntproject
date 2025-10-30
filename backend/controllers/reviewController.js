const Review = require('../models/Review');
const Vendor = require('../models/Vendor');
const Service = require('../models/Service');
const { reviewCreateSchema, reviewUpdateSchema, vendorResponseSchema } = require('../validation/reviewValidation');
const { successResponse, errorResponse } = require('../utils/response');

exports.createReview = async (req, res, next) => {
  try {
    const { error, value } = reviewCreateSchema.validate(req.body);
    if (error) return errorResponse(res, 400, error.details[0].message);

    // Verify vendor exists
    const vendor = await Vendor.findById(value.vendor);
    if (!vendor) return errorResponse(res, 404, 'Vendor not found');

    // If service is specified, verify it belongs to the vendor
    if (value.service) {
      const service = await Service.findById(value.service);
      if (!service || !service.vendor.equals(vendor._id)) {
        return errorResponse(res, 400, 'Service does not belong to this vendor');
      }
    }

    const review = await Review.create({ ...value, customer: req.user._id });
    return successResponse(res, 201, review);
  } catch (err) {
    next(err);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, vendor: vendorId, service: serviceId, status } = req.query;

    const filter = {};
    if (vendorId) filter.vendor = vendorId;
    if (serviceId) filter.service = serviceId;
    if (status) filter.status = status;

    // If user is vendor, only show reviews for their business
    if (req.user.role === 'vendor') {
      const vendor = await Vendor.findOne({ owner: req.user._id });
      if (vendor) filter.vendor = vendor._id;
    }

    const skip = (Math.max(parseInt(page, 10), 1) - 1) * parseInt(limit, 10);
    const reviews = await Review.find(filter)
      .populate('customer', 'name')
      .populate('vendor', 'shopName')
      .populate('service', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    return successResponse(res, 200, reviews);
  } catch (err) {
    next(err);
  }
};

exports.getReviewById = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('customer', 'name')
      .populate('vendor', 'shopName')
      .populate('service', 'name');

    if (!review) return errorResponse(res, 404, 'Review not found');

    // Check access permissions
    if (req.user.role === 'vendor') {
      const vendor = await Vendor.findOne({ owner: req.user._id });
      if (!vendor || !review.vendor.equals(vendor._id)) {
        return errorResponse(res, 403, 'Not authorized to access this review');
      }
    }

    return successResponse(res, 200, review);
  } catch (err) {
    next(err);
  }
};

exports.respondToReview = async (req, res, next) => {
  try {
    const { error, value } = vendorResponseSchema.validate(req.body);
    if (error) return errorResponse(res, 400, error.details[0].message);

    const review = await Review.findById(req.params.id);
    if (!review) return errorResponse(res, 404, 'Review not found');

    // Check if user is the vendor owner
    const vendor = await Vendor.findOne({ owner: req.user._id });
    if (!vendor || !review.vendor.equals(vendor._id)) {
      return errorResponse(res, 403, 'Not authorized to respond to this review');
    }

    review.vendorResponse = {
      text: value.text,
      respondedAt: new Date()
    };
    await review.save();

    return successResponse(res, 200, review);
  } catch (err) {
    next(err);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const { error, value } = reviewUpdateSchema.validate(req.body);
    if (error) return errorResponse(res, 400, error.details[0].message);

    const review = await Review.findById(req.params.id);
    if (!review) return errorResponse(res, 404, 'Review not found');

    // Only customer can update their own review
    if (!review.customer.equals(req.user._id)) {
      return errorResponse(res, 403, 'Not authorized to update this review');
    }

    Object.assign(review, value);
    await review.save();
    return successResponse(res, 200, review);
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return errorResponse(res, 404, 'Review not found');

    // Check permissions
    if (req.user.role === 'admin' || review.customer.equals(req.user._id)) {
      await review.deleteOne();
      return successResponse(res, 200, 'Review deleted');
    }

    return errorResponse(res, 403, 'Not authorized to delete this review');
  } catch (err) {
    next(err);
  }
};
