# 🛒 product-api

RESTful API CRUD cho **Product** (pid, pname, price, quantity) được xây dựng bằng **Node.js + Express + MongoDB**, hỗ trợ Docker và CI/CD qua GitHub Actions + Docker Hub.

---

## 📋 Mục lục

- [Yêu cầu cài đặt](#-yêu-cầu-cài-đặt)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Cách 1 – Chạy bằng Docker Compose (Khuyến nghị)](#-cách-1--chạy-bằng-docker-compose-khuyến-nghị)
- [Cách 2 – Chạy Local (không dùng Docker)](#-cách-2--chạy-local-không-dùng-docker)
- [Cách 3 – Chạy Production từ Docker Hub](#-cách-3--chạy-production-từ-docker-hub)
- [API Endpoints](#-api-endpoints)
- [Chạy Tests](#-chạy-tests)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Setup Secrets cho GitHub Actions](#-setup-secrets-cho-github-actions)

---

## 🔧 Yêu cầu cài đặt

Cài các công cụ sau trước khi bắt đầu:

| Công cụ | Phiên bản tối thiểu | Link tải |
|---|---|---|
| Git | bất kỳ | https://git-scm.com |
| Node.js | >= 18 | https://nodejs.org |
| Docker Desktop | bất kỳ | https://www.docker.com/products/docker-desktop |
| VS Code | bất kỳ | https://code.visualstudio.com |

> **VS Code Extensions nên cài:** Docker, GitLens, REST Client

---

## 📁 Cấu trúc thư mục

```
product-api/
├── .github/
│   └── workflows/
│       ├── test-productci.yml        # CI đơn giản (Docker Compose)
│       ├── test-productci-prod.yml   # CI production (MongoDB service GitHub VM)
│       ├── cd-dockerhub.yml          # CD - build & push image lên Docker Hub
│       └── cd-deploy-local.yml       # CD - tự động deploy về local
│
├── product/
│   ├── Dockerfile                    # Dockerize product-api
│   ├── .dockerignore
│   ├── index.js                      # Entry point
│   ├── package.json
│   └── src/
│       ├── app.js                    # Express app (routes, middleware, DB)
│       ├── config.js                 # Cấu hình port, mongoURI từ .env
│       ├── controllers/              # Xử lý request/response
│       ├── models/product.js         # Mongoose schema (pid, pname, price, quantity)
│       ├── repositories/             # Tầng truy cập DB
│       ├── routes/productRoutes.js   # Định nghĩa CRUD routes
│       ├── services/                 # Business logic
│       ├── test/product.test.js      # Mocha/Chai CRUD tests
│       └── utils/
│
├── .env                              # Biến môi trường (không commit lên git)
├── .env.example                      # Mẫu .env
├── docker-compose.yml                # Dev: build từ source
├── docker-compose-prod.yaml          # Prod: pull image từ Docker Hub
└── README.md
```

---

## 🐳 Cách 1 – Chạy bằng Docker Compose (Khuyến nghị)

> Cách này **không cần cài Node.js hay MongoDB** trên máy. Docker lo hết.

### Bước 1 – Clone repository

```bash
git clone https://github.com/KDisme/22653721-NguyenHoangKhanhDuy-EProject.git
cd 22653721-NguyenHoangKhanhDuy-EProject
```

### Bước 2 – Tạo file `.env`

Sao chép từ file mẫu:

```bash
# Windows PowerShell
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Nội dung `.env` mặc định (giữ nguyên khi dùng Docker):

```env
MONGODB_URI=mongodb://nammongodb:27017/product_db
PORT=3001
```

### Bước 3 – Build và chạy

```bash
docker compose up --build
```

Hoặc chạy nền:

```bash
docker compose up -d --build
```

### Bước 4 – Kiểm tra

```bash
# Xem container đang chạy
docker compose ps

# Kiểm tra health
curl http://localhost:3001/health
```

**API chạy tại:** http://localhost:3001

### Dừng containers

```bash
docker compose down

# Xoá luôn volume (xoá dữ liệu MongoDB)
docker compose down -v
```

---

## 💻 Cách 2 – Chạy Local (không dùng Docker)

> Cần có **MongoDB đang chạy** trên máy (port 27017).

### Bước 1 – Clone và cài dependencies

```bash
git clone https://github.com/KDisme/22653721-NguyenHoangKhanhDuy-EProject.git
cd 22653721-NguyenHoangKhanhDuy-EProject/product
npm install
```

### Bước 2 – Tạo file `.env` trong thư mục gốc

```env
MONGODB_URI=mongodb://localhost:27017/product_db
PORT=3001
```

> ⚠️ Lưu ý: Khi chạy local thì dùng `localhost`, **không phải** `nammongodb`.

### Bước 3 – Chạy server

```bash
npm start
```

---

## 🚀 Cách 3 – Chạy Production từ Docker Hub

> Dùng image đã được build sẵn trên Docker Hub, **không cần source code**.

### Bước 1 – Tạo file `.env` với Docker Hub username

```env
DOCKERHUB_USERNAME=your_dockerhub_username
```

### Bước 2 – Pull và chạy

```bash
docker compose -f docker-compose-prod.yaml pull
docker compose -f docker-compose-prod.yaml up -d
```

---

## 🌐 API Endpoints

**Base URL:** `http://localhost:3001`

| Method | Endpoint | Mô tả | Body (JSON) |
|---|---|---|---|
| `GET` | `/health` | Kiểm tra server & DB | — |
| `GET` | `/api/products` | Lấy tất cả sản phẩm | — |
| `GET` | `/api/products/:id` | Lấy sản phẩm theo `_id` | — |
| `POST` | `/api/products` | Tạo sản phẩm mới | `{ pname, price, quantity }` |
| `PUT` | `/api/products/:id` | Cập nhật sản phẩm | `{ pname?, price?, quantity? }` |
| `DELETE` | `/api/products/:id` | Xoá sản phẩm | — |

### Ví dụ tạo sản phẩm

```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{"pname": "Laptop Dell", "price": 15000000, "quantity": 10}'
```

**Response:**
```json
{
  "_id": "64abc...",
  "pid": "SP001",
  "pname": "Laptop Dell",
  "price": 15000000,
  "quantity": 10
}
```

> **Lưu ý:** `pid` được tự động sinh (SP001, SP002, ...), không cần truyền vào.

---

## 🧪 Chạy Tests

### Chạy test trong container Docker

```bash
docker exec product-api npm test
```

### Chạy test local (cần API đang chạy tại port 3001)

```bash
cd product
PRODUCT_SERVICE_URL=http://localhost:3001 npm test
```

Test bao gồm toàn bộ CRUD:
- ✅ POST – Tạo sản phẩm
- ✅ GET all – Lấy danh sách
- ✅ GET by id – Lấy theo id
- ✅ PUT – Cập nhật
- ✅ DELETE – Xoá
- ✅ Validation (thiếu field → 400)
- ✅ Not found (id sai → 404)

---

## ⚙️ CI/CD Pipeline

```
push to main
     │
     ▼
┌─────────────────────────────┐
│  test-productci.yml         │  ← CI đơn giản (Docker Compose)
│  test-productci-prod.yml    │  ← CI prod (MongoDB service GitHub VM)
└─────────────────────────────┘
     │ (nếu pass)
     ▼
┌─────────────────────────────┐
│  cd-dockerhub.yml           │  ← Build & push image lên Docker Hub
└─────────────────────────────┘
     │ (sau khi push thành công)
     ▼
┌─────────────────────────────┐
│  cd-deploy-local.yml        │  ← SSH vào máy local, pull & restart
└─────────────────────────────┘
```

---

## 🔐 Setup Secrets cho GitHub Actions

Vào **GitHub repo → Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Mô tả | Lấy ở đâu |
|---|---|---|
| `DOCKERHUB_USERNAME` | Username Docker Hub | Đăng ký tại hub.docker.com |
| `DOCKERHUB_TOKEN` | Access Token Docker Hub | hub.docker.com → Account Settings → Security → New Access Token |
| `DEPLOY_HOST` | IP máy deploy (cho CD tự động) | IP public hoặc ngrok của máy |
| `DEPLOY_USER` | Username SSH của máy | Tên user máy tính |
| `DEPLOY_SSH_KEY` | Private key SSH | Chạy `ssh-keygen`, copy nội dung file `id_rsa` |
| `DEPLOY_PORT` | Port SSH | Thường là `22` |
| `DEPLOY_PATH` | Đường dẫn project trên máy | VD: `/home/user/product-api` |

> ⚠️ **Không commit** file `.env` lên git. File này đã có trong `.gitignore`.

---

## 🛠️ Công nghệ sử dụng

- **Runtime:** Node.js 18, Express 4
- **Database:** MongoDB 6.0, Mongoose 7
- **Testing:** Mocha, Chai, chai-http
- **Container:** Docker, Docker Compose
- **CI/CD:** GitHub Actions, Docker Hub
- **Config:** dotenv

---

**Tác giả:** Nguyễn Hoàng Khánh Duy – MSSV: 22653721
