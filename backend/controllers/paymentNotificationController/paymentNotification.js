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
      default:
        console.log(`Status transaksi tidak dikenali: ${transaction_status}`);
        return res.status(400).json({
          success: false,
          message: `Unrecognized transaction status: ${transaction_status}`,
          data: null,
        });
    }

    // Simpan perubahan status transaksi
    await transaction.save();

    console.log("Email Payload:", email_payload);

    // Kirim email hanya jika transaksi sukses atau gagal
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
