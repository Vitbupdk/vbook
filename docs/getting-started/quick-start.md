# ⚡ Quick Start Guide

<div align="center">

![Quick Start](https://img.shields.io/badge/⚡-Quick_Start-brightgreen?style=for-the-badge)
![Time](https://img.shields.io/badge/⏰-5_Minutes-blue?style=for-the-badge)
![Difficulty](https://img.shields.io/badge/🎯-Beginner-green?style=for-the-badge)

**Bắt đầu với VBook Extensions trong 5 phút!**

</div>

---

## 🎯 Mục tiêu

Sau khi hoàn thành hướng dẫn này, bạn sẽ:
- ✅ Hiểu VBook Extensions là gì
- ✅ Cài đặt được môi trường phát triển
- ✅ Chạy thử extension đầu tiên
- ✅ Sẵn sàng cho các bước tiếp theo

---

## 🤔 VBook Extensions là gì?

**VBook Extensions** là hệ thống plugin cho phép bạn:

📚 **Đọc truyện** từ nhiều nguồn khác nhau  
🔧 **Tự tạo** extension cho trang web yêu thích  
🌐 **Tích hợp** với ứng dụng VBook  
⚡ **Tự động hóa** việc crawl và parse content  

### 🏗 Kiến trúc đơn giản

```
🌐 Trang web ──► 🔧 Extension ──► 📱 VBook App ──► 👤 Người dùng
   (Raw HTML)    (Parse & Clean)   (Display)      (Read & Enjoy)
```

---

## 📋 Yêu cầu hệ thống

### 💻 **Máy tính**
- ☕ Java 1.8+ (để chạy Extension Maker)
- 💻 VSCode (khuyến nghị, có plugin hỗ trợ)
- 🌐 Kết nối mạng ổn định

### 📱 **Điện thoại**
- 📲 VBook App (phiên bản mới nhất)
- 📶 Cùng mạng WiFi với máy tính
- 🔧 Bật Developer Mode

---

## ⚡ Cài đặt nhanh (5 phút)

### Bước 1: Clone Repository
```bash
# Clone về máy
git clone https://github.com/Vitbupdk/vbook.git
cd vbook

# Cài dependencies
npm install
```

### Bước 2: Kích hoạt Developer Mode
1. **Mở VBook App** trên điện thoại
2. **Chạm 7 lần** vào phiên bản app (trong Settings)
3. **Bật "Developer Mode"** 
4. **Ghi lại IP address** hiển thị (ví dụ: `192.168.1.100`)

### Bước 3: Test Extension đầu tiên
```bash
# Chạy Extension Maker
java -jar ExtensionMaker.jar

# Hoặc dùng VSCode (khuyến nghị)
code .
```

### Bước 4: Kết nối với điện thoại
1. **Nhập IP** của điện thoại vào tool
2. **Chọn extension** để test (ví dụ: `5in1`)
3. **Test function** `detail` với URL bất kỳ

---

## 🎮 Thử nghiệm đầu tiên

### 📖 Test extension có sẵn

Hãy thử với extension **5in1** (tích hợp 5 nguồn):

```javascript
// URL test: https://sangtacviet.com/truyen/12345
// Function: detail
// Expected: Thông tin truyện được trả về
```

### 📱 Kết quả mong đợi
```json
{
  "name": "Tên truyện",
  "author": "Tác giả", 
  "cover": "URL ảnh bìa",
  "description": "Mô tả truyện...",
  "ongoing": true
}
```

---

## 🚀 Bước tiếp theo

### 🎯 Nếu test thành công:
1. 📖 Đọc [Installation Guide](installation.md) để setup chi tiết
2. 🚀 Làm theo [First Extension Tutorial](first-extension.md)
3. 📚 Tìm hiểu [Core API](../api-reference/core-api.md)

### ❌ Nếu gặp lỗi:
1. 🔍 Check [Troubleshooting Guide](../troubleshooting/common-issues.md)
2. 🐛 Xem [Debugging Tips](../troubleshooting/debugging.md)
3. ❓ Hỏi trên [GitHub Issues](https://github.com/Vitbupdk/vbook/issues)

---

## 📚 Tài nguyên học tập

### 📖 **Documentation**
- [📋 API Reference](../api-reference/) - API đầy đủ
- [📱 Tutorials](../tutorials/) - Hướng dẫn step-by-step
- [💡 Examples](../examples/) - Ví dụ thực tế

### 🛠 **Tools**
- [VSCode Extension](https://github.com/faea726/vbook-extension-maker/releases/latest)
- [Java Extension Maker](../ExtensionMaker.jar)
- [Online Regex Tester](https://regex101.com/)

### 🤝 **Community**
- [GitHub Discussions](https://github.com/Vitbupdk/vbook/discussions)
- [Issues & Bug Reports](https://github.com/Vitbupdk/vbook/issues)
- [Contributors Guide](../CONTRIBUTING.md)

---

## 🎓 Learning Path

### 👶 **Beginner** (Tuần 1)
```
📖 Quick Start ──► ⚡ Installation ──► 🚀 First Extension
```

### 👨‍💻 **Intermediate** (Tuần 2-3)  
```
📱 Comic Tutorial ──► 📚 Novel Tutorial ──► 🔍 Search Integration
```

### 🔥 **Advanced** (Tháng 2+)
```
🤖 Browser Engine ──► 🏗 Architecture ──► 🧪 Testing ──► 🚀 Deployment
```

---

## ✨ Pro Tips

### 🚀 **Tăng tốc development**
- 💻 Dùng VSCode với extension hỗ trợ
- 🔄 Setup auto-reload để test nhanh
- 📝 Đọc code của extensions có sẵn
- 🐛 Luôn test trên nhiều URL khác nhau

### 🎯 **Best Practices**
- 📋 Đặt tên extension rõ ràng
- 🧹 Clean code và có comment
- ⚡ Optimize performance
- 🔒 Handle errors gracefully

---

## ❓ FAQs nhanh

<details>
<summary><strong>🤔 Extension hoạt động như nào?</strong></summary>

Extension là code JavaScript chạy trong VBook App để:
1. Fetch HTML từ trang web
2. Parse và extract thông tin
3. Trả về data theo format chuẩn
4. VBook hiển thị cho người dùng
</details>

<details>
<summary><strong>📱 Tại sao cần Developer Mode?</strong></summary>

Developer Mode cho phép:
- VBook App mở debug server
- Máy tính kết nối để test extensions
- Real-time debugging và logs
- Hot reload khi code thay đổi
</details>

<details>
<summary><strong>🌐 Có thể làm extension cho trang nào?</strong></summary>

Bất kỳ trang web nào có:
- Cấu trúc HTML ổn định
- Không quá nhiều JavaScript dynamic
- Có thể truy cập từ mobile
- Không bị block crawling
</details>

---

<div align="center">

**🎉 Chúc mừng! Bạn đã hoàn thành Quick Start! 🚀**

**Tiếp theo:** [📖 Installation Guide](installation.md) **hoặc** [🚀 First Extension](first-extension.md)

---

*📝 Có thắc mắc? [Tạo issue](https://github.com/Vitbupdk/vbook/issues/new) để được hỗ trợ!*

</div>