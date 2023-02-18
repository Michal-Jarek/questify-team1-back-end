const express = require("express");

const authController = require("../modules/auth/controller");
const { validateData, auth } = require("../modules/auth/middleware");

const router = express.Router();

router.post("/register", validateData, authController.register);

router.post("/login", validateData, authController.login);

router.post("/logout", auth, authController.logout);

module.exports = router;
