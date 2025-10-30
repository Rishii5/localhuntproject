const Joi = require('joi');

exports.serviceCreateSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    price: Joi.number().min(0).required(),
    duration: Joi.number().min(0),
    category: Joi.string().min(2).max(50).required(),
    isActive: Joi.boolean(),
    images: Joi.array().items(Joi.string().uri()),
    tags: Joi.array().items(Joi.string().min(1).max(30))
});

exports.serviceUpdateSchema = Joi.object({
    name: Joi.string().min(2).max(100),
    description: Joi.string().min(10).max(1000),
    price: Joi.number().min(0),
    duration: Joi.number().min(0),
    category: Joi.string().min(2).max(50),
    isActive: Joi.boolean(),
    images: Joi.array().items(Joi.string().uri()),
    tags: Joi.array().items(Joi.string().min(1).max(30))
});
