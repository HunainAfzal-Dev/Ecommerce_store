/**
 * 🚦 Product Routes
 *
 * Public:  GET all (with filters), GET one
 * Admin:   POST, PUT, DELETE
 */

const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');
const {
    createProductSchema,
    updateProductSchema,
    productIdSchema
} = require('../validators/product.validator');
const validate = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

// ===== PUBLIC ROUTES =====

/**
 * @route   GET /api/products
 * @desc    List products (filter by category_id, search)
 * @access  Public
 */
router.get('/', productController.getAllProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get single active product
 * @access  Public
 */
router.get(
    '/:id',
    validate(productIdSchema, 'params'),
    productController.getProductById
);

// ===== ADMIN ROUTES (protected) =====
router.use(authMiddleware, adminMiddleware);

/**
 * @route   POST /api/products
 * @desc    Create product
 * @access  Admin
 */
router.post(
    '/',
    validate(createProductSchema, 'body'),
    productController.createProduct
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Admin
 */
router.put(
    '/:id',
    validate(productIdSchema, 'params'),
    validate(updateProductSchema, 'body'),
    productController.updateProduct
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Admin
 */
router.delete(
    '/:id',
    validate(productIdSchema, 'params'),
    productController.deleteProduct
);

module.exports = router;

