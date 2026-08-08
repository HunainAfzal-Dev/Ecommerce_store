/**
 * 🔐 JWT Authentication Middleware
 *
 * 1. Extracts "Bearer <token>" from Authorization header
 * 2. Verifies JWT using jsonwebtoken + JWT_SECRET
 * 3. Checks user still exists in database
 * 4. Attaches user to req.user
 */

const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const supabase = require('../config/supabase');

const authMiddleware = async (req, res, next) => {
    try {
        // ===== 1️⃣ Extract token from Authorization header =====
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(
                new AppError(
                    'You are not logged in! Please log in to access this resource.',
                    401
                )
            );
        }

// ===== 2️⃣ Verify the token =====
        const decoded = await promisify(jwt.verify)(
            token,
            process.env.JWT_SECRET,
            {
                // Allow small clock skew between server and token issuer
                clockTolerance: parseInt(process.env.JWT_CLOCK_TOLERANCE, 10) || 60
            }
        );

        // ===== 3️⃣ Check if user still exists in database =====
        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, email, role')
            .eq('id', decoded.id)
            .single();

        if (error || !user) {
            return next(
                new AppError(
                    'The user belonging to this token no longer exists.',
                    401
                )
            );
        }

        // ===== 4️⃣ Attach user to request object =====
        req.user = user;

        // ===== 5️⃣ Proceed =====
        next();
    } catch (err) {
        return next(
            new AppError('Invalid or expired token. Please log in again.', 401)
        );
    }
};

module.exports = authMiddleware;

