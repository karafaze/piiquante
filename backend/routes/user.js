const express = require("express");
const router = express.Router();

const authCheck = require("../middleware/auth");
const userController = require("../controllers/user");

router.post("/signup", authCheck, userController.signup);
router.post("/login", authCheck, userController.login);
router.get("/all", authCheck, userController.all);

module.exports = router;
