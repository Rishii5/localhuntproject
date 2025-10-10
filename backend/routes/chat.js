const express = require('express');
const Message = require('../models/Message');
const Vendor = require('../models/Vendor');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/chat/:vendorId/messages - send a message to a vendor
router.post('/:vendorId/messages', authMiddleware, async (req, res) => {
    try {
        const { vendorId } = req.params;
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ success: false, message: 'Message text is required' });
        }

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

        const message = await Message.create({
            sender: req.user.id,
            receiverVendor: vendor._id,
            text: text.trim(),
        });

        return res.status(201).json({ success: true, message: 'Message sent', data: message });
    } catch (err) {
        console.error('Send message error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/chat/:vendorId/messages - list conversation messages for a vendor
router.get('/:vendorId/messages', authMiddleware, async (req, res) => {
    try {
        const { vendorId } = req.params;
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

        const messages = await Message.find({ receiverVendor: vendorId })
            .sort({ createdAt: 1 });

        return res.json({ success: true, message: 'Messages fetched', data: messages });
    } catch (err) {
        console.error('List messages error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;



