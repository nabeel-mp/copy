const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalUsers = await User.countDocuments({ role: 'user' });

  const paidOrders = await Order.find({ isPaid: true });
  const totalRevenue = paidOrders.reduce((acc, order) => acc + order.totalPrice, 0);

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name phone');

  return sendSuccess(res, 200, {
    totalOrders,
    totalProducts,
    totalUsers,
    totalRevenue,
    recentOrders
  });
});

module.exports = { getDashboardStats };