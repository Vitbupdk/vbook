# 📚 VBook Extensions Collection

[![GitHub stars](https://img.shields.io/github/stars/Vitbupdk/vbook?style=for-the-badge)](https://github.com/Vitbupdk/vbook/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Vitbupdk/vbook?style=for-the-badge)](https://github.com/Vitbupdk/vbook/network)
[![GitHub issues](https://img.shields.io/github/issues/Vitbupdk/vbook?style=for-the-badge)](https://github.com/Vitbupdk/vbook/issues)
[![License](https://img.shields.io/github/license/Vitbupdk/vbook?style=for-the-badge)](LICENSE)

> 🎯 **Bộ sưu tập extension cho ứng dụng VBook** - Hỗ trợ đọc truyện từ nhiều nguồn khác nhau với hơn **13+ extensions** được tối ưu hóa.

![VBook Extensions](https://img.shields.io/badge/Extensions-13+-brightgreen?style=for-the-badge)
![Language](https://img.shields.io/badge/Language-JavaScript-yellow?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-VBook-blue?style=for-the-badge)

---

## 📋 Mục lục

- [🚀 Tính năng](#-tính-năng)
- [📦 Extensions có sẵn](#-extensions-có-sẵn)
- [🛠 Cài đặt](#-cài-đặt)
- [📖 Hướng dẫn phát triển](#-hướng-dẫn-phát-triển)
- [🧪 Kiểm tra Extension](#-kiểm-tra-extension)
- [🤝 Đóng góp](#-đóng-góp)
- [📄 Giấy phép](#-giấy-phép)

---

## 🚀 Tính năng

✅ **Đa nguồn**: Hỗ trợ 13+ trang web đọc truyện phổ biến  
✅ **Tự động cập nhật**: Đồng bộ nội dung mới nhất từ các nguồn  
✅ **Tối ưu hóa**: Code được optimize cho hiệu suất cao  
✅ **Dễ mở rộng**: API đơn giản để tạo extension mới  
✅ **Hỗ trợ đa dạng**: Comic, Novel, Light Novel  
✅ **Tìm kiếm thông minh**: Tích hợp tìm kiếm nâng cao  

---

## 📦 Extensions có sẵn

| Extension | Loại | Nguồn | Trạng thái |
|-----------|------|-------|-----------|
| 🏆 **5in1** | Novel | Tổng hợp 5 nguồn | ✅ Active |
| 📖 **Misskon** | Novel | misskon.com | ✅ Active |
| 🌟 **Baozimh** | Comic | baozimh.com | ✅ Active |
| 📱 **CManga** | Comic | cmanga.net | ✅ Active |
| 🔞 **Cosplay Tele** | Comic | cosplaytele.com | ✅ Active |
| 💕 **Manhwa Hentai** | Comic | manhwahentai.me | ✅ Active |
| 🎌 **NHentai** | Comic | nhentai.net | ✅ Active |
| ✍️ **Sang Tac Viet** | Novel | sangtacviet.com | ✅ Active |
| 🎵 **Vozer** | Novel | vozer.net | ✅ Active |

> 📊 **Thống kê**: 13+ extensions đang hoạt động với hàng nghìn truyện được hỗ trợ

---

## 🛠 Cài đặt

### 📋 Yêu cầu hệ thống

- ☕ **Java**: Phiên bản 1.8 trở lên
- 📱 **VBook App**: Phiên bản mới nhất
- 🌐 **Mạng**: PC và điện thoại cùng mạng LAN

### 🔧 Cài đặt Extensions

1. **Tải về repository**
   ```bash
   git clone https://github.com/Vitbupdk/vbook.git
   cd vbook
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Import vào VBook App**
   - Mở VBook App
   - Vào **Settings** → **Extensions** 
   - Chọn **Import** và duyệt file `plugin.json`

---

## 📖 Hướng dẫn phát triển

### 🏗 Cấu trúc Extension

Mỗi extension cần có cấu trúc thư mục như sau:

```
my-extension/
├── 📄 plugin.json      # Cấu hình extension
├── 🖼 icon.png         # Icon extension (128x128px)
└── 📁 src/            # Thư mục chứa scripts
    ├── detail.js       # Script lấy thông tin truyện
    ├── toc.js         # Script lấy mục lục
    ├── chap.js        # Script lấy nội dung chương
    ├── search.js      # Script tìm kiếm (tùy chọn)
    └── home.js        # Script trang chủ (tùy chọn)
```

### ⚙️ Cấu hình Plugin (plugin.json)

```json
{
  "metadata": {
    "name": "Tên Extension",
    "author": "Tên tác giả", 
    "version": 1,
    "source": "https://example.com",
    "regexp": "Regex pattern để khớp URL",
    "description": "Mô tả extension",
    "locale": "vi_VN",
    "type": "comic|novel|chinese_novel",
    "tag": "nsfw" // Nếu là nội dung 18+
  },
  "script": {
    "detail": "detail.js",    // Bắt buộc
    "toc": "toc.js",         // Bắt buộc  
    "chap": "chap.js",       // Bắt buộc
    "search": "search.js",   // Tùy chọn
    "home": "home.js",       // Tùy chọn
    "genre": "genre.js"      // Tùy chọn
  }
}
```

### 📝 Scripts API

#### 🏠 Home Script (home.js)
```javascript
function execute() {
  return Response.success([
    { 
      title: "Truyện mới cập nhật", 
      input: "https://example.com/latest", 
      script: "homecontent.js" 
    }
  ]);
}
```

#### 🔍 Detail Script (detail.js)
```javascript
function execute(url) {
  return Response.success({
    name: "Tên truyện",
    cover: "URL ảnh bìa", 
    author: "Tác giả",
    description: "Mô tả truyện",
    ongoing: true, // true/false
    detail: "Thông tin chi tiết"
  });
}
```

#### 📚 Table of Contents (toc.js)
```javascript
function execute(url) {
  return Response.success([
    {
      name: "Chương 1: Bắt đầu",
      url: "https://example.com/chap/1", 
      host: "example.com" // Tùy chọn
    }
  ]);
}
```

#### 📖 Chapter Content (chap.js)
```javascript
function execute(url) {
  // Lấy nội dung chương
  const response = fetch(url);
  const doc = response.html();
  const content = doc.select(".content").html();
  
  return Response.success(content);
}
```

### 🛠 Utility Functions

#### 🌐 HTTP Requests
```javascript
// GET request
const response = fetch(url);

// POST request với options
const response = fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: { key: "value" }
});

// Xử lý response
const doc = response.html();        // HTML Document
const text = response.text();       // Plain text
const json = response.json();       // JSON object
const status = response.status;     // HTTP status code
```

#### 🧹 HTML Processing
```javascript
// Parse HTML từ string
const doc = Html.parse(htmlString);

// Clean HTML giữ lại một số thẻ
const cleaned = Html.clean(htmlString, ["p", "br", "strong"]);

// CSS Selector (sử dụng JSoup syntax)
const elements = doc.select("div.content p");
```

#### 🤖 Browser Automation
```javascript
const browser = Engine.newBrowser();
browser.setUserAgent(UserAgent.android());

// Launch trang web
const doc = browser.launch(url, 30000); // timeout 30s

// Chạy JavaScript
const result = browser.callJs("document.title", 1000);

// Đóng browser
browser.close();
```

#### 🔧 Utilities
```javascript
Console.log("Debug message");    // Log debug
load("helper.js");              // Load file JS khác  
sleep(5000);                    // Delay 5 giây
```

---

## 🧪 Kiểm tra Extension

### 🖥 Test với PC (Java Tool)

1. **Kết nối mạng LAN**
   - Đảm bảo PC và điện thoại cùng mạng WiFi

2. **Kích hoạt Developer Mode**
   - Chạm 7 lần vào phiên bản trong VBook App
   - Bật "Chế độ nhà phát triển"
   - Ghi nhớ IP address hiển thị

3. **Chạy Extension Maker**
   ```bash
   java -jar ExtensionMaker.jar
   ```
   
4. **Nhập IP và test**
   - Nhập IP của điện thoại
   - Load extension và test từng function

### 💻 Test với VSCode

1. **Cài đặt Extension**
   - Tải [VBook Extension Maker](https://github.com/faea726/vbook-extension-maker/releases/latest)
   - Cài vào VSCode

2. **Test script**
   - Mở file `.js` bất kỳ
   - Chuột phải → Chọn function test
   - Nhập thông tin khi được yêu cầu

---

## 🤝 Đóng góp

Chúng tôi rất hoan nghênh mọi đóng góp! 

### 🎯 Cách đóng góp

1. **Fork** repository này
2. **Tạo branch** cho tính năng mới: `git checkout -b feature/ten-tinh-nang`
3. **Commit** thay đổi: `git commit -m 'Thêm tính năng xyz'`
4. **Push** lên branch: `git push origin feature/ten-tinh-nang`
5. **Tạo Pull Request**

### 📋 Quy tắc đóng góp

- ✅ Code phải clean và có comment
- ✅ Test kỹ extension trước khi PR
- ✅ Tuân thủ coding style hiện tại
- ✅ Cập nhật README nếu cần

### 🐛 Báo lỗi

Phát hiện bug? [Tạo issue](https://github.com/Vitbupdk/vbook/issues/new) với thông tin:

- 📱 Phiên bản VBook App
- 🔧 Extension gặp lỗi
- 📝 Mô tả chi tiết lỗi
- 🔄 Các bước tái tạo lỗi

---

## 📄 Giấy phép

Project này được phân phối dưới giấy phép **MIT License**. Xem [LICENSE](LICENSE) để biết thêm chi tiết.

---

## 🙏 Lời cảm ơn

- 💝 **VBook Team** - Phát triển ứng dụng tuyệt vời
- 🌟 **Contributors** - Những người đóng góp extensions
- 🤝 **Community** - Cộng đồng người dùng nhiệt tình

---

## 📞 Liên hệ

- 👨‍💻 **Author**: [Vitbupdk](https://github.com/Vitbupdk)
- 📧 **Email**: Liên hệ qua GitHub Issues
- 🔗 **Website**: [VBook Extensions](https://github.com/Vitbupdk/vbook)

---

<div align="center">

**⭐ Nếu project hữu ích, hãy cho một Star nhé! ⭐**

Made with ❤️ by [Vitbupdk](https://github.com/Vitbupdk)

</div>