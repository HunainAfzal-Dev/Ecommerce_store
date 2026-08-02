/**
 * 🛡️ Admin Authorization Middleware
 *
 * Must be used AFTER authMiddleware.
 * Checks that req.user.role === 'admin'.
 */

const AppError = require('../utils/AppError');

const adminMiddleware = (req, res, next) => {
    if (!req.user) {
        return next(
            new AppError('Authentication required. Please log in first.', 401)
        );
    }

    if (req.user.role !== 'admin') {
        return next(
            new AppError(
                'You do not have permission to access this resource. Admin only.',
                403
            )
        );
    }

    next();
};

module.exports = adminMiddleware;

