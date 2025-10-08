
# EProject-Phase-1

## Mô tả dự án
EProject-Phase-1 là hệ thống quản lý bán hàng theo kiến trúc microservices, gồm các thành phần:

### 1. api-gateway
- Đóng vai trò là cổng vào hệ thống, nhận request từ client và chuyển tiếp đến các service tương ứng.
- Xử lý xác thực JWT, kiểm tra quyền truy cập.
- Quản lý routing, load balancing giữa các service.

### 2. auth
- Quản lý người dùng, đăng ký, đăng nhập, xác thực và phân quyền.
- Sử dụng JWT để xác thực người dùng.
- Lưu trữ thông tin người dùng trong database (ví dụ: MongoDB).
- Cung cấp các API: `/register`, `/login`, `/profile`, ...

### 3. order
- Quản lý đơn hàng, tạo mới, cập nhật trạng thái, truy xuất lịch sử đơn hàng.
- Kiểm tra xác thực người dùng trước khi thao tác đơn hàng.
- Tích hợp message broker để giao tiếp với các service khác (ví dụ: gửi thông báo khi có đơn hàng mới).

### 4. product
- Quản lý sản phẩm: thêm, sửa, xóa, tìm kiếm sản phẩm.
- Kiểm tra xác thực người dùng cho các thao tác quản trị.
- Cung cấp API cho client truy vấn danh sách sản phẩm, chi tiết sản phẩm.

### 5. utils
- Chứa các hàm tiện ích dùng chung như xác thực, xử lý message broker, ...

## Luồng hoạt động
1. Người dùng gửi request đến `api-gateway`.
2. Gateway xác thực JWT, chuyển tiếp request đến service phù hợp (`auth`, `order`, `product`).
3. Các service xử lý logic nghiệp vụ, truy cập database, trả về kết quả cho gateway.
4. Gateway trả kết quả về cho client.

## Công nghệ sử dụng
- Node.js, Express.js cho các service.
- JWT cho xác thực.
- MongoDB (hoặc các DB khác) cho lưu trữ dữ liệu.
- Message Broker (có thể dùng RabbitMQ, Redis, hoặc custom) cho giao tiếp giữa các service.
- Mocha/Chai/Jest cho test.

## Cấu trúc thư mục
- `api-gateway/`: Gateway, routing, xác thực.
- `auth/`: Xác thực, quản lý người dùng.
- `order/`: Quản lý đơn hàng.
- `product/`: Quản lý sản phẩm.
- `utils/`: Hàm tiện ích dùng chung.

## Hướng dẫn phát triển & khởi chạy
1. Cài đặt Node.js và npm.
2. Vào từng thư mục service, chạy `npm install` để cài dependencies.
3. Thiết lập file `.env` cho từng service (nếu cần).
4. Chạy từng service bằng lệnh `node index.js` hoặc `npm start`.
5. Đảm bảo các service chạy trên các port khác nhau (cấu hình trong file `config.js` hoặc `.env`).
6. Có thể dùng Docker để đóng gói và chạy các service.

## Hướng dẫn test
1. Vào thư mục chứa test, chạy `npm test` để kiểm tra các chức năng.
2. Test các API bằng Postman hoặc các công cụ tương tự.

## Tác giả
- [Nguyễn Hoàng Khánh Duy]

## License
MIT
