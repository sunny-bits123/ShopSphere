// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const { protect, authorize } = require('../middleware/auth');

// Admin: get all users
router.get('/', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort('-createdAt');
  res.json({ success: true, count: users.length, users });
}));

// Admin: get / delete user
router.route('/:id')
  .get(protect, authorize('admin'), asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json({ success: true, user });
  }))
  .delete(protect, authorize('admin'), asyncHandler(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  }));

// Toggle wishlist
router.post('/wishlist/:productId', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const idx = user.wishlist.indexOf(req.params.productId);
  if (idx === -1) {
    user.wishlist.push(req.params.productId);
  } else {
    user.wishlist.splice(idx, 1);
  }
  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
}));

module.exports = router;
