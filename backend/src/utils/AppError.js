/**
 * 📦 AppError - Custom Error Class
 *
 * Extends the built-in Error class with an HTTP status code.
 * Allows throwing errors anywhere in the app with an associated HTTP status.
 */

class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);

        this.statusCode = statusCode;
        this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;

