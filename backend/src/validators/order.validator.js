/**
 * ✅ Order Validation Schemas (Joi)
 */

const Joi = require('joi');

/**
 * 📦 Create Order Schema
 */
const createOrderSchema = Joi.object({
    shipping_address: Joi.string()
        .min(5)
        .max(500)
        .required()
        .messages({
            'string.min': 'Shipping address must be at least 5 characters',
            'string.max': 'Shipping address cannot exceed 500 characters',
            'any.required': 'Shipping address is required'
        }),

    city: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'City must be at least 2 characters',
            'string.max': 'City cannot exceed 100 characters',
            'any.required': 'City is required'
        }),

phone: Joi.string()
        .pattern(/^(\+?[0-9]{2,3}[- ]?)?[0-9]{10,15}$/)
        .required()
        .messages({
            'string.pattern.base': 'Phone number format is invalid',
            'any.required': 'Phone number is required'
        })
});

const updateOrderStatusSchema = Joi.object({
    status: Joi.string()
        .valid(
            'pending',
            'processing',
            'shipped',
            'out_for_delivery',
            'delivered',
            'cancelled'
        )
        .required()
        .messages({
            'any.only': 'Invalid order status',
            'any.required': 'Status is required'
        })
});

module.exports = {
    createOrderSchema,
    updateOrderStatusSchema
};

