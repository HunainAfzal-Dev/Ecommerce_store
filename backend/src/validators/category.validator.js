/**
 * ✅ Category Validation Schemas (Joi)
 */

const Joi = require('joi');

/**
 * 🏷️ Create/Update Category Schema
 */
const categorySchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Category name must be at least 2 characters',
            'string.max': 'Category name cannot exceed 100 characters',
            'any.required': 'Category name is required'
        }),

    description: Joi.string()
        .max(500)
        .optional()
        .allow('')
        .messages({
            'string.max': 'Description cannot exceed 500 characters'
        })
});

/**
 * 🔍 Category ID Schema (params)
 */
const categoryIdSchema = Joi.object({
    id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'Category ID must be a valid UUID format',
            'any.required': 'Category ID is required'
        })
});

module.exports = {
    categorySchema,
    categoryIdSchema
};

