// const mongoose = require('mongoose');

// const vendorSchema = new mongoose.Schema({
//     name: String,
//     category: String,
//     location: String,
//     contact: String,
//     description: String,
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
// });

// module.exports = mongoose.model('Vendor', vendorSchema);
// models/Vendor.js

// const mongoose = require('mongoose');

// const vendorSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     category: { type: String, required: true },
//     address: { type: String, default: '' },
//     phone: { type: String, default: '' },
//     location: {
//         type: {
//             type: String,
//             enum: ['Point'],
//             default: 'Point'
//         },
//         coordinates: {
//             type: [Number], // [longitude, latitude]
//             required: true
//         }
//     }
// }, {
//     timestamps: true // Automatically adds createdAt and updatedAt
// });

// // ✅ Add geospatial index to enable geolocation queries
// vendorSchema.index({ location: '2dsphere' });

// module.exports = mongoose.model('Vendor', vendorSchema);

// models/Vendor.js
const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shopName: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    address: { type: String, required: true },
    phone: { type: String },
    description: { type: String },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true } // [lng, lat]
    }
}, { timestamps: true });

vendorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Vendor', vendorSchema);
