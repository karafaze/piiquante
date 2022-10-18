const express = require("express");
const router = express.Router();

const authCheck = require("../middleware/auth");
const multer = require("../middleware/multer");

const sauceController = require("../controllers/sauce");

router.get("/:id", authCheck, sauceController.getOneSauce);
router.get("/", authCheck, sauceController.getSauces);
router.post("/", authCheck, multer, sauceController.addSauce);
router.put("/:id", authCheck, multer, sauceController.updateSauce);
router.delete("/:id", authCheck, sauceController.deleteSauce);
router.post("/:id/like", authCheck, sauceController.handleLike)

module.exports = router;
