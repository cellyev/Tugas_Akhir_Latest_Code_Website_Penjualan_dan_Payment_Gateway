const Transaction = require("../../models/transactionSchema");
const axios = require("axios");

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

const statusMapping = {
  1: "pending",
  2: "challengeByFDS",
  3: "completed",
  4: "denied",
  5: "expired",
  6: "cancelled",
};

const updateTransactionBTS = async () => {
  try {
    console.log("Checking for pending transactions...");

    // Cari transaksi yang masih pending
    const PendingTransaction = await Transaction.findOne({ status: "pending" });

    if (!PendingTransaction) {
      console.log("No pending transaction found.");
      return;
    }

    // Bentuk ID transaksi yang sesuai dengan format Midtrans
    const PendingTransactionId = `VAILOVENT-${PendingTransaction._id}`;

    // Panggil API Midtrans
    const midtransUrl =
      "https://payment.evognito.my.id/midtrans/get-data?param=VAILOVENT";

    const response = await axios.get(midtransUrl);

    if (!response.data || !response.data.data) {
      console.log("No transaction data received from Midtrans.");
      return;
    }

    let TransactionData = response.data.data;

    // Pastikan format data adalah array
    if (!Array.isArray(TransactionData) && TransactionData.transactions) {
      TransactionData = TransactionData.transactions;
    }

    if (!Array.isArray(TransactionData)) {
      console.log("Invalid data format received from Midtrans.");
      return;
    }

    // Filter data untuk mendapatkan transaksi yang sesuai
    const filteredData = TransactionData.filter(
      (item) => item.order_id === PendingTransactionId
    );

    if (filteredData.length === 0) {
      console.log("Matching transaction not found in Midtrans.");
      return;
    }

    // Ambil status dari transaksi pertama yang ditemukan
    const status = filteredData[0].status;
    const statusNumber = parseInt(status, 10);

    if (!statusMapping[statusNumber]) {
      console.log("Invalid status received from Midtrans.");
      return;
    }

    // Jika transaksi sudah completed, tidak perlu update lagi
    if (PendingTransaction.status === "completed") {
      console.log(
        `Transaction ${PendingTransaction._id} is already completed.`
      );
      return;
    }

    // Update status transaksi
    PendingTransaction.status = statusMapping[statusNumber];
    await PendingTransaction.save();

    console.log(
      `Transaction ${PendingTransaction._id} updated to ${PendingTransaction.status}.`
    );
  } catch (error) {
    console.error("Error updating transaction:", error);
  }
};

setInterval(updateTransactionBTS, 20 * 60 * 1000);

updateTransactionBTS();
