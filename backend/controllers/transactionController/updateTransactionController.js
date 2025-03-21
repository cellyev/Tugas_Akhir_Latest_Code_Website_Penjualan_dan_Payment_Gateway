const Transaction = require("../../models/transactionSchema");

exports.updateTransactionIsRead = async (req, res) => {
  const { transaction_id } = req.params;

  try {
    const transaction = await Transaction.findById(transaction_id);
    if (!transaction) {
      return res.status(404).json({
        status: false,
        message: "Transaction not found",
        data: null,
      });
    }

    transaction.isRead = true;
    await transaction.save();

    return res.status(200).json({
      status: true,
      message: "Transaction updated successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Error updating transaction read status:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred!",
      data: null,
    });
  }
};
