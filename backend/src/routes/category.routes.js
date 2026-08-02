/**
 * 🚦 Category Routes
 *
 * Public:  GET all, GET one
 * Admin:   POST, PUT, DELETE
 */

const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/category.controller');
const {
    categorySchema,
    categoryIdSchema
} = require('../validators/category.validator');
const validate = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

// ===== PUBLIC ROUTES =====

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', categoryController.getAllCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Get single category
 * @access  Public
 */
router.get(
    '/:id',
    validate(categoryIdSchema, 'params'),
    categoryController.getCategoryById
);

// ===== ADMIN ROUTES (protected) =====
router.use(authMiddleware, adminMiddleware);

/**
 * @route   POST /api/categories
 * @desc    Create category
 * @access  Admin
 */
router.post(
    '/',
    validate(categorySchema, 'body'),
    categoryController.createCategory
);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category
 * @access  Admin
 */
router.put(
    '/:id',
    validate(categoryIdSchema, 'params'),
    validate(categorySchema, 'body'),
    categoryController.updateCategory
);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Admin
 */
router.delete(
    '/:id',
    validate(categoryIdSchema, 'params'),
    categoryController.deleteCategory
);

module.exports = router;

