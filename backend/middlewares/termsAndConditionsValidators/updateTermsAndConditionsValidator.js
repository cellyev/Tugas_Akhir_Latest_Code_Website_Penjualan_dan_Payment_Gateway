const Joi = require("joi");

exports.updateTermsAndConditionsValidator = Joi.object({
  title: Joi.string().trim().min(5).max(100).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 5 characters long",
    "string.max": "Title must be at most 100 characters long",
  }),

  text: Joi.string().trim().min(10).max(5000).required().messages({
    "string.empty": "Text is required",
    "string.min": "Text must be at least 10 characters long",
    "string.max": "Text must be at most 5000 characters long",
  }),

  no: Joi.number().integer().positive().required().messages({
    "number.base": "Number must be a valid integer",
    "number.positive": "Number must be a positive value",
    "any.required": "Number is required",
  }),
});
