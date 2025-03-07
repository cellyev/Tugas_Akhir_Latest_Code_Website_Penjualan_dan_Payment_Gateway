const Joi = require("joi");

exports.createProductValidator = Joi.object({
  name: Joi.string().trim().min(3).required().messages({
    "string.empty": "Product name is required!",
    "string.min": "Product name must be at least 3 characters long!",
    "any.required": "Product name is required!",
  }),

  description: Joi.string().trim().min(10).required().messages({
    "string.empty": "Description is required!",
    "string.min": "Description must be at least 10 characters long!",
    "any.required": "Description is required!",
  }),

  stock: Joi.number().valid(0, 1).required().messages({
    "any.only": "Stock must be either 0 or 1!",
    "number.base": "Stock must be a number!",
    "any.required": "Stock is required!",
  }),

  price: Joi.number().min(0.01).precision(2).required().messages({
    "number.base": "Price must be a valid number!",
    "number.min": "Price cannot be zero or negative!",
    "any.required": "Price is required!",
  }),

  image: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .regex(/\.(jpg|jpeg|png|gif)$/i)
    .required()
    .messages({
      "string.uri": "Invalid image URL!",
      "string.empty": "Image URL is required!",
      "any.required": "Image URL is required!",
      "string.pattern.base": "Image must be in JPG, JPEG, PNG, or GIF format!",
    }),
});
