const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Category = require('../models/Category');
const Message = require('../models/Message');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * @desc Get dashboard data based on user role
 * @route GET /api/dashboard
 * @access Private
 */
exports.getDashboard = async (req, res, next) => {
  try {
    const user = req.user;
    let dashboardData = {};

    switch (user.role) {
      case 'customer':
        dashboardData = await getCustomerDashboard(user);
        break;
      case 'vendor':
        dashboardData = await getVendorDashboard(user);
        break;
      case 'admin':
        dashboardData = await getAdminDashboard();
        break;
      default:
        return errorResponse(res, 403, 'Invalid user role');
    }

    return successResponse(res, 200, {
      ...dashboardData,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Customer Dashboard Data
 */
const getCustomerDashboard = async (user) => {
  // Get recent messages
  const recentMessages = await Message.find({ 
    $or: [{ sender: user._id }, { receiver: user._id }] 
  })
  .populate('sender', 'name')
  .populate('receiver', 'name')
  .sort({ createdAt: -1 })
  .limit(5)
  .select('-messages'); // Don't send full chat history

  // Mock favorites - in real app, this would be from a favorites collection
  const favorites = []; // await getUserFavorites(user._id);

  // Recent searches - mock
  const recentSearches = ['Restaurants near me', 'Hospitals', 'Fitness centers'];

  return {
    profile: {
      name: user.name,
      email: user.email,
      joined: user.createdAt
    },
    stats: {
      totalMessages: await Message.countDocuments({
        $or: [{ sender: user._id }, { receiver: user._id }]
      }),
      favoritesCount: favorites.length
    },
    recentMessages,
    favorites,
    recentSearches
  };
};

/**
 * Vendor Dashboard Data
 */
const getVendorDashboard = async (user) => {
  // Get vendor's businesses
  const businesses = await Vendor.find({ owner: user._id })
    .populate('category', 'name')
    .select('-password'); // Vendor might not have password, but safe

  // Get messages for vendor
  const messages = await Message.find({ 
    $or: [{ sender: user._id }, { receiver: user._id }] 
  })
  .populate('sender', 'name role')
  .populate('receiver', 'name role')
  .sort({ createdAt: -1 })
  .limit(10);

  // Analytics - mock for now, in real app from orders/reviews
  const analytics = {
    totalViews: Math.floor(Math.random() * 1000) + 100,
    totalMessages: messages.length,
    averageRating: 4.5,
    newLeads: Math.floor(Math.random() * 20) + 5
  };

  return {
    profile: {
      name: user.name,
      email: user.email,
      businessesCount: businesses.length
    },
    businesses,
    messages,
    analytics
  };
};

/**
 * Admin Dashboard Data
 */
const getAdminDashboard = async () => {
  const [totalUsers, totalVendors, totalCategories, totalMessages] = await Promise.all([
    User.countDocuments(),
    Vendor.countDocuments(),
    Category.countDocuments(),
    Message.countDocuments()
  ]);

  // Recent users
  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name email role createdAt');

  // System health - mock
  const systemStats = {
    uptime: '99.9%',
    activeSessions: Math.floor(Math.random() * 100) + 50,
    pendingApprovals: Math.floor(Math.random() * 20) + 5
  };

  return {
    stats: {
      totalUsers,
      totalVendors,
      totalCategories,
      totalMessages,
      revenue: '$12,450' // Mock
    },
    recentUsers,
    systemStats
  };
};
