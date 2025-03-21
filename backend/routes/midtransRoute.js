const express = require("express");
const {
  createTransactionMidtrans,
} = require("../controllers/midtransControllers/createTransactionMidtrans");
const {
  payment_notification,
} = require("../controllers/paymentNotificationController/paymentNotification");

const route = express.Router();

route.post("/create-transaction", createTransactionMidtrans);
route.post("/payment-notification", payment_notification);

module.exports = route;
