const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return next(new ErrorResponse('No order items', 400));
  }

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) return next(new ErrorResponse(`Product ${item.product} not found`, 404));
    if (product.stock < item.quantity) {
      return next(new ErrorResponse(`Insufficient stock for ${product.name}`, 400));
    }
  }

  // ── Auto-save address to user profile like Flipkart ──
  const user = await User.findById(req.user._id);
  const alreadySaved = user.addresses.some(
    (a) =>
      a.street === shippingAddress.street &&
      a.pincode === shippingAddress.pincode
  );

  if (!alreadySaved) {
    // If no addresses yet, make this one default
    const isDefault = user.addresses.length === 0;
    user.addresses.push({
      label: 'Home',
      street: shippingAddress.street,
      city: shippingAddress.city,
      state: shippingAddress.state,
      pincode: shippingAddress.pincode,
      phone: shippingAddress.phone,
      country: shippingAddress.country || 'India',
      isDefault,
    });
    await user.save();
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    statusHistory: [{ status: 'pending', note: 'Order placed' }],
  });

  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  res.status(201).json({ success: true, order });
});

// @desc    Get my orders
// @route   GET /api/orders/me
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort('-createdAt')
    .populate('orderItems.product', 'name images');

  res.status(200).json({ success: true, count: orders.length, orders });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name images price');

  if (!order) return next(new ErrorResponse('Order not found', 404));

  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to view this order', 403));
  }

  res.status(200).json({ success: true, order });
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorResponse('Order not found', 404));

  order.isPaid = true;
  order.paidAt = Date.now();
  order.orderStatus = 'processing';
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.email_address,
  };
  order.statusHistory.push({ status: 'processing', note: 'Payment received' });

  await order.save();
  res.status(200).json({ success: true, order });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorResponse('Order not found', 404));

  if (req.user.role !== 'admin') {
    if (order.user.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Not authorized', 403));
    }
    if (status !== 'cancelled') {
      return next(new ErrorResponse('Users can only cancel orders', 403));
    }
    if (!['pending', 'processing'].includes(order.orderStatus)) {
      return next(new ErrorResponse('Cannot cancel — order already shipped or delivered', 400));
    }
  }

  order.orderStatus = status;
  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }
  order.statusHistory.push({ status, note: note || '' });
  await order.save();

  res.status(200).json({ success: true, order });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Admin
exports.getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const query = status ? { orderStatus: status } : {};

  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const totalRevenue = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    totalPages: Math.ceil(total / limit),
    revenue: totalRevenue[0]?.total || 0,
    orders,
  });
});