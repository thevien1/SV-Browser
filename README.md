# 🌐 SV Browser - Antidetect Multi-Browser Profile Manager

![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011%20(64--bit)-brightgreen?style=flat-square)
![Status](https://img.shields.io/badge/Status-Stable-success?style=flat-square)

**SV Browser** là giải pháp phần mềm quản lý hàng nghìn profile trình duyệt độc lập chống phát hiện danh tính số (**Antidetect Browser Fingerprint Spoofing**) hàng đầu. Được thiết kế tối ưu cho MMO, nuôi tài khoản mạng xã hội (Facebook, TikTok, Twitter/X, Google), sàn thương mại điện tử (Shopee, Lazada, Amazon, eBay), Marketing và Tự động hóa quy mô lớn.

---

## 📥 Tải Về Phần Mềm (Downloads)

Bạn có thể tải trực tiếp các phiên bản mới nhất bên dưới hoặc truy cập mục [**Releases**](https://github.com/thevien1/SV-Browser/releases):

| Phiên Bản | Định Dạng | Dung Lượng | Liên Kết Tải Về |
| :--- | :--- | :--- | :--- |
| **SV Browser Setup 1.0.0** | Trình cài đặt tự động (.exe) | ~123 MB | [👉 **Tải Bộ Cài Đặt (Setup)**](https://github.com/thevien1/SV-Browser/releases/download/v1.0.0/SV%20Browser%20Setup%201.0.0.exe) |
| **SV Browser Portable 1.0.0** | Bản giải nén chạy ngay (.exe) | ~123 MB | [👉 **Tải Bản Portable**](https://github.com/thevien1/SV-Browser/releases/download/v1.0.0/SV%20Browser%201.0.0%20Portable.exe) |

> 💡 **Lưu ý**: Khi trình duyệt cảnh báo tệp mới tải về, vui lòng chọn **"Giữ lại" (Keep anyway)** -> **"Vẫn tiếp tục tải"** để hoàn tất quá trình tải xuống.

---

## 🚀 Tính Năng Nổi Bật

### 1. Giả Lập Vân Tay Trình Duyệt Toàn Diện (Fingerprint Masking)
- **Canvas & WebGL Spoofing**: Cơ chế thêm nhiễu (noise) ngẫu nhiên thông minh, đánh lừa các hệ thống kiểm tra vân tay đồ họa tinh vi nhất.
- **AudioContext & Fonts**: Che giấu danh sách font chữ và thông số xử lý âm thanh phần cứng của máy thật.
- **WebRTC & Network IP**: Khóa rò rỉ WebRTC IP, đồng bộ vị trí địa lý (Geolocation) và múi giờ (Timezone) chính xác theo IP Proxy.
- **Đa dạng hệ điều hành & Trình duyệt**: Tùy biến User-Agent Windows, macOS, Linux, Chrome, Edge, Brave.

### 2. Quản Lý Proxy Chuyên Nghiệp
- Hỗ trợ toàn diện các giao thức: **HTTP, HTTPS, SOCKS5, SSH**.
- Nhập danh sách proxy hàng loạt theo định dạng: `IP:Port`, `IP:Port:User:Pass` hoặc `Host:Port:User:Pass`.
- Tự động kiểm tra tốc độ phản hồi (Ping), kiểm tra IP sống/chết (Live/Die) trước khi mở trình duyệt.

### 3. Cổng API Tự Động Hóa Cục Bộ (Local API Gateway)
- Tích hợp sẵn máy chủ REST API chuẩn tại cổng `http://localhost:8725`.
- Tương thích 100% với các công cụ lập trình tự động hóa phổ biến: **Python, C#, Node.js, Selenium, Puppeteer, Playwright**.
- Cung cấp sẵn các endpoint điều khiển:
  - `GET /api/v1/profiles`: Lấy danh sách profiles.
  - `GET /api/v1/profiles/start/{id}`: Khởi chạy profile trình duyệt kèm cổng điều khiển WebSocket.
  - `GET /api/v1/profiles/stop/{id}`: Đóng trình duyệt profile an toàn.

### 4. Tích Hợp Trực Tiếp Với SV Browser Automate Editor
- Kết nối liền mạch với công cụ [**SV Browser Automate Editor**](https://github.com/thevien1/Automate-Editor) để thiết kế và chạy kịch bản tự động hóa kéo - thả trực quan không cần viết mã.

### 5. Quản Lý Thư Mục Lưu Trữ Linh Hoạt (Local Storage)
- Cho phép người dùng tùy chọn ổ đĩa lưu trữ (`C:`, `D:`, `E:...`) theo nhu cầu, tránh đầy bộ nhớ hệ thống.

---

## 💻 Yêu Cầu Hệ Thống
- **Hệ điều hành**: Windows 10, Windows 11 (64-bit).
- **Bộ nhớ RAM**: Tối thiểu 4 GB (Khuyến nghị từ 8 GB trở lên để mở nhiều profile cùng lúc).
- **Dung lượng ổ cứng trống**: Tối thiểu 1 GB để lưu trữ dữ liệu cache và cookies.

---

## 📖 Hướng Dẫn Cài Đặt & Sử Dụng

1. Tải file `SV Browser Setup 1.0.0.exe` từ bảng tải về ở trên.
2. Nhấp đúp vào file tải về để tiến hành cài đặt.
3. Khi mở ứng dụng lần đầu:
   - Nhập mã **License Key** để kích hoạt bản quyền sử dụng.
   - Chọn thư mục lưu trữ profile trình duyệt (Local Storage) theo ý muốn.
4. Bắt đầu bấm nút **"+ Tạo profile"** để tạo và sử dụng trình duyệt antidetect an toàn!

---

## 📞 Hỗ Trợ & Bản Quyền
- Mọi thắc mắc hoặc yêu cầu cấp License Key, vui lòng liên hệ quản trị viên qua hệ thống hỗ trợ chính thức.
- Bản quyền thuộc về **SV Browser Team**.
