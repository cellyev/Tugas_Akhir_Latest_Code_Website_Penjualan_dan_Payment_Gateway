const Transaction = require("../../models/transactionSchema");
const axios = require("axios");
const {
  sendFailedEmail,
} = require("../../middlewares/sendMail/sendFailedEmail");
const {
  sendSuccessEmail,
} = require("../../middlewares/sendMail/sendSuccessEmail");
const TransactionItems = require("../../models/transactionItemSchema");
const EmailLogs = require("../../models/emailLogSchema");

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

const statusMapping = {
  1: "pending",
  2: "challengeByFDS",
  3: "completed",
  4: "denied",
  5: "expired",
  6: "cancelled",
};

let isUpdating = false; // Untuk menghindari duplikasi update

const updateTransactionBTS = async () => {
  if (isUpdating) {
    console.log(
      "Skipping updateTransactionBTS - previous process still running."
    );
    return;
  }

  isUpdating = true;
  try {
    console.log("Checking for all pending transactions...");

    const pendingTransactions = await Transaction.find({ status: "pending" });

    if (pendingTransactions.length === 0) {
      console.log("No pending transactions found.");
      isUpdating = false;
      return;
    }

    console.log(`Found ${pendingTransactions.length} pending transactions.`);

    const updatePromises = pendingTransactions.map(async (transaction) => {
      try {
        const transactionId = `VAILOVENT-${transaction._id}`;

        const midtransUrl =
          "https://payment.evognito.my.id/midtrans/get-data?param=VAILOVENT";
        const response = await axios.get(midtransUrl);

        if (!response.data || !response.data.data) {
          console.log(`No transaction data found for ${transaction._id}`);
          return;
        }

        let transactionData = response.data.data;

        if (!Array.isArray(transactionData) && transactionData.transactions) {
          transactionData = transactionData.transactions;
        }

        if (!Array.isArray(transactionData)) {
          console.log(`Invalid data format for ${transaction._id}`);
          return;
        }

        const matchedTransaction = transactionData.find(
          (item) => item.order_id === transactionId
        );
        if (!matchedTransaction) {
          console.log(
            `No matching transaction found in Midtrans for ${transaction._id}`
          );
          return;
        }

        const statusNumber = parseInt(matchedTransaction.status, 10);
        if (!statusMapping[statusNumber]) {
          console.log(`Invalid status received for ${transaction._id}`);
          return;
        }

        if (statusNumber === 1) {
          console.log(
            `Transaction ${transaction._id} is still pending. Skipping update.`
          );
          return;
        }

        if (transaction.status === "completed") {
          console.log(`Transaction ${transaction._id} is already completed.`);
          return;
        }

        if (transaction.status === statusMapping[statusNumber]) {
          console.log(
            `Transaction ${transaction._id} status is already up to date.`
          );
          return;
        }

        transaction.status = statusMapping[statusNumber];
        await transaction.save();

        const transaction_id = transaction._id;
        const items = await TransactionItems.find({ transaction_id });

        let emailPayload = null;
        if (statusNumber === 3) {
          emailPayload = "Success Transaction";
        } else if ([4, 5, 6].includes(statusNumber)) {
          emailPayload = "Fail Transaction";
        }

        if (emailPayload) {
          const emailExists = await EmailLogs.findOne({
            transaction_id,
            payload: emailPayload,
          });

          if (!emailExists) {
            Promise.all([
              emailPayload === "Success Transaction"
                ? sendSuccessEmail(
                    transaction.customer_email,
                    transaction,
                    items
                  )
                : sendFailedEmail(
                    transaction.customer_email,
                    transaction,
                    items
                  ),
              new EmailLogs({
                transaction_id,
                customer_email: transaction.customer_email,
                payload: emailPayload,
              }).save(),
            ])
              .then(() => {
                console.log(
                  `Email sent & logged for transaction ${transaction._id}`
                );
              })
              .catch((err) =>
                console.error("Email sending/logging failed:", err)
              );
          }
        }

        console.log(
          `Transaction ${transaction._id} updated to ${transaction.status}.`
        );
      } catch (error) {
        console.error(`Error updating transaction ${transaction._id}:`, error);
      }
    });

    await Promise.all(updatePromises);
    console.log("Finished checking all pending transactions.");
  } catch (error) {
    console.error("Error updating transactions:", error);
  } finally {
    isUpdating = false;
  }
};

// Jalankan fungsi setiap 10 detik
setInterval(updateTransactionBTS, 1 * 15 * 1000);

// Jalankan sekali saat server dimulai
updateTransactionBTS();
