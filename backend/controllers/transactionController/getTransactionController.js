const Transactions = require("../../models/transactionSchema");
const TransactionItems = require("../../models/transactionItemSchema");
const Products = require("../../models/productSchema");
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
    // Get transactions with the specified status, sorted by creation date
    const transactions = await Transactions.find({ status }).sort({
      createdAt: -1,
    });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No transactions found with status '${status}'`,
        data: {
          transactions: [],
          transactionItems: [],
          productDetails: [],
        },
      });
    }

    // Get all transaction items for these transactions
    const transactionItems = await TransactionItems.find({
      transaction_id: { $in: transactions.map((t) => t._id) },
    });

    if (!transactionItems || transactionItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No transaction items found for these transactions",
        data: {
          transactions,
          transactionItems: [],
          productDetails: [],
        },
      });
    }

    // Get unique product IDs from transaction items
    const productIds = [
      ...new Set(transactionItems.map((item) => item.product_id)),
    ];

    // Get all product details in one query
    const productDetails = await Products.find({
      _id: { $in: productIds },
    });

    // Map products for easy lookup
    const productsMap = productDetails.reduce((map, product) => {
      map[product._id] = product;
      return map;
    }, {});

    // Enhance transaction items with product details
    const enhancedTransactionItems = transactionItems.map((item) => ({
      ...item.toObject(),
      productDetail: productsMap[item.product_id] || null,
    }));

    return res.status(200).json({
      success: true,
      message: `Transactions with status '${status}' successfully retrieved`,
      data: {
        transactions,
        transactionItems: enhancedTransactionItems,
        productDetails,
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
