const Joi = require('joi');

const verificationEmail = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email should be a string',
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  })
})

module.exports = verificationEmail;