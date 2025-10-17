const ProductsRepository = require("../repositories/productsRepository");

/**
 * Class that ties together the business logic and the data access layer
 */
class ProductsService {
  constructor() {
    this.productsRepository = new ProductsRepository();
  }

  async createProduct(product) {

    const createdProduct = await this.productsRepository.create(product);
    return createdProduct;
  }

  async getProductById(productId) {
    const product = await this.productsRepository.findById(productId);
    return product;
  }

  async getProducts() {
    const products = await this.productsRepository.findAll();
    return products;
  }
  async deleteProductById(productId) {
    const deletedProduct = await this.productsRepository.deleteById(productId);
    return deletedProduct;
  }
  async updateProduct(productId, updateData) {
    const updatedProduct = await this.productsRepository.updateById(productId, updateData);
    return updatedProduct; 
  }
// THÊM METHOD MỚI - Xử lý logic nghiệp vụ khi mua products
// Kiểm tra tồn kho, giảm số lượng, tính tổng giá
async buyProducts(ids, quantities) {
  // Validate input
  if (!Array.isArray(ids) || !Array.isArray(quantities)) {
    throw new Error('ids and quantities must be arrays');
  }
  
  if (ids.length !== quantities.length) {
    throw new Error('ids and quantities arrays must have the same length');
  }
  
  // Lấy thông tin tất cả products
  const products = await this.productsRepository.findByIds(ids);
  
  // Kiểm tra tất cả products có tồn tại không
  if (products.length !== ids.length) {
    throw new Error('Some products not found');
  }
  
  // Tạo map để dễ tra cứu product theo id
  const productMap = new Map();
  products.forEach(product => {
    productMap.set(product._id.toString(), product);
  });
  
  // Kiểm tra số lượng và giảm số lượng cho từng product
  let totalPrice = 0;
  const updatedProducts = [];
  
  for (let i = 0; i < ids.length; i++) {
    const productId = ids[i];
    const quantity = quantities[i];
    
    // Validate quantity
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(`Invalid quantity for product ${productId}: ${quantity}`);
    }
    
    const product = productMap.get(productId);
    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }
    
    // Giảm số lượng product trong database
    const updatedProduct = await this.productsRepository.decreaseQuantity(productId, quantity);
    updatedProducts.push(updatedProduct);
    
    // Tính tổng giá (price * quantity)
    totalPrice += product.price * quantity;
  }
  
  return {
    products: updatedProducts,
    orderDetails: ids.map((id, index) => {
      const product = productMap.get(id);
      const quantity = quantities[index];
      return {
        productId: id,
        quantity: quantity,
        price: product.price,
        totalPrice: product.price * quantity 
      };
    }),
    totalPrice: totalPrice 
  };
}
}
module.exports = ProductsService;
