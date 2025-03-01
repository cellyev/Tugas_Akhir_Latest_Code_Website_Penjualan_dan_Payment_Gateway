const express = require("express");
const {
  createTransaction,
} = require("../controllers/transactionController/createTransactionController");
const {
  paying,
} = require("../controllers/transactionController/completePaymentController");
const {
  getById,
  getAllTransactionByStatus,
  getTransactionBySuccessAndIsRead,
} = require("../controllers/transactionController/getTransactionController");
const {
  updateTransactionIsRead,
} = require("../controllers/transactionController/updateTransactionController");
const { verifyToken } = require("../middlewares/verifyToken");
const { isAdmin } = require("../middlewares/isAdmin");

const router = express.Router();

router.post("/create", createTransaction);
router.put("/:transaction_id/payment/:status", paying);

router.get("/id/:transaction_id", getById);

// Use verify Token
router.get("/status/:status", verifyToken, isAdmin, getAllTransactionByStatus);

router.get(
  "/get-transaction-succes-and-is-read",
  getTransactionBySuccessAndIsRead
);
router.put(
  "/update-transaction-is-read/:transaction_id",
  updateTransactionIsRead
);

module.exports = router;
