const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { uploadImage, deleteImage } = require('../config/cloudinary');

// @desc    Get all products (with filter, sort, search, pagination)
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    brand,
    minPrice,
    maxPrice,
    ratings,
    page = 1,
    limit = 12,
    sort = '-createdAt',
    isFeatured,
  } = req.query;

  const query = {};

  // Text search
  if (keyword) {
    query.$text = { $search: keyword };
  }

  // Filters
  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (isFeatured) query.isFeatured = isFeatured === 'true';
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (ratings) query.ratings = { $gte: Number(ratings) };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(query);

  const products = await Product.find(query)
    .populate('category', 'name slug')
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
    products,
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('reviews.user', 'name avatar');

  if (!product) return next(new ErrorResponse('Product not found', 404));

  res.status(200).json({ success: true, product });
});

// @desc    Create product
// @route   POST /api/products
// @access  Admin
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.seller = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorResponse('Product not found', 404));

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, product });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorResponse('Product not found', 404));

  // Delete images from Cloudinary
  for (const img of product.images) {
    if (img.public_id) await deleteImage(img.public_id);
  }

  await product.deleteOne();
  res.status(200).json({ success: true, message: 'Product deleted' });
});

// @desc    Create or update review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorResponse('Product not found', 404));

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user.id
  );

  if (alreadyReviewed) {
    alreadyReviewed.rating = Number(rating);
    alreadyReviewed.comment = comment;
  } else {
    product.reviews.push({
      user: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    });
  }

  product.calcAverageRating();
  await product.save();

  res.status(200).json({ success: true, message: 'Review submitted' });
});

// @desc    Delete review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorResponse('Product not found', 404));

  const review = product.reviews.id(req.params.reviewId);
  if (!review) return next(new ErrorResponse('Review not found', 404));

  if (
    review.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  review.deleteOne();
  product.calcAverageRating();
  await product.save();

  res.status(200).json({ success: true, message: 'Review deleted' });
});

// @desc    Upload product images
// @route   POST /api/products/:id/images
// @access  Admin
exports.uploadProductImages = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorResponse('Product not found', 404));

  const files = req.files;
  const uploadedImages = [];

  for (const file of files) {
    const result = await uploadImage(file.path, 'shopsphere/products');
    uploadedImages.push({ url: result.url, public_id: result.public_id });
  }

  product.images.push(...uploadedImages);
  await product.save();

  res.status(200).json({ success: true, images: product.images });
});
