const express = require("express");
const ProductController = require("../controllers/productController");

const router = express.Router();
const productController = new ProductController();

// CRUD Routes cho Product (pid, pname, price, quantity)
router.get("/", productController.getProducts);          // Lấy tất cả
router.get("/:id", productController.getProductById);    // Lấy theo id
router.post("/", productController.createProduct);       // Tạo mới
router.put("/:id", productController.updateProduct);     // Cập nhật
router.delete("/:id", productController.deleteProduct);  // Xoá

module.exports = router;
