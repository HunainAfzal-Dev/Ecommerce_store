/**
 * ✅ Auth Validation Schemas (Joi)
 */

const Joi = require('joi');

/**
 * 📝 Signup Validation Schema
 */
const signupSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.min': 'Name must be at least 3 characters long',
            'string.max': 'Name cannot exceed 50 characters',
            'any.required': 'Name is required'
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long',
            'any.required': 'Password is required'
        })
});

/**
 * 🔓 Login Validation Schema
 */
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required'
        })
});

/**
 * 🔄 Update Role Validation Schema
 */
const updateRoleSchema = Joi.object({
    role: Joi.string()
        .valid('customer', 'admin')
        .required()
        .messages({
            'any.only': 'Role must be either "customer" or "admin"',
            'any.required': 'Role is required'
        })
});

/**
 * 🔍 User ID Params Validation Schema
 */
const userIdParamSchema = Joi.object({
    id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'User ID must be a valid UUID format',
            'any.required': 'User ID is required'
        })
});

module.exports = {
    signupSchema,
    loginSchema,
    updateRoleSchema,
    userIdParamSchema
};

