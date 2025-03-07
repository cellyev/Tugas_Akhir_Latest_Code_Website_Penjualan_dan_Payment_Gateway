const Joi = require("joi");

exports.createTransactionValidator = Joi.object({
  table_code: Joi.number().integer().min(1).max(40).required().messages({
    "number.base": "Table code must be a number!",
    "number.min": "Table code must be at least 1!",
    "number.max": "Table code cannot be greater than 40!",
    "any.required": "Table code is required!",
  }),
  customer_name: Joi.string().min(3).max(100).required().messages({
    "string.base": "Customer name must be a string!",
    "string.min": "Customer name must be at least 3 characters!",
    "string.max": "Customer name cannot exceed 100 characters!",
    "any.required": "Customer name is required!",
  }),
  customer_email: Joi.string().email().required().messages({
    "string.email": "Invalid email format!",
    "any.required": "Customer email is required!",
  }),
  products: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.string().required().messages({
          "any.required": "Product ID is required!",
        }),
        qty: Joi.number().integer().min(1).required().messages({
          "number.base": "Quantity must be a number!",
          "number.min": "Quantity must be at least 1!",
          "any.required": "Product quantity is required!",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one product must be added!",
      "any.required": "Product list is required!",
    }),
});
