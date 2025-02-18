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
} = require("../controllers/transactionController/getTransactionController");

const router = express.Router();

router.post("/create-transaction", createTransaction);
router.post("/paying/:transaction_id/:status", paying);

router.get("/get-by-id/:transaction_id", getById);
router.get("/:status", getAllTransactionByStatus);

module.exports = router;
