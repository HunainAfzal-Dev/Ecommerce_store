/**
 * 🔄 catchAsync - Async Error Wrapper for Express Route Handlers
 *
 * Express does NOT catch errors thrown inside async route handlers.
 * This wrapper catches rejected promises and forwards them to the global
 * error handler middleware.
 */

module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

