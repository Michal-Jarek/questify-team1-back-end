const express = require('express');

const authController = require("../modules/auth/controller")
const {validateData} = require("../modules/auth/middleware")

const router = express.Router();

router.post('/register', validateData, authController.register);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

module.exports = router;
