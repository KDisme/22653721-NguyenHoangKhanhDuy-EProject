const Product = require("../models/product");

/**
 * Class that contains the business logic for the product repository interacting with the product model
 */



class ProductsRepository {
  async create(product) {
    const createdProduct = await Product.create(product);
    return createdProduct.toObject();
  }

  async findById(productId) {
    const product = await Product.findById(productId).lean();
    return product;
  }

  async findAll() {
    const products = await Product.find().lean();
    return products;
  }
  async deleteById(productId) {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    return deletedProduct;
  }
  async updateById(productId, updateData) {
    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true }).lean();
    return updatedProduct;
  }
 
// THÊM METHOD MỚI - Giảm số lượng nhiều products cùng lúc
async decreaseQuantity(productId, quantity) {
  // Tìm product và kiểm tra số lượng còn đủ không
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error(`Product with id ${productId} not found`);
  }
  
  if (product.quantity < quantity) {
    throw new Error(`Not enough quantity for product ${product.name}. Available: ${product.quantity}, Requested: ${quantity}`);
  }
  
  // Giảm số lượng product
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { $inc: { quantity: -quantity } }, // Sử dụng $inc để giảm số lượng
    { new: true, runValidators: true }
  ).lean();
  
  return updatedProduct;
}

// THÊM METHOD MỚI - Lấy nhiều products theo danh sách IDs
async findByIds(productIds) {
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  return products;
}
}

module.exports = ProductsRepository;
