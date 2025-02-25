const Transaction = require("../../models/transactionSchema");

exports.updateTransactionIsRead = async (req, res) => {
  const { transaction_id } = req.params;

  try {
    const transaction = await Transaction.findOne({ _id: transaction_id });
    if (!transaction) {
      return;
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
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occured!",
      data: null,
    });
  }
};
