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

const router = express.Router();

router.post("/create-transaction", createTransaction);
router.post("/paying/:transaction_id/:status", paying);

router.get("/get-by-id/:transaction_id", getById);
router.get("/get-by-status/:status", getAllTransactionByStatus);

router.get(
  "/get-transaction-succes-and-is-read",
  getTransactionBySuccessAndIsRead
);
router.put(
  "/update-transaction-is-read/:transaction_id",
  updateTransactionIsRead
);

module.exports = router;
