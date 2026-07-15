// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage } = require('../config/cloudinary');
const asyncHandler = require('../middleware/asyncHandler');
const { protect, authorize } = require('../middleware/auth');

const upload = multer({ dest: 'uploads/' });

router.post(
  '/',
  protect,
  authorize('admin'),
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const result = await uploadImage(req.file.path);
    res.json({ success: true, url: result.url, public_id: result.public_id });
  })
);

module.exports = router;
