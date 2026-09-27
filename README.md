# 🛒 product-api

RESTful API CRUD cho **Product** (pid, pname, price, quantity) sử dụng Node.js + Express + MongoDB, chạy hoàn toàn trên Docker.

**Tác giả:** Nguyễn Hoàng Khánh Duy – MSSV: 22653721

---

## 📋 Yêu cầu

| Công cụ | Link tải |
|---|---|
| Git | https://git-scm.com |
| Docker Desktop | https://www.docker.com/products/docker-desktop |
| VS Code | https://code.visualstudio.com |

---

## 🚀 Chạy dự án bằng Docker Compose

### Bước 1 – Clone repository

```bash
git clone https://github.com/KDisme/22653721-NguyenHoangKhanhDuy-EProject.git
cd 22653721-NguyenHoangKhanhDuy-EProject
```

### Bước 2 – Kiểm tra file `.env`

File `.env` đã có sẵn trong repo với nội dung:

```env
MONGODB_URI=mongodb://nammongodb:27017/product_db
PORT=3001
```

> ⚠️ File `.env` **không được commit** lên GitHub (đã có trong `.gitignore`). Tham khảo `.env.example` nếu cần tạo lại.

### Bước 3 – Build và chạy

```bash
docker compose up --build
```

Chờ đến khi thấy log:
```
MongoDB connected: mongodb://nammongodb:27017/product_db
Server started on port 3001
```

---

## 🔍 Kiểm tra containers (CLI)

```bash
# Xem danh sách container đang chạy
docker ps

# Xem trạng thái + healthcheck
docker compose ps

# Xem health của từng container
docker inspect --format="{{.Name}} → {{.State.Health.Status}}" nammongodb product-api

# Xem log của product-api
docker logs product-api

# Xem log realtime (follow)
docker logs -f product-api

# Xem log của mongodb
docker logs nammongodb
```

---

## 💾 Kiểm tra dữ liệu trong MongoDB (CLI)

```bash
# Truy cập vào mongosh bên trong container
docker exec -it nammongodb mongosh

# Trong mongosh:
use product_db
db.products.find().pretty()
db.products.countDocuments()
exit
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

### Test bằng Postman

**POST – Tạo sản phẩm mới**
- Method: `POST`
- URL: `http://localhost:3001/api/products`
- Body → raw → JSON:
```json
{
  "pname": "Laptop Dell",
  "price": 15000000,
  "quantity": 10
}
```

**Response mẫu:**
```json
{
  "_id": "64abc123...",
  "pid": "SP001",
  "pname": "Laptop Dell",
  "price": 15000000,
  "quantity": 10
}
```

> `pid` được tự động sinh (SP001, SP002, ...), không cần truyền vào.

---

## ✅ Check Healthcheck

```bash
# Kiểm tra nhanh qua curl
curl http://localhost:3001/health

# Response khi OK:
# {"status":"ok","db":"connected"}

# Kiểm tra healthcheck status của container
docker inspect --format="{{.State.Health.Status}}" product-api
docker inspect --format="{{.State.Health.Status}}" nammongodb
```

---

## 🧪 Chạy CI/CD Test

```bash
# Chạy test CRUD bên trong container product-api
docker exec -e PRODUCT_SERVICE_URL=http://localhost:3001 product-api npm test
```

---

## ⚙️ CI/CD Pipeline (GitHub Actions)

| File | Mô tả |
|---|---|
| `test-productci.yml` | CI đơn giản: build Docker, health check, chạy CRUD test |
| `test-productci-prod.yml` | CI production: test trực tiếp trên GitHub VM với MongoDB service |
| `cd-dockerhub.yml` | CD: CI pass → build & push image lên Docker Hub |
| `cd-deploy-local.yml` | CD: tự động SSH pull image mới về local sau khi push |

### Sơ đồ pipeline

```
git push to main
      │
      ▼
  CI: build + healthcheck + test
      │ pass
      ▼
  CD: push image → Docker Hub
      │ success
      ▼
  CD: SSH → pull image mới → restart local
```

### GitHub Secrets cần thiết cho CD

| Secret | Mô tả |
|---|---|
| `DOCKERHUB_USERNAME` | Username Docker Hub |
| `DOCKERHUB_TOKEN` | Access Token (hub.docker.com → Account Settings → Security) |
| `DEPLOY_HOST` | IP máy deploy |
| `DEPLOY_USER` | Username SSH |
| `DEPLOY_SSH_KEY` | Nội dung file `~/.ssh/id_rsa` |
| `DEPLOY_PORT` | Port SSH (thường `22`) |
| `DEPLOY_PATH` | Đường dẫn project trên máy deploy |

---

## 🛑 Dừng và dọn dẹp

```bash
# Dừng containers
docker compose down

# Dừng và xoá toàn bộ volume (xoá dữ liệu MongoDB)
docker compose down -v
```

---

## 🏗️ Cấu trúc thư mục

```
product-api/
├── .github/workflows/          # CI/CD GitHub Actions
├── product/
│   ├── Dockerfile              # Dockerize ứng dụng
│   ├── src/
│   │   ├── app.js              # Express app
│   │   ├── config.js           # Đọc biến môi trường .env
│   │   ├── models/product.js   # Mongoose schema
│   │   ├── routes/             # CRUD routes
│   │   ├── controllers/        # Xử lý request
│   │   ├── services/           # Business logic
│   │   └── test/               # Mocha/Chai CRUD tests
├── .env                        # Biến môi trường (không commit)
├── .env.example                # Mẫu .env
├── docker-compose.yml          # Dev: build từ source
└── docker-compose-prod.yaml    # Prod: pull image từ Docker Hub
```
