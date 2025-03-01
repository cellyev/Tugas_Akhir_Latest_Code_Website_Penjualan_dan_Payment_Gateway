const express = require("express");
const { signIn } = require("../controllers/authControllers/signInController");
const { signOut } = require("../controllers/authControllers/signOutController");

const router = express.Router();

router.post("/login", signIn);
router.post("/logout", signOut);

module.exports = router;
