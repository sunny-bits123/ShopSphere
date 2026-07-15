// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const asyncHandler = require('../middleware/asyncHandler');
const { protect, authorize } = require('../middleware/auth');

router.get('/', asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).populate('subcategories');
  res.json({ success: true, categories });
}));

router.post('/', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, category });
}));

router.route('/:id')
  .put(protect, authorize('admin'), asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, category });
  }))
  .delete(protect, authorize('admin'), asyncHandler(async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  }));

module.exports = router;
