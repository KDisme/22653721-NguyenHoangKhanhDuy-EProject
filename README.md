# EProject - Microservices E-Commerce Platform

## � Giới thiệu

Dự án này là một nền tảng thương mại điện tử được xây dựng theo kiến trúc microservices, sử dụng Node.js, Express, MongoDB và RabbitMQ. Mỗi chức năng chính được tách thành một service độc lập, giao tiếp qua API Gateway và Message Broker.

## 🏗️ Kiến trúc hệ thống

- **API Gateway** (`api-gateway` - port 3003): Định tuyến request từ client đến các service, reverse proxy.
- **Auth Service** (`auth` - port 3000): Xác thực, đăng ký, đăng nhập, quản lý JWT.
- **Product Service** (`product` - port 3001): CRUD sản phẩm, tạo đơn hàng, giao tiếp với Order Service qua RabbitMQ.
- **Order Service** (`order` - port 3002): Xử lý đơn hàng, consume message từ RabbitMQ.

**Message Broker:** RabbitMQ (queues: `orders`, `products`)  
**Database:** Mỗi service sử dụng một MongoDB riêng biệt.

## 📁 Cấu trúc thư mục

```
EProject/
│
├── api-gateway/
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
│
├── auth/
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── repositories/
│       ├── services/
│       └── test/
│
├── product/
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── config.js
│       ├── controllers/
│       ├── models/
│       ├── repositories/
│       ├── routes/
│       ├── services/
│       ├── test/
│       └── utils/
│
├── order/
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── config.js
│       ├── models/
│       ├── services/
│       └── utils/
│
├── utils/
│
├── docker-compose.yml
├── package.json
└── README.md
```

## 🚀 Khởi động dự án

### Yêu cầu

- Node.js >= 14
- Docker & Docker Compose
- MongoDB & RabbitMQ (nếu chạy local)

### 1. Chạy bằng Docker (Khuyến nghị)

```bash
git clone <repository-url>
cd EProject
docker-compose up --build
# hoặc chạy nền
docker-compose up -d --build
```

Các service sẽ chạy tại:
- API Gateway: http://localhost:3003
- Auth: http://localhost:3000
- Product: http://localhost:3001
- Order: http://localhost:3002
- RabbitMQ: http://localhost:15672 (guest/guest)

### 2. Chạy local (phát triển)

```bash
npm install
cd auth && npm install
cd ../product && npm install
cd ../order && npm install
cd ../api-gateway && npm install
```
Tạo file `.env` cho từng service (tham khảo mẫu trong mã nguồn).

Khởi động từng service ở các terminal riêng:
```bash
cd auth && npm start
cd product && npm start
cd order && npm start
cd api-gateway && npm start
```

## 🌐 API Endpoints

### Auth Service

- `POST   /auth/register` – Đăng ký tài khoản
- `POST   /auth/login` – Đăng nhập, nhận JWT
- `GET    /auth/profile` – Lấy thông tin user (yêu cầu Bearer token)

### Product Service

- `POST   /products` – Tạo sản phẩm mới (yêu cầu Bearer token)
- `GET    /products` – Lấy danh sách sản phẩm (yêu cầu Bearer token)
- `POST   /products/buy` – Tạo đơn hàng (yêu cầu Bearer token)
- `GET    /products/order/:orderId` – Kiểm tra trạng thái đơn hàng

## 🔄 Quy trình tạo đơn hàng

1. User đăng nhập, nhận JWT.
2. Gọi `/products/buy` với danh sách sản phẩm.
3. Product Service gửi message vào queue `orders`.
4. Order Service nhận message, xử lý đơn hàng, gửi kết quả vào queue `products`.
5. Product Service nhận kết quả, trả về client.

## 🔐 Authentication Flow

- Đăng ký: Lưu user với password đã hash (bcryptjs).
- Đăng nhập: Trả về JWT.
- Gửi token qua header `Authorization: Bearer <token>`.
- Middleware xác thực token ở các route bảo vệ.

## 🐳 Các service Docker

- rabbitmq (Message Broker)
- mongodb (Database)
- api-gateway (Reverse Proxy)
- auth (Authentication Service)
- product (Product Management)
- order (Order Processing)

## 🛠️ Công nghệ sử dụng

- Node.js, Express, MongoDB, Mongoose
- RabbitMQ, JWT, bcryptjs
- Docker, Docker Compose
- Mocha, Chai (Testing)
- dotenv

## � Monitoring & Debug

- RabbitMQ UI: http://localhost:15672 (guest/guest)
- MongoDB: mongodb://localhost:27017 (auth_service, product_service, order_service)
- Xem logs: `docker-compose logs -f [service]`

---

**Tác giả:** Nguyễn Hoàng Khánh Duy – MSSV: 22653721  
---