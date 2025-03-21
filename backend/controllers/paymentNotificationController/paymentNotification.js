const Transactions = require("../../models/transactionSchema");
const TransactionItems = require("../../models/transactionItemSchema");
const EmailLogs = require("../../models/emailLogSchema");
const {
  sendSuccessEmail,
} = require("../../middlewares/sendMail/sendSuccessEmail");
const {
  sendFailedEmail,
} = require("../../middlewares/sendMail/sendFailedEmail");

// Payment Notification URL
exports.payment_notification = async (req, res) => {
  try {
    const notification = req.body;
    console.log("Payment Notification:", notification);

    const { transaction_status, order_id, fraud_status } = notification;

    // Ekstrak ID transaksi dari order_id Midtrans (format: "order-<id>")
    const transaction_id = order_id.split("-")[1];

    // Cari transaksi dan item transaksi secara paralel
    const [transaction, transaction_items] = await Promise.all([
      Transactions.findById(transaction_id),
      TransactionItems.find({ transaction_id }),
    ]);

    // Cek apakah transaksi ditemukan
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: `Transaction with ID "${transaction_id}" not found.`,
        data: null,
      });
    }

    // Cek apakah item transaksi ditemukan
    if (transaction_items.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No transaction items found for transaction ID "${transaction_id}".`,
        data: null,
      });
    }

    // Periksa status transaksi dari Midtrans dan ubah status di database
    let email_payload = null;

    switch (transaction_status) {
      case "settlement":
        console.log(`Pembayaran sukses untuk Order ID: ${transaction_id}`);
        transaction.status = "completed";
        email_payload = "Success Transaction";
        break;
      case "expire":
        console.log(`Pembayaran expired untuk Order ID: ${transaction_id}`);
        transaction.status = "expired";
        email_payload = "Fail Transaction";
        break;
      case "pending":
        console.log(`Pembayaran pending untuk Order ID: ${transaction_id}`);
        transaction.status = "pending";
        break;
      case "cancel":
        console.log(`Pembayaran dibatalkan untuk Order ID: ${transaction_id}`);
        transaction.status = "canceled";
        email_payload = "Fail Transaction";
        break;
      case "deny":
      case "challenge":
        console.log(`Pembayaran ditolak untuk Order ID: ${transaction_id}`);
        transaction.status = "failed";
        email_payload = "Fail Transaction";
        break;
    }

    // Simpan perubahan status transaksi
    await transaction.save();

    // Kirim email hanya jika transaksi sukses atau gagal
    if (email_payload) {
      const email_exists = await EmailLogs.findOne({
        transaction_id,
        payload: email_payload,
      });

      if (!email_exists) {
        // Kirim email & simpan log secara paralel
        await Promise.allSettled([
          email_payload === "Success Transaction"
            ? sendSuccessEmail(
                transaction.customer_email,
                transaction,
                transaction_items
              )
            : sendFailedEmail(
                transaction.customer_email,
                transaction,
                transaction_items
              ),
          new EmailLogs({
            transaction_id,
            customer_email: transaction.customer_email,
            payload: email_payload,
          }).save(),
        ]);
      }
    }

    return res.status(200).json({
      success: true,
      message:
        "Payment notification received and transaction updated successfully.",
      data: {
        transaction,
        transaction_items,
      },
    });
  } catch (error) {
    console.error("Error processing payment notification:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
