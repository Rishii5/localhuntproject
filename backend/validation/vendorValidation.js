// validation/vendorValidation.js
const Joi = require('joi');

exports.vendorCreateSchema = Joi.object({
    shopName: Joi.string().min(2).max(200).required(),
    category: Joi.string().min(2).max(100).required(),
    address: Joi.string().required(),
    phone: Joi.string().allow('', null),
    description: Joi.string().allow('', null),
    location: Joi.object({
        type: Joi.string().valid('Point').required(),
        coordinates: Joi.array().length(2).items(Joi.number()).required() // [lng, lat]
    }).required()
});

exports.vendorUpdateSchema = Joi.object({
    shopName: Joi.string().min(2).max(200),
    category: Joi.string().min(2).max(100),
    address: Joi.string(),
    phone: Joi.string().allow('', null),
    description: Joi.string().allow('', null),
    location: Joi.object({
        type: Joi.string().valid('Point'),
        coordinates: Joi.array().length(2).items(Joi.number())
    })
});
