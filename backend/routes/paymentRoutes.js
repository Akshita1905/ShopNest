const express = require("express");
const { createdOrder, verifyPayment } = require("../controller/paymentController.js");
const router = express.Router();

router.post("/order", createdOrder);
router.post("/payment", verifyPayment);

module.exports = router;