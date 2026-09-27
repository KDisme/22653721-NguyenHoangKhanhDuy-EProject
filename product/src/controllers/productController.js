const Product = require("../models/product");

/**
 * Controller cho CRUD Product (pid, pname, price, quantity)
 */
class ProductController {
  // POST /api/products — Tạo mới sản phẩm
  async createProduct(req, res) {
    try {
      const { pname, price, quantity } = req.body;

      if (!pname || price === undefined || quantity === undefined) {
        return res
          .status(400)
          .json({ message: "Thiếu thông tin: pname, price, quantity là bắt buộc" });
      }

      const product = new Product({ pname, price, quantity });
      const validationError = product.validateSync();
      if (validationError) {
        return res.status(400).json({ message: validationError.message });
      }

      await product.save();
      res.status(201).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // GET /api/products — Lấy tất cả sản phẩm
  async getProducts(req, res) {
    try {
      const products = await Product.find({});
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // GET /api/products/:id — Lấy sản phẩm theo _id
  async getProductById(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      res.status(200).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // PUT /api/products/:id — Cập nhật sản phẩm
  async updateProduct(req, res) {
    try {
      const { pname, price, quantity } = req.body;
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { pname, price, quantity },
        { new: true, runValidators: true }
      );
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      res.status(200).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }

  // DELETE /api/products/:id — Xoá sản phẩm
  async deleteProduct(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      res.status(200).json({ message: "Xoá thành công", product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }
}

module.exports = ProductController;
