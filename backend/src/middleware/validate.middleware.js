/**
 * ✅ Request Validation Middleware
 *
 * Accepts a Joi schema + property name ('body', 'params', 'query').
 * Validates the request property and replaces it with sanitized data.
 */

const AppError = require('../utils/AppError');

module.exports = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false
        });

        if (error) {
            const errorMessages = error.details.map((detail) => detail.message);
            return next(
                new AppError(
                    `Validation failed: ${errorMessages.join('; ')}`,
                    400
                )
            );
        }

        req[property] = value;
        next();
    };
};

