const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        receiverVendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
        text: { type: String, required: true, trim: true },
        readAt: { type: Date },
    },
    { timestamps: true }
);

messageSchema.index({ receiverVendor: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);



