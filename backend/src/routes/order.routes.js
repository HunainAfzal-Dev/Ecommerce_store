/**
 * 🚦 Order Routes
 *
 * Customer: POST create order, GET my-orders, GET order by id
 * Admin:    GET all orders, PUT order status
 */

const express = require('express');
const router = express.Router();

const orderController = require('../controllers/order.controller');
const { createOrderSchema } = require('../validators/order.validator');
const validate = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

// All order routes require login
router.use(authMiddleware);

/**
 * @route   POST /api/orders
 * @desc    Place a new order
 * @access  Customer
 */
router.post(
    '/',
    validate(createOrderSchema, 'body'),
    orderController.createOrder
);

/**
 * @route   GET /api/orders/my-orders
 * @desc    Get logged-in user's orders
 * @access  Customer
 */
router.get('/my-orders', orderController.getMyOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order (owner or admin)
 * @access  Customer (own) / Admin
 */
router.get('/:id', orderController.getOrderById);

// ===== ADMIN ROUTES =====
router.use(authMiddleware, adminMiddleware);

/**
 * @route   GET /api/orders
 * @desc    Get all orders
 * @access  Admin
 */
router.get('/', orderController.getAllOrders);

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status
 * @access  Admin
 */
router.put(
    '/:id/status',
    orderController.updateOrderStatus
);

module.exports = router;

