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

        let vendor = null;
        let isMockVendor = false;

        // Check if vendorId is a valid ObjectId
        if (vendorId.match(/^[0-9a-fA-F]{24}$/)) {
            vendor = await Vendor.findById(vendorId);
        }

        // If not found and vendorId is numeric (mock data), create a temporary vendor record
        if (!vendor && vendorId.match(/^\d+$/)) {
            isMockVendor = true;
            // Create a mock vendor for demo purposes
            vendor = {
                _id: vendorId,
                shopName: `Mock Business ${vendorId}`,
                owner: null // No owner for mock vendors
            };
        }

        if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

        const message = await Message.create({
            sender: req.user.id,
            receiverVendor: isMockVendor ? vendorId : vendor._id,
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
        let vendor = null;
        let isMockVendor = false;

        // Check if vendorId is a valid ObjectId
        if (vendorId.match(/^[0-9a-fA-F]{24}$/)) {
            vendor = await Vendor.findById(vendorId);
        }

        // If not found and vendorId is numeric (mock data), create a temporary vendor record
        if (!vendor && vendorId.match(/^\d+$/)) {
            isMockVendor = true;
            vendor = {
                _id: vendorId,
                shopName: `Mock Business ${vendorId}`,
                owner: null // No owner for mock vendors
            };
        }

        if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiverVendor: vendorId },
                // For mock vendors, we can't have replies from vendor owner
                ...(isMockVendor ? [] : [{ sender: vendor.owner, receiver: req.user.id }])
            ]
        })
            .populate('sender', 'name')
            .populate('receiver', 'name')
            .sort({ createdAt: 1 });

        return res.json({ success: true, message: 'Messages fetched', data: messages });
    } catch (err) {
        console.error('List messages error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/chat/conversations - get all conversations for current user
router.get('/conversations', authMiddleware, async (req, res) => {
    try {
        const user = req.user;

        let conversations = [];

        if (user.role === 'customer') {
            // Get all vendors the customer has messaged
            const customerMessages = await Message.find({ sender: user.id })
                .distinct('receiverVendor')
                .populate('receiverVendor', 'shopName category address');

            conversations = customerMessages.map(vendor => ({
                vendor: vendor,
                lastMessage: null, // Could add last message logic
                unreadCount: 0 // Could add unread count logic
            }));
        } else if (user.role === 'vendor') {
            // Get all customers who have messaged this vendor
            const vendorBusinesses = await Vendor.find({ owner: user.id });
            const vendorIds = vendorBusinesses.map(v => v._id);

            const vendorMessages = await Message.find({ receiverVendor: { $in: vendorIds } })
                .distinct('sender')
                .populate('sender', 'name email');

            conversations = vendorMessages.map(customer => ({
                customer: customer,
                lastMessage: null,
                unreadCount: 0
            }));
        }

        return res.json({ success: true, data: conversations });
    } catch (err) {
        console.error('Get conversations error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;



