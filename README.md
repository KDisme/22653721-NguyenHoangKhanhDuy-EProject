# EProject - Microservices E-Commerce Platform### EProject Phase 1 - Microservices

## 📋 Mô Tả Dự Án

Đây là một dự án e-commerce được xây dựng theo kiến trúc microservices, sử dụng Node.js, Express, MongoDB, và RabbitMQ. Hệ thống bao gồm các dịch vụ độc lập giao tiếp với nhau thông qua API Gateway và Message Broker.Project này là một demo về kiến trúc microservices để học tập. Nó gồm các service tách biệt:

## 🏗️ Kiến Trúc Hệ Thống- `auth` - Authentication service (xử lý đăng ký/đăng nhập, trả JWT)

- `product` - Product service (CRUD sản phẩm, publish message khi mua)

Dự án được chia thành 4 microservices chính:- `order` - Order service (consume message để tạo đơn hàng)

- `api-gateway` - API Gateway (định tuyến request từ client tới service tương ứng)

### 1. **API Gateway** (Port: 3003)

- Điểm truy cập trung tâm cho tất cả các servicesRabbitMQ được sử dụng làm message broker giữa các service (queue tên `products` theo cấu hình mặc định). MongoDB được dùng để lưu dữ liệu cho từng service.

- Định tuyến requests đến các services tương ứng

- Reverse proxy sử dụng http-proxy> Lưu ý: dự án này chỉ phục vụ cho mục đích học tập, không dùng cho production.



### 2. **Auth Service** (Port: 3000)

- Xác thực và quản lý người dùng

- Đăng ký, đăng nhập, và quản lý JWT tokens## Cấu trúc thư mục

- Database: MongoDB (auth_service)

```

**Chức năng chính:**EProject-Phase-1/

- `POST /auth/register` - Đăng ký tài khoản mới ┣ api-gateway/

- `POST /auth/login` - Đăng nhập và nhận JWT token ┣ auth/

- `GET /auth/profile` - Lấy thông tin người dùng (yêu cầu authentication) ┣ order/

 ┣ product/

### 3. **Product Service** (Port: 3001) ┗ README.md

- Quản lý sản phẩm và tạo đơn hàng```

- Giao tiếp với Order Service qua RabbitMQ

- Database: MongoDB (product_service)Mỗi service chứa:

- `index.js` – Điểm khởi động chính

**Chức năng chính:**- `src/` – Controller, route, model

- `POST /products` - Tạo sản phẩm mới (yêu cầu authentication)- `.env` – Biến môi trường riêng

- `GET /products` - Lấy danh sách sản phẩm (yêu cầu authentication)

- `POST /products/buy` - Tạo đơn hàng (yêu cầu authentication)---

- `GET /products/order/:orderId` - Kiểm tra trạng thái đơn hàng```



### 4. **Order Service** (Port: 3002)### 2️⃣ Khởi động MongoDB và RabbitMQ

- Xử lý đơn hàng---

- Lắng nghe messages từ Product Service qua RabbitMQ

- Database: MongoDB (order_service)### 3️⃣ Khởi động các microservices

Sau khi MongoDB và RabbitMQ ổn định:

## 🛠️ Công Nghệ Sử Dụng---



### Backend## 🌐 Đường dẫn truy cập các service

- **Node.js & Express** - Framework web---

- **MongoDB** - NoSQL database cho mỗi service

- **Mongoose** - ODM cho MongoDB## 🧩 Thử nghiệm dự án với POSTMAN

- **RabbitMQ** - Message broker cho async communication

- **JWT (jsonwebtoken)** - Authentication### Auth Service

- **bcryptjs** - Mã hóa mật khẩu

**1. Đăng ký (Register)**

### DevOps & Tools

- **Docker & Docker Compose** - Container orchestration!

- **Mocha & Chai** - Testing framework

- **dotenv** - Environment variables management**2. Đăng nhập (Login)**

## 🚀 Cài Đặt và Chạy Dự Án

### Yêu Cầu Hệ Thống
- Node.js (v8)
- Docker & Docker Compose
- MongoDB (nếu chạy local)
- RabbitMQ (nếu chạy local)

### 1. Sử Dụng Docker (Khuyến nghị)

```bash
# Clone repository
git clone <repository-url>
cd EProject-Phase-1

# Khởi động toàn bộ hệ thống với Docker Compose
docker-compose up --build

# Hoặc chạy ở chế độ background
docker-compose up -d --build
```

Sau khi khởi động thành công, các services sẽ chạy tại:
- API Gateway: http://localhost:3003
- Auth Service: http://localhost:3000
- Product Service: http://localhost:3001
- Order Service: http://localhost:3002
- RabbitMQ Management: http://localhost:15672 (guest/guest)

### 2. Chạy Local (Development)

```bash
# Cài đặt dependencies cho từng service
npm install

cd auth && npm install
cd ../product && npm install
cd ../order && npm install
cd ../api-gateway && npm install

# Tạo file .env cho mỗi service
# Xem phần "Biến Môi Trường" bên dưới

# Khởi động từng service trong terminal riêng
cd auth && npm start
cd product && npm start
cd order && npm start
cd api-gateway && npm start
```

## 📡 API Endpoints

### Authentication
```
POST   /auth/register     # Đăng ký tài khoản
POST   /auth/login        # Đăng nhập
GET    /auth/profile      # Lấy thông tin user (Bearer token required)
```

### Products
```
POST   /products          # Tạo sản phẩm mới (Bearer token required)
GET    /products          # Lấy danh sách sản phẩm (Bearer token required)
POST   /products/buy      # Tạo đơn hàng (Bearer token required)
GET    /products/order/:orderId  # Kiểm tra trạng thái đơn hàng
```

## 🔄 Workflow Tạo Đơn Hàng

1. User đăng nhập và nhận JWT token
2. User gọi API `/products/buy` với danh sách product IDs
3. Product Service tạo order ID và publish message vào RabbitMQ queue "orders"
4. Order Service consume message từ queue và xử lý đơn hàng
5. Order Service publish kết quả vào queue "products"
6. Product Service nhận kết quả và trả về cho client (sử dụng long polling)

## 🔐 Authentication Flow

1. **Đăng ký**: User tạo tài khoản với username và password
2. **Mã hóa**: Password được hash bằng bcryptjs trước khi lưu vào DB
3. **Đăng nhập**: Server verify thông tin và trả về JWT token
4. **Authorization**: Client gửi token trong header `Authorization: Bearer <token>`
5. **Middleware**: Services verify token trước khi xử lý protected routes

## 🐳 Docker Services

```yaml
services:
  - rabbitmq (Message Broker)
  - mongodb (Database)
  - api-gateway (Reverse Proxy)
  - auth (Authentication Service)
  - product (Product Management)
  - order (Order Processing)
```

## 🔍 Monitoring & Debug

### RabbitMQ Management UI
- URL: http://localhost:15672
- Username: guest
- Password: guest
- Monitor queues: "orders" và "products"

### MongoDB
- Connection: mongodb://localhost:27017
- Databases: auth_service, product_service, order_service

### Docker Logs
```bash
# Xem logs của tất cả services
docker-compose logs -f

# Xem logs của một service cụ thể
docker-compose logs -f auth
docker-compose logs -f product
docker-compose logs -f order
```
## Profile

Họ Tên: Huỳnh Văn Quân
MSSV: 22636731

Repository: HuynhQuanIT/22636731-HuynhVanQuan-EProject