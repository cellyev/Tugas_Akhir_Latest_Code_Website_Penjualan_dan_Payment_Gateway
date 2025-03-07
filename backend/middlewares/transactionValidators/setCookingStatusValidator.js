const Joi = require("joi");

exports.setCookingStatusValidator = Joi.object({
  cooking_status: Joi.string().required().messages({
    "string.empty": "Cooking Status is required!",
    "any.required": "Cooking Status is required!",
  }),
});
