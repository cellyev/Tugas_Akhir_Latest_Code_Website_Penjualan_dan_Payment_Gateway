const express = require("express");
const { signIn } = require("../controllers/authControllers/signInController");
// const { signUp } = require("../controllers/authControllers/signUpController");
const { signOut } = require("../controllers/authControllers/signOutController");

const router = express.Router();

router.post("/signin", signIn);
// router.post("/signup", signUp);
router.post("/signout", signOut);

module.exports = router;
