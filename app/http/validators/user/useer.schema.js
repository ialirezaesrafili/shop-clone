const Joi = require('@hapi/joi');

const authSchema = Joi.object({
    email: Joi.string().trim().email().required().lowercase(),
    password: Joi.string().min(6).max(16).trim().required()
})

module.exports = {
    authSchema
}