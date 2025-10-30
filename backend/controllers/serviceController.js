const Service = require('../models/Service');
const Vendor = require('../models/Vendor');
const { serviceCreateSchema, serviceUpdateSchema } = require('../validation/serviceValidation');
const { successResponse, errorResponse } = require('../utils/response');

exports.createService = async (req, res, next) => {
  try {
    // Verify vendor ownership
    const vendor = await Vendor.findOne({ owner: req.user._id });
    if (!vendor) return errorResponse(res, 404, 'Vendor profile not found');

    const { error, value } = serviceCreateSchema.validate(req.body);
    if (error) return errorResponse(res, 400, error.details[0].message);

    const service = await Service.create({ ...value, vendor: vendor._id });
    return successResponse(res, 201, service);
  } catch (err) {
    next(err);
  }
};

exports.getServices = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, active } = req.query;

    // If user is vendor, only show their services
    const filter = {};
    if (req.user.role === 'vendor') {
      const vendor = await Vendor.findOne({ owner: req.user._id });
      if (vendor) filter.vendor = vendor._id;
    }

    if (category) filter.category = new RegExp(category, 'i');
    if (active !== undefined) filter.isActive = active === 'true';

    const skip = (Math.max(parseInt(page, 10), 1) - 1) * parseInt(limit, 10);
    const services = await Service.find(filter)
      .populate('vendor', 'shopName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    return successResponse(res, 200, services);
  } catch (err) {
    next(err);
  }
};

exports.getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id).populate('vendor', 'shopName');
    if (!service) return errorResponse(res, 404, 'Service not found');

    // Check if user can access this service
    if (req.user.role === 'vendor') {
      const vendor = await Vendor.findOne({ owner: req.user._id });
      if (!vendor || !service.vendor.equals(vendor._id)) {
        return errorResponse(res, 403, 'Not authorized to access this service');
      }
    }

    return successResponse(res, 200, service);
  } catch (err) {
    next(err);
  }
};

exports.updateService = async (req, res, next) => {
  try {
    const { error, value } = serviceUpdateSchema.validate(req.body);
    if (error) return errorResponse(res, 400, error.details[0].message);

    const service = await Service.findById(req.params.id);
    if (!service) return errorResponse(res, 404, 'Service not found');

    // Check ownership
    const vendor = await Vendor.findOne({ owner: req.user._id });
    if (!vendor || !service.vendor.equals(vendor._id)) {
      return errorResponse(res, 403, 'Not authorized to update this service');
    }

    Object.assign(service, value);
    await service.save();
    return successResponse(res, 200, service);
  } catch (err) {
    next(err);
  }
};

exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return errorResponse(res, 404, 'Service not found');

    // Check ownership
    const vendor = await Vendor.findOne({ owner: req.user._id });
    if (!vendor || !service.vendor.equals(vendor._id)) {
      return errorResponse(res, 403, 'Not authorized to delete this service');
    }

    await service.deleteOne();
    return successResponse(res, 200, 'Service deleted');
  } catch (err) {
    next(err);
  }
};
