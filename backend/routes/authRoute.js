const express = require("express");
const { SignIn } = require("../controllers/authControllers/signInController");
// const { signUp } = require("../controllers/authControllers/signUpController");
const { signOut } = require("../controllers/authControllers/signOutController");

const router = express.Router();

router.post("/signin", SignIn);
// router.post("/signup", signUp);
router.post("/signout", signOut);

module.exports = router;
