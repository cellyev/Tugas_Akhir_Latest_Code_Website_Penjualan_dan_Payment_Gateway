const mongoose = require("mongoose");
const validator = require("validator");

const emailLogSchema = new mongoose.Schema(
  {
    transaction_id: {
      type: String,
      required: true,
    },
    customer_email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Invalid email address"],
    },
    payload: {
      type: String,
      required: true,
      enum: ["Create Transaction", "Success Transaction", "Fail Transaction"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmailLogs", emailLogSchema);
