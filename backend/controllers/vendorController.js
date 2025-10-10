// const Vendor = require('../models/Vendor');

// exports.addVendor = async (req, res) => {
//   try {
//     const vendor = new Vendor(req.body);
//     await vendor.save();
//     res.status(201).json(vendor);
//   } catch (err) {
//     res.status(400).json({ error: 'Failed to add vendor' });
//   }
// };

// exports.getVendors = async (req, res) => {
//   try {
//     const vendors = await Vendor.find();
//     res.json(vendors);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch vendors' });
//   }
// };

// exports.getVendorById = async (req, res) => {
//   try {
//     const vendor = await Vendor.findById(req.params.id);
//     if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
//     res.json(vendor);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch vendor' });
//   }
// };
// controllers/vendorController.js
const Vendor = require('../models/Vendor');
const { vendorCreateSchema, vendorUpdateSchema } = require('../validation/vendorValidation');
const { successResponse, errorResponse } = require('../utils/response');

exports.addVendor = async (req, res, next) => {
  try {
    if (req.user.role !== 'vendor') return errorResponse(res, 403, 'Only vendor accounts can add shops');

    const { error, value } = vendorCreateSchema.validate(req.body);
    if (error) return errorResponse(res, 400, error.details[0].message);

    const vendor = await Vendor.create({ ...value, owner: req.user._id });
    return successResponse(res, 201, vendor);
  } catch (err) {
    next(err);
  }
};

exports.getVendors = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = new RegExp(category, 'i');

    const skip = (Math.max(parseInt(page, 10), 1) - 1) * parseInt(limit, 10);
    const vendors = await Vendor.find(filter).skip(skip).limit(parseInt(limit, 10)).populate('owner', 'name email');
    return successResponse(res, 200, vendors);
  } catch (err) {
    next(err);
  }
};

exports.getVendorById = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate('owner', 'name email');
    if (!vendor) return errorResponse(res, 404, 'Vendor not found');
    return successResponse(res, 200, vendor);
  } catch (err) {
    next(err);
  }
};

exports.updateVendor = async (req, res, next) => {
  try {
    const { error, value } = vendorUpdateSchema.validate(req.body);
    if (error) return errorResponse(res, 400, error.details[0].message);

    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return errorResponse(res, 404, 'Vendor not found');
    if (!vendor.owner.equals(req.user._id)) return errorResponse(res, 403, 'Not authorized to update this vendor');

    Object.assign(vendor, value);
    await vendor.save();
    return successResponse(res, 200, vendor);
  } catch (err) {
    next(err);
  }
};

exports.deleteVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return errorResponse(res, 404, 'Vendor not found');
    if (!vendor.owner.equals(req.user._id)) return errorResponse(res, 403, 'Not authorized to delete this vendor');

    await vendor.deleteOne();
    return successResponse(res, 200, 'Vendor deleted');
  } catch (err) {
    next(err);
  }
};

exports.searchNearby = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5000, category, limit = 20 } = req.query;
    if (!lat || !lng) return errorResponse(res, 400, 'lat and lng are required');

    const coords = [parseFloat(lng), parseFloat(lat)];
    const match = {
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: coords },
          $maxDistance: parseInt(radius, 10)
        }
      }
    };
    if (category) match.category = new RegExp(category, 'i');

    const vendors = await Vendor.find(match).limit(parseInt(limit, 10));
    return successResponse(res, 200, vendors);
  } catch (err) {
    next(err);
  }
};
