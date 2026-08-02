/**
 * ✅ Cart Validation Schemas (Joi)
 */

const Joi = require('joi');

/**
 * 🛒 Add to Cart Schema
 */
const addToCartSchema = Joi.object({
    product_id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'Product ID must be a valid UUID',
            'any.required': 'Product ID is required'
        }),

    quantity: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'number.integer': 'Quantity must be a whole number',
            'number.min': 'Quantity must be at least 1',
            'any.required': 'Quantity is required'
        })
});

/**
 * 🛒 Update Cart Item Schema
 */
const updateCartItemSchema = Joi.object({
    quantity: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'number.integer': 'Quantity must be a whole number',
            'number.min': 'Quantity must be at least 1',
            'any.required': 'Quantity is required'
        })
});

/**
 * 🔍 Cart Item ID Schema (params)
 */
const cartItemIdSchema = Joi.object({
    id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'Cart item ID must be a valid UUID format',
            'any.required': 'Cart item ID is required'
        })
});

module.exports = {
    addToCartSchema,
    updateCartItemSchema,
    cartItemIdSchema
};

