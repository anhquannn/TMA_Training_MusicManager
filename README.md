# Music Manager

Dự án Music Manager là một ứng dụng web quản lý nhạc, được xây dựng với backend Spring Boot + MongoDB và frontend ReactJS.

## Phần 1 – Hướng dẫn chạy chương trình

1. Chạy lệnh `docker-compose up --build` để khởi động hệ thống backend (Spring Boot + MongoDB).
2. Chạy lệnh `npm start` hoặc `yarn dev` trong thư mục web để khởi động frontend (ReactJS).
3. Truy cập các địa chỉ:
   - Swagger API: http://localhost:2010/music/api/v1/swagger-ui/index.html
   - Web client: http://localhost:3000

## Phần 2 – Kết quả kiểm thử

### Bảng kiểm thử chức năng

| Tính năng              | Mô tả                                      | Kết quả (Đạt/Chưa đạt) | Ghi chú |
|------------------------|--------------------------------------------|-------------------------|---------|
| Đăng ký               | Người dùng đăng ký tài khoản mới           | Đạt                    |         |
| Đăng nhập             | Xác thực người dùng và sinh JWT            | Đạt                    |         |
| Quên mật khẩu         | Gửi OTP tới email và đổi mật khẩu          | Đạt                    |         |
| Cập nhật thông tin cá nhân | Sửa thông tin user sau đăng nhập       | Đạt                    |         |
| Upload bài hát        | Upload file nhạc và metadata               | Đạt                    |         |
| Chỉnh sửa bài hát     | Cập nhật thông tin bài hát                 | Đạt                    |         |
| Xóa bài hát           | Xóa bài hát khỏi DB                        | Đạt                    |         |
| Tìm kiếm bài hát      | Tìm theo tên hoặc tác giả                  | Đạt                    |         |
| Phân trang bài hát    | Lấy danh sách có phân trang                | Đạt                    |         |
| Phát nhạc             | Stream file nhạc để nghe trực tiếp         | Đạt                    |         |

### Bảng thời gian thực hiện

| Nội dung             | Thời gian bắt đầu       | Thời gian kết thúc dự kiến | Thời gian kết thúc thực tế |
|----------------------|-------------------------|----------------------------|----------------------------|
| Phát triển backend  | 07/11, thứ 6, 16:00    | 07/11, thứ 6, 19:00       | 07/11, thứ 6, 19:30       |
| Phát triển frontend | 07/11, thứ 6, 20:00    | 07/11, thứ 6, 22:00       | 07/11, thứ 6, 23:30       |

## Phần 3 – Ứng dụng AI trong phát triển

Các hoạt động AI được áp dụng trong quá trình xây dựng dự án:

| Ứng dụng AI          | Mục đích                                                                 | Kết quả đạt được |
|----------------------|--------------------------------------------------------------------------|------------------|
| Phân tích hidden case | Phát hiện các trường hợp lỗi tiềm ẩn như validation, exception, unauthorized, timeout,… | Tốt             |
| Review code ReactJS | Kiểm tra cấu trúc component, hooks, performance và clean code             | Khá tốt         |