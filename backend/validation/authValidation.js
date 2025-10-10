// validation/authValidation.js
const Joi = require('joi');

exports.registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8)
        .pattern(/[A-Z]/).pattern(/[a-z]/).pattern(/[0-9]/).pattern(/[!@#$%^&*]/)
        .required(),
    role: Joi.string().valid('customer', 'vendor').default('customer'),
});

exports.loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
