/**
 * 🔐 Auth Controller
 *
 * Thin request/response handlers. All logic delegated to auth.service.
 */

const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');

/**
 * 📝 POST /api/auth/signup - Register a new customer
 */
const signup = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    const { user, token } = await authService.signup({
        name,
        email,
        password
    });

    res.status(201).json({
        status: 'Success',
        message: 'User registered successfully! 🎉',
        data: {
            user,
            token
        }
    });
});

/**
 * 🔓 POST /api/auth/login - Authenticate a user
 */
const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const { user, token } = await authService.login(email, password);

    res.status(200).json({
        status: 'Success',
        message: 'Login successful! 🎉',
        data: {
            user,
            token
        }
    });
});

/**
 * 👥 GET /api/auth/users - Get all users (admin only)
 */
const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await authService.getAllUsers();

    res.status(200).json({
        status: 'Success',
        count: users.length,
        data: { users }
    });
});

/**
 * 🔄 PUT /api/auth/users/:id/role - Update user role (admin only)
 */
const updateUserRole = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { role } = req.body;

    const user = await authService.updateUserRole(id, role);

    res.status(200).json({
        status: 'Success',
        message: 'User role updated successfully.',
        data: { user }
    });
});

/**
 * 🗑️ DELETE /api/auth/users/:id - Delete a user (admin only)
 */
const deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const deletedId = await authService.deleteUser(id);

    res.status(200).json({
        status: 'Success',
        message: 'User deleted successfully.',
        data: { deleted_user_id: deletedId }
    });
});

module.exports = {
    signup,
    login,
    getAllUsers,
    updateUserRole,
    deleteUser
};

