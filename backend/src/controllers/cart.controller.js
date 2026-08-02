/**
 * 🛒 Cart Controller
 */

const catchAsync = require('../utils/catchAsync');
const cartService = require('../services/cart.service');

/**
 * 🛒 GET /api/cart - View user's cart
 */
const getCart = catchAsync(async (req, res, next) => {
    const cartItems = await cartService.getCart(req.user.id);

    res.status(200).json({
        status: 'Success',
        count: cartItems.length,
        data: { cart_items: cartItems }
    });
});

/**
 * 🛒 POST /api/cart - Add item to cart
 */
const addToCart = catchAsync(async (req, res, next) => {
    const { product_id, quantity } = req.body;
    const cartItem = await cartService.addToCart(
        req.user.id,
        product_id,
        quantity
    );

    res.status(201).json({
        status: 'Success',
        message: 'Item added to cart.',
        data: { cart_item: cartItem }
    });
});

/**
 * 🛒 PUT /api/cart/:id - Update cart item quantity
 */
const updateCartItem = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const cartItem = await cartService.updateCartItem(
        req.user.id,
        id,
        quantity
    );

    res.status(200).json({
        status: 'Success',
        message: 'Cart updated successfully.',
        data: { cart_item: cartItem }
    });
});

/**
 * 🛒 DELETE /api/cart/:id - Remove item from cart
 */
const removeFromCart = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedId = await cartService.removeFromCart(req.user.id, id);

    res.status(200).json({
        status: 'Success',
        message: 'Item removed from cart.',
        data: { deleted_cart_item_id: deletedId }
    });
});

/**
 * 🛒 DELETE /api/cart - Clear entire cart
 */
const clearCart = catchAsync(async (req, res, next) => {
    await cartService.clearCart(req.user.id);

    res.status(200).json({
        status: 'Success',
        message: 'Cart cleared successfully.'
    });
});

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};

