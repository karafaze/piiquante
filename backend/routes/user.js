const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const validateUserInputs = require('../middleware/signup-validator');
const registerSchema = require('../models/register');

router.post("/signup",
    registerSchema,
    validateUserInputs,
    userController.signup);
router.post("/login", userController.login);

module.exports = router;