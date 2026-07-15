const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const asyncHandler = require('../middleware/asyncHandler');
const { protect } = require('../middleware/auth');

// Create Razorpay order
router.post('/create-order', protect, asyncHandler(async (req, res) => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(400).json({ success: false, message: 'Razorpay not configured' });
  }
  const Razorpay = require('razorpay');
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  const { amount } = req.body;
  const options = {
    amount: Math.round(amount * 100),
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  };
  const order = await razorpay.orders.create(options);
  res.json({ success: true, order, key: process.env.RAZORPAY_KEY_ID });
}));

// Verify payment signature
router.post('/verify', protect, asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const sign = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest('hex');
  if (razorpay_signature === expectedSign) {
    res.json({ success: true, message: 'Payment verified' });
  } else {
    res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
}));

module.exports = router;