/**
 * 🚦 Auth Routes
 */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { signupSchema, loginSchema, updateRoleSchema, userIdParamSchema } = require('../validators/auth.validator');
const validate = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

// ===== PUBLIC AUTH ROUTES =====

router.post(
    '/signup',
    validate(signupSchema, 'body'),
    authController.signup
);

router.post(
    '/login',
    validate(loginSchema, 'body'),
    authController.login
);

// ===== ADMIN-ONLY USER MANAGEMENT ROUTES =====

/**
 * @route   GET /api/auth/users
 * @desc    Get all users
 * @access  Admin only
 */
router.get(
    '/users',
    authMiddleware,
    adminMiddleware,
    authController.getAllUsers
);

/**
 * @route   PUT /api/auth/users/:id/role
 * @desc    Update a user's role
 * @access  Admin only
 */
router.put(
    '/users/:id/role',
    authMiddleware,
    adminMiddleware,
    validate(userIdParamSchema, 'params'),
    validate(updateRoleSchema, 'body'),
    authController.updateUserRole
);

/**
 * @route   DELETE /api/auth/users/:id
 * @desc    Delete a user
 * @access  Admin only
 */
router.delete(
    '/users/:id',
    authMiddleware,
    adminMiddleware,
    validate(userIdParamSchema, 'params'),
    authController.deleteUser
);

module.exports = router;

