const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' }, // optional, if review is for a specific service
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    comment: { type: String, required: true },
    vendorResponse: {
        text: { type: String },
        respondedAt: { type: Date }
    },
    isVerified: { type: Boolean, default: false }, // verified purchase/review
    helpful: { type: Number, default: 0 }, // helpful votes
    images: [{ type: String }], // review images
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

// Index for efficient queries
reviewSchema.index({ vendor: 1, status: 1 });
reviewSchema.index({ customer: 1 });
reviewSchema.index({ rating: -1 });

module.exports = mongoose.model('Review', reviewSchema);
