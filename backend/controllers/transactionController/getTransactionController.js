const axios = require("axios");
const Transactions = require("../../models/transactionSchema");
const TransactionItems = require("../../models/transactionItemSchema");
const mongoose = require("mongoose");

exports.getById = async (req, res) => {
  const { transaction_id } = req.params;

  try {
    if (!transaction_id || !mongoose.Types.ObjectId.isValid(transaction_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing Transaction ID",
        data: null,
      });
    }

    const existingTransaction = await Transactions.findById(transaction_id);

    if (!existingTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
        data: null,
      });
    }

    const existingTransactionItems = await TransactionItems.find({
      transaction_id,
    });

    return res.status(200).json({
      success: true,
      message: "Transaction found!",
      data: {
        transaction: existingTransaction,
        transactionItems: existingTransactionItems,
      },
    });
  } catch (error) {
    console.error("Error in getById:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred",
      data: null,
    });
  }
};

exports.getAllTransactionByStatus = async (req, res) => {
  const { status } = req.params;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: "Status parameter is required",
      data: null,
    });
  }

  try {
    const transactions = await Transactions.find({ status }).sort({
      createdAt: -1,
    });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No transactions found with status '${status}'`,
        data: [],
      });
    }
    const transactionItems = await TransactionItems.find({
      transaction_id: {
        $in: transactions.map((transaction) => transaction.id),
      },
    });
    if (!transactionItems) {
      return res.status(404).json({
        success: false,
        message: "No transaction items found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Transactions with status '${status}' successfully retrieved`,
      data: {
        Transactions: transactions,
        TransactionItems: transactionItems,
      },
    });
  } catch (error) {
    console.error("Error in getAllTransactionByStatus:", error.message);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred",
      error: error.message,
    });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transactions.find({});
    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No transactions found",
        data: null,
      });
    }

    const transactionItems = await TransactionItems.find({
      transaction_id: transactions.map((transaction) => transaction.id),
    });

    if (!transactionItems) {
      return res.status(404).json({
        success: false,
        message: "No transaction items found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transactions successfully retrieved",
      data: transactions,
    });
  } catch (error) {
    console.error("Error in getAllTransactions:", error.message);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred",
      error: error.message,
    });
  }
};

exports.getTransactionBySuccessAndIsRead = async (req, res) => {
  try {
    const transaction = await Transactions.find({
      status: "completed",
      isRead: false,
    })
      .sort({ createdAt: 1 })
      .limit(1);

    if (!transaction || transaction.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No transaction found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transactions successfully retrieved",
      data: transaction,
    });
  } catch (error) {
    console.error(
      "Error in getAllTransactionBySuccessAndIsRead:",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred",
      error: error.message,
    });
  }
};

exports.getLatestCompletedAndIsReadTrueTransaction = async (req, res) => {
  try {
    const latestTransaction = await Transactions.find({
      status: "completed",
      isRead: true,
    })
      .sort({ createdAt: -1 }) // Ambil transaksi terbaru
      .limit(1);

    if (!latestTransaction) {
      return res.status(404).json({
        success: false,
        message: "No completed and read transactions found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Latest completed and read transaction found!",
      data: latestTransaction,
    });
  } catch (error) {
    console.error("Error fetching latest transaction:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred!",
      error: error.message,
    });
  }
};
