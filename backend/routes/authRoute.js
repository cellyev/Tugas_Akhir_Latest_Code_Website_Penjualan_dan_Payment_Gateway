const express = require("express");
const { signIn } = require("../controllers/authControllers/signInController");
const { signOut } = require("../controllers/authControllers/signOutController");
const { signUp } = require("../controllers/authControllers/signUpController");

const router = express.Router();

router.post("/login", signIn);
router.post("/logout", signOut);
router.post("/signup", signUp);

module.exports = router;
