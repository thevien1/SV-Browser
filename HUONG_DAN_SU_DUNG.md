# HƯỚNG DẪN SỬ DỤNG PHẦN MỀM SV BROWSER (V5.0.8)

Chào bạn, đây là phần mềm quản lý Profile trình duyệt và Automation chuyên nghiệp SV Browser dành cho Windows, hỗ trợ chạy trên **Google Chrome, Chromium, Brave Browser, Microsoft Edge, Mozilla Firefox** với hệ thống khóa bản quyền License Key linh hoạt.

---

## 1. Cách Khởi Động Phần Mềm
- Bạn chỉ cần nhấp đúp chuột vào file:
  👉 **`Chay_Phan_Mem.bat`**
- Hoặc mở Command Prompt / PowerShell tại thư mục dự án và gõ:
  ```bash
  npm start
  ```
- Giao diện ứng dụng sẽ hiện lên ngay trên màn hình máy tính với thiết kế chuẩn giống hệt như trong hình ảnh bạn gửi (đã loại bỏ phần quảng cáo/cloud theo yêu cầu).

---

## 2. Hệ Thống Tạo License Key Bản Quyền (Dành Riêng Cho Bạn)

Phần mềm đã được tích hợp hệ thống bản quyền dựa trên mã phần cứng máy tính (**HWID**) chống chia sẻ trái phép.

Bạn có 2 cách để tạo Key cho khách hàng:

### Cách 1: Tạo trực tiếp ngay trên giao diện phần mềm
1. Trên thanh menu bên trái, nhấn vào mục màu cam: **`🔑 Admin Tạo Key`**.
2. Chọn thời hạn bản quyền:
   - **Dùng thử 7 ngày (7 Days)**
   - **30 Ngày (1 Month)**
   - **Vô hạn / Vĩnh viễn (Lifetime)**
   - **Tùy chỉnh số ngày**
3. Chọn số lượng máy tính cho phép kích hoạt:
   - **1 Máy**
   - **5 Máy**
   - **10 Máy / Tùy chọn**
4. Nhập tên khách hàng và dán HWID của khách (nếu muốn khóa cứng vào máy của họ). Nếu bỏ trống HWID, key sẽ tự động khóa vào máy tính của khách khi họ nhập lần đầu tiên.
5. Nhấn **`TẠO LICENSE KEY NGAY`** -> Bấm nút **Copy** để gửi cho khách.

### Cách 2: Tạo qua cửa sổ dòng lệnh riêng
- Nhấp đúp chuột vào file:
  👉 **`Tao_Key_Admin.bat`**
- Làm theo các hướng dẫn trên màn hình để sinh key và lưu lại lịch sử.

---

## 3. Cách Khách Hàng Nhập Key Kích Hoạt
1. Khách hàng mở phần mềm, ở góc dưới bên trái menu nhấn vào mục **`Bản quyền`** (hoặc popup thông báo).
2. Màn hình sẽ hiện mã **HWID** của máy khách. Khách có thể copy HWID này gửi cho bạn để bạn tạo key.
3. Khi bạn gửi lại mã Key, khách dán vào ô **"Nhập License Key kích hoạt"** và nhấn **`Kích Hoạt Ngay`**.
4. Ứng dụng sẽ tự động mở khóa, hiển thị thời hạn còn lại và số máy đã kích hoạt.

---

## 4. Quản Lý Profile & Đa Trình Duyệt

### Hỗ trợ các trình duyệt:
- **Google Chrome** (Tự động nhận diện Chrome trên Windows)
- **Chromium** (Hỗ trợ cả bản Chromium portable trong thư mục `chrome/Chrome-bin`)
- **Brave Browser**
- **Microsoft Edge**
- **Mozilla Firefox**

### Các tính năng chính:
- **`+ Thêm mới`**: Tạo 1 profile đơn lẻ, tùy chọn trình duyệt, gán Proxy (HTTP/SOCKS5), User-Agent, Tags.
- **`+ Tạo hàng loạt`**: Tạo nhanh 5, 10, 50, 100 profile cùng lúc kèm danh sách proxy tự động xoay vòng.
- **`▶ Mở`**: Khởi chạy trình duyệt thật với dữ liệu riêng biệt (`user-data-dir`), không dính cookie hay cache giữa các profile.
  - Khi trình duyệt đang chạy, trạng thái sẽ hiện chấm xanh phát sáng **`● Đang mở`**, nút chuyển sang màu đỏ **`■ Đóng`**.
- **`■ Đóng`**: Tắt trình duyệt trực tiếp từ giao diện. Khi người dùng tắt trình duyệt thủ công, nút cũng tự động chuyển về màu xanh **`▶ Mở`**.
- **Tìm kiếm & Bộ lọc**: Tìm kiếm tức thì theo tên profile, lọc theo nhóm, sắp xếp theo ngày tạo.
- **Thao tác hàng loạt**: Chọn nhiều profile cùng lúc bằng checkbox để Mở hàng loạt, Đóng hàng loạt, hoặc Xóa hàng loạt.

---

## 5. Xuất Thành File Cài Đặt (.exe) Cho Windows

Để đóng gói phần mềm thành 1 file cài đặt `Setup.exe` hoặc `Portable.exe` đem sang các máy tính khác cài đặt, bạn chỉ cần chạy:
```bash
npm run build
```
File cài đặt hoàn chỉnh sẽ nằm trong thư mục `dist/`.
