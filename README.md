# SV-Browser

**SV Browser** là giải pháp quản lý Multi-Browser Profile Antidetect hiện đại, tối ưu cho tự động hóa (Automation), nuôi tài khoản và bảo vệ danh tính số trên nền tảng Chromium.

## 🚀 Tính Năng Nổi Bật
- **Quản lý đa Profile**: Tạo, nhân bản, sao lưu và khôi phục profiles dễ dàng. Hỗ trợ thùng rác (Trash) giúp an toàn khi thao tác.
- **Antidetect & Fingerprint Spoofing**: Tùy biến Canvas, WebGL, AudioContext, User-Agent, Client Hints, WebRTC, CPU/RAM Hardware Concurrency, Màn hình, Timezone, Geolocation.
- **Tích hợp Proxy Toàn Diện**: Hỗ trợ HTTP/HTTPS, Socks5, TMProxy, TinProxy, v.v. Kiểm tra tốc độ, trạng thái sống/chết và IP tức thời.
- **Tự động hóa & REST API**: Tương thích hoàn toàn với các công cụ tự động hóa qua chuẩn Puppeteer, Playwright, Selenium và REST API Gateway (Port 8725).
- **Hệ thống Extensions & Captcha Solver**: Hỗ trợ nạp Extension trực tiếp hoặc tự động tải từ Chrome Web Store, tích hợp sẵn tiện ích giải reCAPTCHA bằng AI.

## 📦 Cài Đặt & Phát Triển

### Yêu Cầu Hệ Thống
- Node.js >= 18
- Hệ điều hành Windows 10/11 (64-bit)

### Cài Đặt Thư Viện
```bash
npm install
```

### Chạy Bản Phát Triển (Dev)
```bash
npm start
```

### Đóng Gói Ứng Dụng Đã Mã Hóa Bảo Vệ (Protected Build)
```bash
npm run build
```
Lệnh trên sẽ tự động:
1. Mã hóa làm rối toàn bộ mã nguồn JavaScript (Strings Base64, Control Flow Flattening).
2. Loại bỏ các công cụ quản trị.
3. Tạo file cài đặt `SV Browser Setup 1.0.0.exe` và `SV Browser 1.0.0 Portable.exe` trong thư mục `dist/`.

---
© 2026 SV Browser Team. All rights reserved.
