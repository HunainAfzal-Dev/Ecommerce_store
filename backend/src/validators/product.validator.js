/**
 * ✅ Product Validation Schemas (Joi)
 */

const Joi = require('joi');

/**
 * 📦 Create Product Schema
 */
const createProductSchema = Joi.object({
    category_id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'Category ID must be a valid UUID',
            'any.required': 'Category is required'
        }),

    name: Joi.string()
        .min(2)
        .max(150)
        .required()
        .messages({
            'string.min': 'Product name must be at least 2 characters',
            'string.max': 'Product name cannot exceed 150 characters',
            'any.required': 'Product name is required'
        }),

    description: Joi.string()
        .max(2000)
        .optional()
        .allow('')
        .messages({
            'string.max': 'Description cannot exceed 2000 characters'
        }),

    price: Joi.number()
        .positive()
        .max(10000000)
        .required()
        .messages({
            'number.positive': 'Price must be greater than 0',
            'number.max': 'Price cannot exceed 10,000,000',
            'any.required': 'Price is required'
        }),

    image_url: Joi.string()
        .uri()
        .optional()
        .allow('')
        .messages({
            'string.uri': 'Image URL must be a valid URL'
        }),

    stock_quantity: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            'number.integer': 'Stock quantity must be a whole number',
            'number.min': 'Stock quantity cannot be negative',
            'any.required': 'Stock quantity is required'
        }),

    is_active: Joi.boolean()
        .optional()
        .default(true)
});

/**
 * 📝 Update Product Schema (all optional)
 */
const updateProductSchema = Joi.object({
    category_id: Joi.string()
        .uuid()
        .optional()
        .messages({
            'string.guid': 'Category ID must be a valid UUID'
        }),

    name: Joi.string()
        .min(2)
        .max(150)
        .optional()
        .messages({
            'string.min': 'Product name must be at least 2 characters',
            'string.max': 'Product name cannot exceed 150 characters'
        }),

    description: Joi.string()
        .max(2000)
        .optional()
        .allow('')
        .messages({
            'string.max': 'Description cannot exceed 2000 characters'
        }),

    price: Joi.number()
        .positive()
        .max(10000000)
        .optional()
        .messages({
            'number.positive': 'Price must be greater than 0',
            'number.max': 'Price cannot exceed 10,000,000'
        }),

    image_url: Joi.string()
        .uri()
        .optional()
        .allow('')
        .messages({
            'string.uri': 'Image URL must be a valid URL'
        }),

    stock_quantity: Joi.number()
        .integer()
        .min(0)
        .optional()
        .messages({
            'number.integer': 'Stock quantity must be a whole number',
            'number.min': 'Stock quantity cannot be negative'
        }),

    is_active: Joi.boolean()
        .optional()
});

/**
 * 🔍 Product ID Schema (params)
 */
const productIdSchema = Joi.object({
    id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'Product ID must be a valid UUID format',
            'any.required': 'Product ID is required'
        })
});

module.exports = {
    createProductSchema,
    updateProductSchema,
    productIdSchema
};

