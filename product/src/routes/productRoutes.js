const express = require("express");
const ProductController = require("../controllers/productController");
const isAuthenticated = require("../utils/isAuthenticated");

const router = express.Router();
const productController = new ProductController();

router.post("/", isAuthenticated, (req, res, next) => productController.createProduct(req, res, next));
router.post("/buy", isAuthenticated, (req, res, next) => productController.createOrder(req, res, next));
router.get("/", isAuthenticated, (req, res, next) => productController.getProducts(req, res, next));
router.get("/order/status/:orderId", isAuthenticated, (req, res, next) => productController.getOrderStatus(req, res, next));
router.get("/:id", isAuthenticated, (req, res, next) => productController.getProductById(req, res, next));
router.delete("/:id", isAuthenticated, (req, res, next) => productController.deleteProduct(req, res, next));
router.put("/:id", isAuthenticated, (req, res, next) => productController.updateProduct(req, res, next));
module.exports = router;
