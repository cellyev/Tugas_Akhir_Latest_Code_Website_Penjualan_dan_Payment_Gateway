const express = require("express");
const { SignIn } = require("../controllers/authControllers/signInController");
const { signUp } = require("../controllers/authControllers/signUpController");

const route = express.Router();

route.post("/signin", SignIn);
route.post("/signup", signUp);

exports.module = route;
