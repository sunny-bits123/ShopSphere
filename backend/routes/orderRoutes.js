const express = require('express');
const router = express.Router();
const {
  createOrder, getMyOrders, getOrder,
  updateOrderToPaid, updateOrderStatus, getAllOrders,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.route('/').get(authorize('admin'), getAllOrders).post(createOrder);
router.get('/me', getMyOrders);
router.put('/:id/pay', updateOrderToPaid);
router.put('/:id/status', updateOrderStatus);
router.get('/:id', getOrder);

module.exports = router;