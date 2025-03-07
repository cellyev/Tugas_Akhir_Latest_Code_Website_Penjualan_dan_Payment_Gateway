const Joi = require("joi");

exports.payingValidator = Joi.object({
  amount: Joi.number().integer().min(1).required().messages({
    "number.base": "Amount must be a number!",
    "number.min": "Amount must be at least 1!",
    "any.required": "Amount is required!",
  }),
});
