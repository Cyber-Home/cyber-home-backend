import Joi from "joi";

export const addServiceValidator = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.object({
        base: Joi.number().required(),
        unit: Joi.string().required()
    }).required(),
    duration: Joi.object({
        estimated: Joi.number().required(),
        unit: Joi.string().required()
    }).required()
})


export const addWorkerValidator = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    services: Joi.array().items(
        Joi.string().required()
    ).required(),
    availability: Joi.array().items(
        Joi.object({
            day: Joi.string().required(),
            startTime: Joi.string().required(),
            endTime: Joi.string().required()
        })
    ).required(),
    documents: Joi.string().required()
})