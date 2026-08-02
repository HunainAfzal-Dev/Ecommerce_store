/**
 * ⚠️ Global Error Handler Middleware
 *
 * Sits at the END of the middleware chain.
 * Distinguishes operational errors (send to client) vs programming bugs (log only).
 */

const sendErrorDev = (err, res) => {
    console.error('❌ ERROR:', err);
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message,
        error: err,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        console.error('❌ Operational Error:', err.message);
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        console.error('❌ UNEXPECTED ERROR:', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong! Please try again later.'
        });
    }
};

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'production') {
        sendErrorProd(err, res);
    } else {
        sendErrorDev(err, res);
    }
};

module.exports = errorHandler;

