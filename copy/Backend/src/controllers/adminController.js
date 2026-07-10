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

// @desc    Admin: list ALL products (including deactivated/isActive:false).
//          The public GET /api/products always filters isActive:true, so
//          admin needs its own view in order to find and reactivate
//          soft-deleted products.
// @route   GET /api/admin/products
// @access  Private/Admin
const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const pageNum = Number(page);
  const limitNum = Number(limit);

  const [products, total] = await Promise.all([
    Product.find({})
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Product.countDocuments({})
  ]);

  return sendSuccess(res, 200, {
    products,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum)
  });
});

module.exports = { getDashboardStats, getAllProducts };