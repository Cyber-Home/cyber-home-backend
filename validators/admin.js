import Joi from "joi";

export const addServiceValidator = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    price: [Joi.number().required(), Joi.string().required()],
    duration: Joi.string().required()
})


export const addWorkerValidator = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    services: Joi.string().required(),
    availabilty: [Joi.string().required(), Joi.string().required(), Joi.string().required()],
    documents: Joi.string().required()
})