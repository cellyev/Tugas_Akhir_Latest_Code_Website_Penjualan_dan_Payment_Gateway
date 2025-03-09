const mongoose = require("mongoose");
const Transactions = require("../../models/transactionSchema");
const {
  setCookingStatusValidator,
} = require("../../middlewares/transactionValidators/setCookingStatusValidator");

exports.setCookingStatus = async (req, res) => {
  const { transaction_id } = req.params;
  const { cooking_status } = req.body;

  try {
    // Validate transaction_id format
    if (!mongoose.Types.ObjectId.isValid(transaction_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID format!",
        data: null,
      });
    }

    // Validate cooking status format
    const { error } = setCookingStatusValidator.validate({ cooking_status });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((detail) => detail.message),
        data: null,
      });
    }

    // Validate cooking_status value
    const validCookingStatus = [
      "Not Started",
      "Being Cooked",
      "Ready to Serve",
      "Completed",
    ];
    if (!validCookingStatus.includes(cooking_status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid cooking status: "${cooking_status}". Allowed values: ${validCookingStatus.join(
          ", "
        )}`,
        data: null,
      });
    }

    // Check if transaction exists
    const existingTransaction = await Transactions.findById(
      transaction_id
    ).lean();
    if (!existingTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found!",
        data: null,
      });
    }

    // Validate transaction status before updating cooking status
    if (existingTransaction.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: `Cannot update cooking status because the transaction status is "${existingTransaction.status}"!`,
        data: null,
      });
    }

    // Update cooking status
    const updatedTransaction = await Transactions.findByIdAndUpdate(
      transaction_id,
      { cooking_status },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Cooking status updated successfully!",
      data: updatedTransaction,
    });
  } catch (error) {
    console.error("Error updating cooking status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
      data: null,
    });
  }
};
