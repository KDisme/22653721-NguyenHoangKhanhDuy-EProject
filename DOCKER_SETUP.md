# Hướng dẫn Docker Setup

## Các file đã được tạo

### 1. Dockerfiles
Đã tạo Dockerfile cho từng service:
- `api-gateway/Dockerfile`
- `auth/Dockerfile`
- `product/Dockerfile`
- `order/Dockerfile`

Mỗi Dockerfile:
- Sử dụng Node.js 18 Alpine image (nhẹ)
- Cài đặt dependencies
- Copy source code
- Expose port tương ứng
- Chạy service với `npm start`

### 2. .dockerignore
Đã tạo `.dockerignore` cho từng service để loại trừ:
- node_modules
- .env files
- Git files
- IDE files
- Log files

### 3. docker-compose.yml
File chính để orchestrate tất cả services:
- **mongodb-auth**: Database cho auth service (port 27017)
- **mongodb-product**: Database cho product service (port 27018)
- **mongodb-order**: Database cho order service (port 27019)
- **rabbitmq**: Message broker (port 5672, management UI: 15672)
- **auth**: Auth service (port 3000)
- **product**: Product service (port 3001)
- **order**: Order service (port 3002)
- **api-gateway**: API Gateway (port 3003)

### 4. .env.example
File mẫu chứa các biến môi trường cần thiết:
- MongoDB URIs cho từng service
- RabbitMQ connection string
- JWT secret key
- Service ports

## Cách sử dụng

### Bước 1: Tạo file .env
```bash
cp .env.example .env
```

### Bước 2: Chỉnh sửa .env (nếu cần)
Mở file `.env` và thay đổi các giá trị:
- `JWT_SECRET`: Thay đổi thành secret key của bạn
- Các URI database (nếu cần custom)
- RabbitMQ credentials (nếu cần)

### Bước 3: Chạy services
```bash
# Build và chạy tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Xem logs của 1 service cụ thể
docker-compose logs -f auth

# Kiểm tra trạng thái
docker-compose ps
```

### Bước 4: Dừng services
```bash
# Dừng tất cả services
docker-compose down

# Dừng và xóa volumes (database data)
docker-compose down -v
```

## Kiểm tra services

### API Gateway
```bash
curl http://localhost:3003/auth/login
```

### Auth Service
```bash
curl http://localhost:3000/login
```

### Product Service
```bash
curl http://localhost:3001/api/products
```

### Order Service
```bash
curl http://localhost:3002/orders
```

### RabbitMQ Management UI
Truy cập: http://localhost:15672
- Username: admin
- Password: admin

## Troubleshooting

### Services không start được
```bash
# Xem logs để biết lỗi
docker-compose logs

# Rebuild images
docker-compose build --no-cache
docker-compose up -d
```

### Port đã bị sử dụng
Thay đổi port trong file `docker-compose.yml`:
```yaml
ports:
  - "3000:3000"  # Thay 3000 đầu tiên thành port khác
```

### Database connection lỗi
Đảm bảo MongoDB containers đã chạy:
```bash
docker-compose ps
```

Kiểm tra logs của service:
```bash
docker-compose logs mongodb-auth
docker-compose logs auth
```

## Lưu ý

1. **Không commit file .env**: File `.env` đã được thêm vào `.gitignore`
2. **Cấu trúc .env không thay đổi**: Chỉ thêm các field cần thiết cho Docker
3. **Production**: Đối với production, nên:
   - Thay đổi JWT_SECRET thành giá trị phức tạp
   - Sử dụng managed database service
   - Cấu hình proper networking và security
   - Sử dụng secrets management (Docker secrets, Kubernetes secrets, etc.)

## Development workflow

### Phát triển 1 service
```bash
# Chỉ chạy dependencies (databases, rabbitmq)
docker-compose up -d mongodb-auth mongodb-product mongodb-order rabbitmq

# Chạy service locally với nodemon
cd auth
npm install
npm run dev  # Nếu có dev script với nodemon
```

### Rebuild 1 service sau khi thay đổi code
```bash
# Rebuild và restart 1 service
docker-compose build auth
docker-compose up -d auth
```

### Xem logs real-time
```bash
# Tất cả services
docker-compose logs -f

# Chỉ auth service
docker-compose logs -f auth
```
