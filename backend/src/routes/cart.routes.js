/**
 * 🚦 Cart Routes
 *
 * All routes require authentication (customer).
 */

const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cart.controller');
const {
    addToCartSchema,
    updateCartItemSchema,
    cartItemIdSchema
} = require('../validators/cart.validator');
const validate = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');

// All cart routes require login
router.use(authMiddleware);

/**
 * @route   GET /api/cart
 * @desc    View user's cart
 * @access  Customer
 */
router.get('/', cartController.getCart);

/**
 * @route   POST /api/cart
 * @desc    Add item to cart
 * @access  Customer
 */
router.post(
    '/',
    validate(addToCartSchema, 'body'),
    cartController.addToCart
);

/**
 * @route   PUT /api/cart/:id
 * @desc    Update cart item quantity
 * @access  Customer
 */
router.put(
    '/:id',
    validate(cartItemIdSchema, 'params'),
    validate(updateCartItemSchema, 'body'),
    cartController.updateCartItem
);

/**
 * @route   DELETE /api/cart/:id
 * @desc    Remove item from cart
 * @access  Customer
 */
router.delete(
    '/:id',
    validate(cartItemIdSchema, 'params'),
    cartController.removeFromCart
);

/**
 * @route   DELETE /api/cart
 * @desc    Clear entire cart
 * @access  Customer
 */
router.delete('/', cartController.clearCart);

module.exports = router;

