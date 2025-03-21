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

    const { transaction_status, order_id } = notification;

    // Validasi order_id sebelum melakukan split
    if (!order_id || !order_id.includes("-")) {
      return res.status(400).json({
        success: false,
        message: "Invalid order_id format.",
        data: null,
      });
    }

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

    // Tentukan email_payload berdasarkan transaction_status
    let email_payload = "Unknown Transaction Status"; // Nilai default

    if (transaction_status === "settlement") {
      transaction.status === "completed";
      email_payload = "Success Transaction";
    } else if (transaction_status === "pending") {
      transaction.status = transaction_status;
      email_payload = "Pending Transaction";
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "expire"
    ) {
      transaction.status = transaction_status;
      email_payload = "Fail Transaction";
    }

    // Simpan perubahan status transaksi
    await transaction.save();

    // Kirim email hanya jika transaksi sukses, gagal, atau pending
    if (email_payload && transaction.customer_email) {
      const email_exists = await EmailLogs.findOne({
        transaction_id,
        payload: email_payload,
      });

      if (!email_exists) {
        console.log("Mengirim email notifikasi...");

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

        console.log("Email berhasil dikirim & log disimpan.");
      } else {
        console.log(
          "Email sudah pernah dikirim sebelumnya, tidak dikirim ulang."
        );
      }
    } else {
      console.log(
        "Tidak ada email yang dikirim karena email_payload kosong atau email pelanggan tidak tersedia."
      );
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
