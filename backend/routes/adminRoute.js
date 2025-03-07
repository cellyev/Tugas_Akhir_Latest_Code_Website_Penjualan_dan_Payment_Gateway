const express = require("express");

const { verifyToken } = require("../middlewares/verifyToken");
const { isAdmin } = require("../middlewares/isAdmin");
const {
  setCookingStatus,
} = require("../controllers/adminControllers/setCookingStatus");

const router = express.Router();

router.put(
  "/update-cooking-status/:transaction_id",
  verifyToken,
  isAdmin,
  setCookingStatus
);

module.exports = router;
