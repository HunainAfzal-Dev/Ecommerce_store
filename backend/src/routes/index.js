/**
 * 🚦 Route Aggregator
 *
 * Central place where all route modules are mounted under /api.
 */

const express = require('express');
const router = express.Router();

// Auth routes: /api/auth/signup, /api/auth/login
const authRoutes = require('./auth.routes');
router.use('/auth', authRoutes);

// Category routes: /api/categories
const categoryRoutes = require('./category.routes');
router.use('/categories', categoryRoutes);

// Product routes: /api/products
const productRoutes = require('./product.routes');
router.use('/products', productRoutes);

// Cart routes: /api/cart
const cartRoutes = require('./cart.routes');
router.use('/cart', cartRoutes);

// Order routes: /api/orders
const orderRoutes = require('./order.routes');
router.use('/orders', orderRoutes);

module.exports = router;

