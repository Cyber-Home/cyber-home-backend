import Joi from "joi";

export const registerUserValidator = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    homeAddress: Joi.string().required(),
    workAddress: Joi.string().required(),
    occupation: Joi.string().required(),
    password: Joi.string().required(),
    phone: Joi.string().required(),
    uploadId: Joi.string().required(),
    role: Joi.string().valid('user', 'admin')
});

export const loginUserValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const updateProfileValidator = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    avatar: Joi.string()
});