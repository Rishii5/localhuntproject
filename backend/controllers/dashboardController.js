const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Category = require('../models/Category');
const Message = require('../models/Message');
const Service = require('../models/Service');
const Review = require('../models/Review');
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

  // Get services for vendor
  const services = await Service.find({ vendor: businesses.length > 0 ? businesses[0]._id : null })
    .sort({ createdAt: -1 });

  // Get reviews for vendor
  const reviews = await Review.find({ vendor: businesses.length > 0 ? businesses[0]._id : null })
    .populate('customer', 'name')
    .populate('service', 'name')
    .sort({ createdAt: -1 })
    .limit(10);

  // Calculate average rating
  const reviewStats = await Review.aggregate([
    { $match: { vendor: businesses.length > 0 ? businesses[0]._id : null } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  const avgRating = reviewStats.length > 0 ? reviewStats[0].averageRating : 0;
  const totalReviews = reviewStats.length > 0 ? reviewStats[0].totalReviews : 0;

  // Analytics - mock for now, in real app from orders/reviews
  const analytics = {
    totalViews: Math.floor(Math.random() * 1000) + 100,
    totalMessages: messages.length,
    averageRating: avgRating,
    totalReviews: totalReviews,
    newLeads: Math.floor(Math.random() * 20) + 5
  };

  // Get recent messages (last 5)
  const recentMessages = messages.slice(0, 5).map(msg => ({
    sender: msg.sender,
    createdAt: msg.createdAt
  }));

  return {
    vendor: businesses.length > 0 ? businesses[0] : undefined,
    recentMessages,
    services,
    reviews,
    stats: {
      totalViews: analytics.totalViews,
      totalMessages: analytics.totalMessages,
      businessRating: avgRating,
      totalReviews: totalReviews,
      averageRating: avgRating
    },
    messages // optional full messages
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
