const Joi = require('joi');

exports.reviewCreateSchema = Joi.object({
    vendor: Joi.string().required(), // ObjectId
    service: Joi.string(), // ObjectId, optional
    rating: Joi.number().min(1).max(5).required(),
    title: Joi.string().min(5).max(100).required(),
    comment: Joi.string().min(10).max(1000).required(),
    images: Joi.array().items(Joi.string().uri())
});

exports.reviewUpdateSchema = Joi.object({
    rating: Joi.number().min(1).max(5),
    title: Joi.string().min(5).max(100),
    comment: Joi.string().min(10).max(1000),
    images: Joi.array().items(Joi.string().uri())
});

exports.vendorResponseSchema = Joi.object({
    text: Joi.string().min(1).max(1000).required()
});
