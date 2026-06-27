const express = require("express");
const {protect} = require("../middleware/authMiddleware.js");
const {admin} = require("../middleware/adminMiddleware.js");
const  { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controller/productController.js");

const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.route("/:id").get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;