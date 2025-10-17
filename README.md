
# 🛒 E-Commerce Microservices System
**Student ID:** 22653721  
**Author:** Nguyễn Hoàng Khánh Duy

---

## 📋 Mục Lục
- [Giới Thiệu](#-giới-thiệu)
- [Kiến Trúc Hệ Thống](#-kiến-trúc-hệ-thống)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Hướng Dẫn Cài Đặt](#-hướng-dẫn-cài-đặt)
- [API Documentation](#-api-documentation)
- [Luồng Xử Lý Mua Hàng](#-luồng-xử-lý-mua-hàng)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Giới Thiệu

Hệ thống quản lý bán hàng điện tử xây dựng theo kiến trúc **Microservices**, cho phép:
- ✅ Quản lý người dùng (đăng ký, đăng nhập, xác thực JWT)
- ✅ Quản lý sản phẩm (CRUD operations)
- ✅ Quản lý đơn hàng (tạo order, tính tổng giá, cập nhật tồn kho)
- ✅ Giao tiếp bất đồng bộ giữa các services qua RabbitMQ
- ✅ Kiến trúc phân tầng (Controller → Service → Repository → Model)

---

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                               │
│                    (Postman/Browser)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌────────────────────────────────────────────────────────────┐
│                   API GATEWAY (Port 3003)                  │
│          - Routing & Load Balancing                        │
│          - Single Entry Point                              │
└─────┬──────────────────┬──────────────────┬────────────────┘
      │                  │                  │
      ↓                  ↓                  ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ AUTH SERVICE │  │PRODUCT SERVICE│  │ORDER SERVICE │
│ (Port 3000)  │  │ (Port 3001)   │  │ (Port 3002)  │
│              │  │               │  │              │
│ - Register   │  │ - CRUD Product│  │ - Save Order │
│ - Login      │  │ - Buy Product │  │ - History    │
│ - JWT Auth   │  │ - Stock Mgmt  │  │              │
└──────┬───────┘  └───────┬───────┘  └──────┬───────┘
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
                ┌─────────┴─────────┐
                │                   │
                ↓                   ↓
        ┌──────────────┐    ┌──────────────┐
        │   MongoDB    │    │   RabbitMQ   │
        │  (Port 27018)│    │  (Port 5672) │
        │              │    │              │
        │ - auth DB    │    │ - orders Q   │
        │ - products DB│    │ - products Q │
        │ - orders DB  │    │              │
        └──────────────┘    └──────────────┘
```

---

## 🛠️ Công Nghệ Sử Dụng

| Thành Phần | Công Nghệ | Version | Mô Tả |
|------------|-----------|---------|-------|
| **Runtime** | Node.js | 18.x | JavaScript runtime |
| **Framework** | Express.js | 4.18.x | Web framework |
| **Database** | MongoDB | 6.0 | NoSQL database |
| **ODM** | Mongoose | 7.0.x | MongoDB object modeling |
| **Message Broker** | RabbitMQ | 3.12 | Asynchronous messaging |
| **Authentication** | JWT | 9.0.x | Token-based auth |
| **Password Hashing** | bcrypt.js | - | Secure password storage |
| **Container** | Docker | - | Containerization |
| **Testing** | Mocha/Chai | 10.2.x/4.3.x | Unit & Integration tests |

---

## 📁 Cấu Trúc Dự Án

```
22653721-NguyenHoangKhanhDuy-EProject/
│
├── api-gateway/                 # API Gateway Service
│   ├── Dockerfile
│   ├── index.js                 # Entry point
│   └── package.json
│
├── auth/                        # Authentication Service
│   ├── src/
│   │   ├── controllers/         # Controller layer
│   │   │   └── authController.js
│   │   ├── services/            # Business logic layer
│   │   │   └── authService.js
│   │   ├── repositories/        # Data access layer
│   │   │   └── userRepository.js
│   │   ├── models/              # Database models
│   │   │   └── user.js
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js
│   │   └── config/              # Configuration
│   │       └── index.js
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
│
├── product/                     # Product Service
│   ├── src/
│   │   ├── controllers/         
│   │   │   └── productController.js  # Handle HTTP requests
│   │   ├── services/            
│   │   │   └── productsService.js    # Business logic (buy, calculate)
│   │   ├── repositories/        
│   │   │   └── productsRepository.js # Database operations
│   │   ├── models/              
│   │   │   └── product.js            # Product schema
│   │   ├── routes/
│   │   │   └── productRoutes.js      # API routes
│   │   └── utils/
│   │       ├── isAuthenticated.js    # JWT middleware
│   │       └── messageBroker.js      # RabbitMQ helper
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
│
├── order/                       # Order Service
│   ├── src/
│   │   ├── app.js               # Main application logic
│   │   ├── models/
│   │   │   └── order.js         # Order schema
│   │   ├── config.js            # Configuration
│   │   └── utils/
│   │       ├── isAuthenticated.js
│   │       └── messageBroker.js
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
│
├── docker-compose.yml           # Docker orchestration
├── package.json                 # Root package.json for testing
└── README.md                    # This file
```

---

## 🚀 Hướng Dẫn Cài Đặt

### **Yêu Cầu Hệ Thống**
- Docker & Docker Compose
- Node.js 18.x (nếu chạy local không dùng Docker)
- MongoDB 6.0+
- RabbitMQ 3.12+

### **Cài Đặt Với Docker (Khuyên Dùng)**

#### **Bước 1: Clone Repository**
```bash
git clone https://github.com/KDisme/22653721-NguyenHoangKhanhDuy-EProject.git
cd 22653721-NguyenHoangKhanhDuy-EProject
```

#### **Bước 2: Khởi Động Tất Cả Services**
```bash
# Build và start tất cả containers
docker-compose up --build -d

# Hoặc start từng service riêng lẻ
docker-compose up --build auth -d
docker-compose up --build product -d
docker-compose up --build order -d
docker-compose up --build api-gateway -d
```

#### **Bước 3: Kiểm Tra Trạng Thái**
```bash
# Xem trạng thái containers
docker-compose ps

# Xem logs
docker-compose logs -f product
docker-compose logs -f order
docker-compose logs -f auth
```

#### **Bước 4: Stop Services**
```bash
# Stop tất cả
docker-compose down

# Stop và xóa volumes (data sẽ bị mất)
docker-compose down -v
```

### **Cài Đặt Local (Không Dùng Docker)**

#### **1. Cài Dependencies**
```bash
# Cài cho từng service
cd auth && npm install && cd ..
cd product && npm install && cd ..
cd order && npm install && cd ..
cd api-gateway && npm install && cd ..
```

#### **2. Setup MongoDB & RabbitMQ**
```bash
# MongoDB
mongod --dbpath /path/to/data/db --port 27018

# RabbitMQ
rabbitmq-server
```

#### **3. Chạy Services**
```bash
# Terminal 1 - Auth Service
cd auth
node index.js

# Terminal 2 - Product Service
cd product
node index.js

# Terminal 3 - Order Service
cd order
node index.js

# Terminal 4 - API Gateway
cd api-gateway
node index.js
```

---

## 📡 API Documentation

### **Base URL**
```
http://localhost:3003
```

### **🔐 Authentication Endpoints**

#### 1. Register User
```http
POST /auth/api/register
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123",
  "email": "john@example.com"
}
```


#### 2. Login
```http
POST /auth/api/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 3. Get Profile
```http
GET /auth/api/profile
Authorization: Bearer <token>
```

---

### **📦 Product Endpoints**

#### 1. Create Product
```http
POST /products/api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "price": 25000000,
  "description": "Latest iPhone model",
  "quantity": 50
}
```

#### 2. Get All Products
```http
GET /products/api/products
Authorization: Bearer <token>
```


#### 3. Get Product By ID
```http
GET /products/api/products/:id
Authorization: Bearer <token>
```

#### 4. Update Product
```http
PUT /products/api/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 24000000,
  "quantity": 45
}
```

#### 5. Delete Product
```http
DELETE /products/api/products/:id
Authorization: Bearer <token>
```

#### 6. **Buy Products (Create Order)** ⭐
```http
POST /products/api/products/buy
Authorization: Bearer <token>
Content-Type: application/json

{
  "ids": ["productID 1", "productID 2"],
  "quantity": [2, 3]
}


## 🔄 Luồng Xử Lý Mua Hàng

### **Flow Diagram**

```
Client → API Gateway → Product Service
                           ↓
                    [Product Controller]
                           ↓
                    [Product Service]
                           ↓ (1) Validate input
                           ↓ (2) Get products from DB
                           ↓ (3) Check stock availability
                           ↓ (4) Decrease quantity (atomic $inc)
                           ↓ (5) Calculate totalPrice
                           ↓
                    [Product Repository]
                           ↓
                       MongoDB ← Update quantity
                           ↓
                    Generate orderId
                           ↓
                   Publish to RabbitMQ
                        (orders queue)
                           ↓
                    ┌─────────────┐
                    │ Order Service │
                    └─────────────┘
                           ↓ Consume message
                           ↓ Create Order document
                           ↓ Save to MongoDB
                           ↓ Send ACK
                           ↓ Publish confirmation
                        (products queue)
                           ↓
                    Product Service receives
                           ↓ Update order status
                           ↓ Return to client
```

### **Chi Tiết Các Bước**

1. **Client gửi request** với `ids` và `quantity`
2. **Product Service validate** input và kiểm tra tồn kho
3. **Repository giảm số lượng** sản phẩm trong DB (atomic operation)
4. **Service tính toán**:
   - `totalPrice` = Σ(price × quantity)
   - Tạo `orderDetails` cho từng sản phẩm
5. **Gửi message** qua RabbitMQ đến Order Service
6. **Order Service nhận**, lưu order vào DB
7. **Order Service gửi confirmation** về Product Service
8. **Product Service trả response** cho client

### **Ưu Điểm Của Kiến Trúc Này**

✅ **Decoupling**: Services độc lập, dễ maintain  
✅ **Asynchronous**: Không block khi tạo order  
✅ **Scalability**: Dễ dàng scale horizontal  
✅ **Fault Tolerance**: RabbitMQ đảm bảo message không mất  
✅ **Data Consistency**: Atomic operations với MongoDB  

### **Test Với Postman**

#### **1. Setup Environment**
```
Base URL: http://localhost:3003
Token: {{token}}
```

#### **2. Test Flow**
```
1. Register → Get user credentials
2. Login → Get JWT token
3. Create Product → Add products to inventory
4. Buy Products → Test order flow
5. Verify:
   - Product quantity decreased
   - Order created in MongoDB
   - Correct totalPrice calculation
```

### **Sample Test Cases**

| Test Case | Input | Expected Output |
|-----------|-------|-----------------|
| Buy 1 product | `ids: ["id1"], quantity: [2]` | totalPrice = price × 2 |
| Buy 2 products | `ids: ["id1","id2"], quantity: [2,3]` | totalPrice = (price1×2) + (price2×3) |
| Insufficient stock | `quantity: [999]` | 400 Error: "Not enough quantity" |
| Invalid product | `ids: ["invalid"]` | 404 Error: "Product not found" |

---

## ⚠️ Troubleshooting

### **Container Không Start**
```bash
# Kiểm tra logs
docker-compose logs <service-name>

# Rebuild lại
docker-compose up --build <service-name> -d
```

### **RabbitMQ Connection Error**
```bash
# Kiểm tra RabbitMQ đang chạy
docker-compose ps rabbitmq

# Restart RabbitMQ
docker-compose restart rabbitmq
```

### **MongoDB Connection Error**
```bash
# Kiểm tra MongoDB
docker exec -it mongodb mongosh

# Test connection
use admin
db.auth("admin", "password")
```

### **JWT Token Invalid**
- Đảm bảo `JWT_SECRET` giống nhau ở tất cả services
- Token format: `Bearer <token>`
- Check token expiration

### **Product Quantity Không Giảm**
```bash
# Check logs của Product service
docker-compose logs product

# Check MongoDB
docker exec -it mongodb mongosh
use products
db.products.find()
```

## 🔒 Security

- ✅ Passwords được hash với bcrypt
- ✅ JWT cho authentication
- ✅ Tất cả endpoints (trừ login/register) cần token
- ✅ Environment variables cho sensitive data
- ✅ Input validation ở Controller layer

---

## 📈 Future Improvements

- [ ] Implement Redis caching
- [ ] Add MongoDB transactions cho data consistency
- [ ] Implement dead letter queue cho failed messages
- [ ] Add API rate limiting
- [ ] Implement logging với Winston/Morgan
- [ ] Add Swagger documentation
- [ ] Implement health check endpoints
- [ ] Add Docker health checks
- [ ] Implement CI/CD pipeline

---

## 📞 Contact

**Nguyễn Hoàng Khánh Duy**  
Student ID: 22653721  
Email: [khanhduy201420@gmail.com]  
GitHub: https://github.com/KDisme

---

## 📄 License

MR.HUYNHNAM

---

