/**
 * 📦 Order Controller
 */

const catchAsync = require('../utils/catchAsync');
const orderService = require('../services/order.service');

/**
 * 📦 POST /api/orders - Place a new order (customer)
 */
const createOrder = catchAsync(async (req, res, next) => {
    const order = await orderService.createOrder(req.user.id, req.body);

    res.status(201).json({
        status: 'Success',
        message: 'Order placed successfully! 🎉',
        data: { order }
    });
});

/**
 * 📦 GET /api/orders/my-orders - User's order history
 */
const getMyOrders = catchAsync(async (req, res, next) => {
    const orders = await orderService.getOrdersByUser(req.user.id);

    res.status(200).json({
        status: 'Success',
        count: orders.length,
        data: { orders }
    });
});

/**
 * 📦 GET /api/orders - All orders (admin)
 */
const getAllOrders = catchAsync(async (req, res, next) => {
    const orders = await orderService.getAllOrders();

    res.status(200).json({
        status: 'Success',
        count: orders.length,
        data: { orders }
    });
});

/**
 * 📦 GET /api/orders/:id - Single order (owner or admin)
 */
const getOrderById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const order = await orderService.getOrderById(id, req.user);

    res.status(200).json({
        status: 'Success',
        data: { order }
    });
});

/**
 * 📦 PUT /api/orders/:id/status - Update order status (admin)
 */
const updateOrderStatus = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(id, status);

    res.status(200).json({
        status: 'Success',
        message: 'Order status updated successfully.',
        data: { order }
    });
});

module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus
};

