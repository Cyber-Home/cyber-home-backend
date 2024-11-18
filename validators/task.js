import Joi from "joi";


export const addTaskValidator = Joi.object({
    user: Joi.string(),
    service: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    contactPerson: Joi.string().required(),
    phone: Joi.string().required(),
    scheduledDate: Joi.date().required(),
    location: Joi.string().required(),
    upload: Joi.string()
});

export const updateTaskValidator = Joi.object({
    service: Joi.string(),
    title: Joi.string(),
    description: Joi.string(),
    contactPerson: Joi.string(),
    phone: Joi.string(),
    scheduledDate: Joi.date(),
    location: Joi.string(),
    upload: Joi.string()
});