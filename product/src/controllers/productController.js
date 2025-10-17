const Product = require("../models/product");
const messageBroker = require("../utils/messageBroker");
const uuid = require('uuid');
const ProductsService = require("../services/productsService");

/**
 * Class to hold the API implementation for the product services
 */
class ProductController {

  constructor() {
    this.productsService = new ProductsService();
    this.createOrder = this.createOrder.bind(this);
    this.getOrderStatus = this.getOrderStatus.bind(this);
    this.ordersMap = new Map();
    
  }

  async createProduct(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const product = req.body;
      const createdProduct = await this.productsService.createProduct(product);

      res.status(201).json(createdProduct);
    } catch (error) {
      console.error(error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  }

  async getProductById(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const product = await this.productsService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
  async deleteProduct(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const deletedProduct = await this.productsService.deleteProductById(req.params.id);
      
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json({ 
        message: "Product deleted successfully"
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
  async updateProduct(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const productId = req.params.id;
      const updateData = req.body;

      const updatedProduct = await this.productsService.updateProduct(productId, updateData);
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json(updatedProduct);
    } catch (error) {
      console.error(error); 
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Server error" });
    }
  }

  //   async createOrder(req, res, next) {
  //   try {
  //     const token = req.headers.authorization;
  //     if (!token) {
  //       return res.status(401).json({ message: "Unauthorized" });
  //     }
  
  //     const { ids } = req.body;
  //     const products = await Product.find({ _id: { $in: ids } });
  
  //     const orderId = uuid.v4(); // Generate a unique order ID
  //     this.ordersMap.set(orderId, { 
  //       status: "pending", 
  //       products, 
  //       username: req.user.username
  //     });
  
  //     await messageBroker.publishMessage("orders", {
  //       products,
  //       username: req.user.username,
  //       orderId, // include the order ID in the message to orders queue
  //     });

  //     messageBroker.consumeMessage("products", (data) => {
  //       const orderData = JSON.parse(JSON.stringify(data));
  //       const { orderId } = orderData;
  //       const order = this.ordersMap.get(orderId);
  //       if (order) {
  //         // update the order in the map
  //         this.ordersMap.set(orderId, { ...order, ...orderData, status: 'completed' });
  //         console.log("Updated order:", order);
  //       }
  //     });
  
  //     // Long polling until order is completed
  //     let order = this.ordersMap.get(orderId);
  //     while (order.status !== 'completed') {
  //       await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second before checking status again
  //       order = this.ordersMap.get(orderId);
  //     }
  
  //     // Once the order is marked as completed, return the complete order details
  //     return res.status(201).json(order);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // }
  async createOrder(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // THAY ĐỔI: Nhận body theo format mới {ids: [...], quantity: [...]}
    const { ids, quantity } = req.body;
    
    // Validate input
    if (!ids || !quantity) {
      return res.status(400).json({ 
        message: "Missing required fields: ids and quantity" 
      });
    }

    // THÊM: Gọi service để xử lý logic nghiệp vụ
    // - Kiểm tra tồn kho
    // - Giảm số lượng products
    // - Tính totalPrice
    const orderResult = await this.productsService.buyProducts(ids, quantity);

    const orderId = uuid.v4(); // Generate a unique order ID
    
   
    // THAY ĐỔI: Lưu thông tin order với totalPrice đã tính
    this.ordersMap.set(orderId, { 
      status: "pending", 
      products: orderResult.products, // Products sau khi đã giảm số lượng
      totalPrice: orderResult.totalPrice, // Tổng giá đã tính
      orderDetails: orderResult.orderDetails // Chi tiết từng product (id, quantity, price)
      
    });

    // THAY ĐỔI: Gửi message đến order service với totalPrice
    await messageBroker.publishMessage("orders", {
      products: orderResult.products,
      totalPrice: orderResult.totalPrice,
      orderDetails: orderResult.orderDetails,
      orderId, // include the order ID in the message to orders queue
    });

    messageBroker.consumeMessage("products", (data) => {
      const orderData = JSON.parse(JSON.stringify(data));
      const { orderId } = orderData;
      const order = this.ordersMap.get(orderId);
      if (order) {
        // update the order in the map
        this.ordersMap.set(orderId, { ...order, ...orderData, status: 'completed' });
        console.log("Updated order:", order);
      }
    });

    // Long polling until order is completed
    let order = this.ordersMap.get(orderId);
    while (order.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second before checking status again
      order = this.ordersMap.get(orderId);
    }

    // Once the order is marked as completed, return the complete order details
    return res.status(201).json(order);
  } catch (error) {
    console.error(error);
    // THÊM: Xử lý các lỗi cụ thể từ service
    if (error.message.includes('Not enough quantity')) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
}
  
  async getOrderStatus(req, res, next) {
    const { orderId } = req.params;
    const order = this.ordersMap.get(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(200).json(order);
  }

  async getProducts(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const products = await this.productsService.getProducts();

      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = ProductController;
