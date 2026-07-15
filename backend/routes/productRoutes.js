const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
  deleteReview,
  uploadProductImages,
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

router.route('/:id/reviews')
  .post(protect, createReview);

router.route('/:id/reviews/:reviewId')
  .delete(protect, deleteReview);

router.route('/:id/images')
  .post(protect, authorize('admin'), upload.array('images', 5), uploadProductImages);

module.exports = router;
