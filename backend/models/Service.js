const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, min: 0 }, // in minutes
    category: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    images: [{ type: String }], // URLs to service images
    tags: [{ type: String }], // searchable tags
}, { timestamps: true });

// Index for efficient queries
serviceSchema.index({ vendor: 1, isActive: 1 });
serviceSchema.index({ category: 1 });

module.exports = mongoose.model('Service', serviceSchema);
