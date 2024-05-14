import Joi from "joi";

export const userAuthentication = Joi.object({
    username: Joi.string().min(2).max(50),
    email: Joi.string().min(5).max(50).email().required(),
    password: Joi.string().min(5).max(75).required(),
})
