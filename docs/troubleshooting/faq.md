# ❓ Frequently Asked Questions (FAQ)

<div align="center">

![FAQ](https://img.shields.io/badge/❓-FAQ-purple?style=for-the-badge)
![Updated](https://img.shields.io/badge/🔄-Regularly_Updated-green?style=for-the-badge)
![Community](https://img.shields.io/badge/🤝-Community_Answers-blue?style=for-the-badge)

**Câu hỏi thường gặp về VBook Extensions Development**

</div>

---

## 📋 Mục lục

- [🚀 Getting Started](#-getting-started)
- [🛠 Development](#-development)
- [🌐 Website Compatibility](#-website-compatibility)
- [📱 VBook App](#-vbook-app)
- [🔧 Technical Issues](#-technical-issues)
- [🎯 Extension Features](#-extension-features)
- [📊 Performance](#-performance)
- [🤝 Community & Support](#-community--support)

---

## 🚀 Getting Started

<details>
<summary><strong>🤔 VBook Extensions là gì và tại sao tôi cần nó?</strong></summary>

**VBook Extensions** là hệ thống plugin cho phép bạn đọc truyện từ bất kỳ website nào thông qua ứng dụng VBook.

**Lợi ích:**
- 📚 Đọc truyện từ nhiều nguồn trong 1 app
- 🔄 Tự động đồng bộ chapters mới
- 💾 Offline reading với download
- 🎨 Giao diện thống nhất, tối ưu mobile
- 🔍 Tìm kiếm cross-platform
- 📖 Bookmark và reading progress tracking

**Ví dụ:** Thay vì mở 10 tabs khác nhau để đọc truyện từ 10 website, bạn chỉ cần 1 VBook app với 10 extensions.
</details>

<details>
<summary><strong>⏰ Mất bao lâu để học VBook Extensions development?</strong></summary>

**Timeline dự kiến:**

📅 **Tuần 1-2**: Beginner
- Hiểu basic concepts
- Tạo được extension đầu tiên
- Test và debug cơ bản

📅 **Tuần 3-4**: Intermediate  
- Làm được comic/novel extensions
- Handle pagination và search
- Optimize performance

📅 **Tháng 2+**: Advanced
- Browser automation
- Complex websites
- Custom features

**Prerequisites:**
- ✅ Basic JavaScript knowledge
- ✅ HTML/CSS understanding  
- ✅ Familiarity with web dev tools
- ❌ **Không cần:** Advanced programming experience
</details>

<details>
<summary><strong>💻 Tôi cần setup gì để bắt đầu?</strong></summary>

**Minimum Requirements:**
```
💻 Computer:
- Java 8+ (bắt buộc)
- VSCode (khuyến nghi)
- 2GB RAM free
- Stable internet

📱 Mobile:
- VBook App (latest)
- Android 7.0+ (iOS coming soon)
- Same WiFi network as PC
```

**Setup Time:** ~15 phút với [Installation Guide](../getting-started/installation.md)

**Total Cost:** **FREE** - Tất cả tools đều miễn phí
</details>

<details>
<summary><strong>🎯 Tôi không biết lập trình, có thể học được không?</strong></summary>

**Có thể!** VBook Extensions được thiết kế để dễ học:

**Bắt đầu với:**
1. 📖 [Quick Start Guide](../getting-started/quick-start.md) - 5 phút
2. 🎮 Copy/modify existing extensions
3. 📚 [Comic Tutorial](../tutorials/comic-extension.md) - step by step

**Learning Resources:**
- 💡 [JavaScript Basics](https://developer.mozilla.org/en-US/docs/Learn/JavaScript)
- 🎨 [HTML/CSS Introduction](https://www.w3schools.com/html/)
- 🔍 [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)

**Community Support:** Cộng đồng rất helpful cho beginners!
</details>

---

## 🛠 Development

<details>
<summary><strong>🏗 Extension structure như thế nào?</strong></summary>

**Standard Structure:**
```
my-extension/
├── 📄 plugin.json      # Configuration (required)
├── 🖼️ icon.png         # Extension icon 128x128px
└── 📁 src/             # JavaScript files
    ├── detail.js       # Get manga info (required)
    ├── toc.js          # Get chapter list (required)  
    ├── chap.js         # Get chapter content (required)
    ├── search.js       # Search function (optional)
    ├── home.js         # Home categories (optional)
    └── genre.js        # Genre listings (optional)
```

**Minimum viable extension:** Chỉ cần `plugin.json` + `detail.js` + `toc.js` + `chap.js`
</details>

<details>
<summary><strong>📝 Làm sao để test extension trong quá trình development?</strong></summary>

**Method 1: VSCode Extension** (Recommended)
```javascript
// Open any .js file in extension
// Right-click → "VBook: Test [Function]"
// Enter test URL when prompted
```

**Method 2: Java Extension Maker**
```bash
java -jar ExtensionMaker.jar
# Enter phone IP
# Load extension folder
# Test individual functions
```

**Method 3: Manual Testing**
```javascript
// Add debug logs
Console.log("Debug:", variable);

// Test with hardcoded data first
return Response.success({
  name: "Test Manga",
  author: "Test Author"
});
```

**Real-time Testing:** Changes được test ngay lập tức, không cần restart app.
</details>

<details>
<summary><strong>🔍 Làm sao để tìm correct CSS selectors?</strong></summary>

**Tools for selector discovery:**

**1. Chrome DevTools:**
```
1. Right-click element → Inspect
2. Copy selector: Right-click in Elements → Copy → Copy selector
3. Test in Console: document.querySelector("selector")
```

**2. JSoup CSS Selector Tester:**
- 🔗 https://try.jsoup.org/
- Paste HTML và test selectors

**3. Common Patterns:**
```javascript
// Try different selectors in order
const selectors = [
  "h1.manga-title",           // Specific class
  ".title",                   // Generic class
  "h1",                       // Tag only
  "[class*='title']",         // Contains class
  ".content h1:first-child"   // Nested selector
];

for (const selector of selectors) {
  const element = doc.select(selector).first();
  if (element && element.text().trim()) {
    return element.text();
  }
}
```

**Debugging Tip:**
```javascript
// Log all possible title elements
doc.select("h1, .title, [class*=title]").forEach(el => {
  Console.log("Found:", el.text(), "Selector:", el.tagName(), el.className());
});
```
</details>

<details>
<summary><strong>⚡ Extension của tôi chạy chậm, làm sao optimize?</strong></summary>

**Performance Best Practices:**

**1. Minimize HTTP Requests**
```javascript
// ❌ Bad: Multiple requests
const doc1 = fetch(url1).html();
const doc2 = fetch(url2).html();

// ✅ Good: Single request
const doc = fetch(url).html();
// Extract all data from one page
```

**2. Efficient Selectors**
```javascript
// ❌ Slow
doc.select("div div div h1.title")

// ✅ Fast  
doc.select("h1.title")
```

**3. Smart Caching**
```javascript
let cache = {};
function getCachedData(key, fetchFunction) {
  if (cache[key]) return cache[key];
  cache[key] = fetchFunction();
  return cache[key];
}
```

**4. Batch Processing**
```javascript
// Process multiple items at once instead of one-by-one loops
const chapters = doc.select(".chapter").map(el => ({
  name: el.select(".name").text(),
  url: el.select("a").attr("href")
}));
```

**Target Performance:** < 3 seconds total load time
</details>

---

## 🌐 Website Compatibility

<details>
<summary><strong>🌍 Website nào có thể làm extension?</strong></summary>

**✅ Good Candidates:**
- Static HTML content
- Predictable URL patterns  
- Minimal JavaScript dependencies
- No heavy anti-bot protection
- Mobile-friendly responsive design

**⚠️ Challenging Sites:**
- Heavy JavaScript (SPA/React apps)
- Aggressive rate limiting
- CloudFlare protection
- Login-required content
- Frequently changing structure

**❌ Impossible Sites:**
- Completely JavaScript-rendered content
- Complex anti-bot measures
- Dynamic selectors (random class names)
- Requires browser plugins

**Examples:**
- ✅ Traditional manga sites (MangaReader, etc.)
- ✅ Novel/light novel sites
- ✅ Simple blog-based sites
- ⚠️ Modern React-based platforms
- ❌ Advanced streaming sites
</details>

<details>
<summary><strong>🤖 Website có anti-bot protection, làm sao bypass?</strong></summary>

**Legal & Ethical approaches only:**

**1. Respectful Scraping**
```javascript
// Add delays between requests
sleep(2000); // 2 second delay

// Use realistic headers
const response = fetch(url, {
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible browser string)"
  }
});
```

**2. Find API Endpoints**
```javascript
// Many sites have JSON APIs
const apiData = fetch("https://site.com/api/manga/123").json();
```

**3. Use Browser Engine for JS-heavy sites**
```javascript
const browser = Engine.newBrowser();
browser.launch(url, 30000);
const doc = browser.html();
browser.close();
```

**Important Notes:**
- 🔒 Respect robots.txt
- ⏰ Don't overwhelm servers
- 📋 Follow terms of service
- 🤝 Consider contacting site owners

**Alternative:** Nếu website quá strict, tìm alternative sources với cùng content.
</details>

<details>
<summary><strong>🔄 Website thay đổi structure, extension bị break - giải quyết sao?</strong></summary>

**Prevention Strategies:**

**1. Flexible Selectors**
```javascript
// ❌ Brittle
doc.select("div.container div.row div.col-md-8 h1.title")

// ✅ Robust
const titleSelectors = [
  "h1.title", "h1.manga-title", ".title", "h1", "[class*=title]"
];
for (const selector of titleSelectors) {
  const title = doc.select(selector).text();
  if (title) return title;
}
```

**2. Multiple Fallbacks**
```javascript
function extractCover(doc) {
  // Try different sources
  return doc.select("img.cover").attr("data-src") ||
         doc.select("img.cover").attr("src") ||
         doc.select(".manga-image img").attr("src") ||
         doc.select("img").first()?.attr("src") ||
         null;
}
```

**3. Version Monitoring**
```javascript
// Log structure changes for monitoring
Console.log("Page structure hash:", doc.select("*").length);
```

**When Changes Happen:**
1. 🔍 Check website in browser
2. 🛠 Update selectors in extension
3. 🧪 Test thoroughly
4. 📤 Submit updated extension
5. 📢 Notify users about update
</details>

---

## 📱 VBook App

<details>
<summary><strong>📲 VBook App có trên iOS không?</strong></summary>

**Current Status:** VBook hiện tại chỉ hỗ trợ **Android**.

**iOS Development:**
- 🚧 Đang trong quá trình phát triển
- 📅 ETA: Chưa có thông tin chính thức
- 🔔 Follow [GitHub repo](https://github.com/Vitbupdk/vbook) để cập nhật

**Alternatives for iOS:**
- 🌐 Web-based readers
- 📱 Cross-platform solutions đang development
- 💻 Sử dụng Android emulator trên desktop

**Stay Updated:** 
- ⭐ Star GitHub repo
- 🔔 Watch releases
- 💬 Join discussions
</details>

<details>
<summary><strong>🔧 Developer Mode trong VBook làm gì?</strong></summary>

**Developer Mode enables:**
- 🌐 **Debug Server**: Mở port để PC kết nối
- 📊 **Real-time Testing**: Test extensions without app restart  
- 🔍 **Logs & Debug Info**: Xem Console.log output
- ⚡ **Hot Reload**: Changes applied instantly
- 🛠 **Extension Management**: Install/update extensions easily

**Security:**
- 🔒 Chỉ accessible trên local network
- 📱 Tự động tắt khi không sử dụng
- 🛡 Không ảnh hưởng production usage

**Enable:** Tap version number 7 times in Settings
</details>

<details>
<summary><strong>📚 Tôi có thể share extension với người khác không?</strong></summary>

**Yes!** Có nhiều cách share:

**Method 1: GitHub Repository**
```bash
git add .
git commit -m "Add new extension"
git push
# Share repository link
```

**Method 2: ZIP File**
```bash
# Zip extension folder
zip -r my-extension.zip my-extension/
# Share file directly
```

**Method 3: VBook Extension Store** (Coming Soon)
- 📦 Central repository for extensions
- ⭐ Rating và reviews
- 🔄 Auto-updates

**Method 4: Pull Request**
```bash
# Contribute to main repository
# Fork → Add extension → Create PR
```

**Best Practice:** Include icon.png và clear documentation
</details>

---

## 🔧 Technical Issues  

<details>
<summary><strong>🔌 "Cannot connect to phone" - fix như thế nào?</strong></summary>

**Troubleshooting Steps:**

**1. Network Check**
```bash
# PC và phone cùng WiFi network
ping [phone-ip]    # Should respond
```

**2. Phone Settings**
- ✅ Developer Mode enabled
- ✅ VBook app đang chạy
- ✅ Correct IP displayed
- 🔄 Try restart app

**3. PC Settings**  
- 🔥 Disable firewall temporarily
- 🌐 Check antivirus blocking
- 🔌 Try different port (8080, 8081)

**4. Alternative Solutions**
- 📱 Use USB tethering thay vì WiFi
- 🌐 Try mobile hotspot
- 💻 Test với different device

**Quick Fix:**
1. Turn off WiFi on both devices
2. Turn back on và reconnect
3. Restart VBook app
4. Try connection again

Xem chi tiết: [Connection Issues Guide](common-issues.md#connection-issues)
</details>

<details>
<summary><strong>❌ "Response.success is not defined" error nghĩa là gì?</strong></summary>

**Cause:** Bạn đang sử dụng sai API trong VBook extension environment.

**❌ Wrong:**
```javascript
// Standard JavaScript
return {success: true, data: result};
return result;
throw new Error("Something wrong");
```

**✅ Correct:**  
```javascript
// VBook Extensions API
return Response.success(result);
return Response.error("Error message");
```

**Available Response Methods:**
```javascript
// Success with data
Response.success({name: "Manga Title"});

// Success with pagination  
Response.success(mangaList, nextPageUrl);

// Error with message
Response.error("Failed to fetch data");
```

**Debug Tip:**
```javascript
// Test with simple success first
return Response.success("Hello World");
```
</details>

<details>
<summary><strong>🧩 Extension load được nhưng không hoạt động?</strong></summary>

**Common Issues & Fixes:**

**1. JavaScript Syntax Errors**
```javascript
// Check for common mistakes
function execute(url) {
  // ❌ Missing return statement
  const doc = fetch(url).html();
  
  // ✅ Must return Response
  return Response.success(doc.select("title").text());
}
```

**2. Incorrect File References**
```json
// plugin.json must match actual files
{
  "script": {
    "detail": "detail.js",  // src/detail.js must exist
    "toc": "toc.js"        // src/toc.js must exist
  }
}
```

**3. Wrong Function Signatures**
```javascript
// ❌ Wrong parameters
function execute() { ... }

// ✅ Correct for detail.js
function execute(url) { ... }

// ✅ Correct for search.js  
function execute(keyword, page) { ... }
```

**Debug Steps:**
1. 🔍 Add Console.log("Function called") as first line
2. 🧪 Test with hardcoded return values
3. 📝 Check browser console for errors
4. 🔄 Restart VBook app và reconnect
</details>

---

## 🎯 Extension Features

<details>
<summary><strong>🔍 Làm sao implement search function hiệu quả?</strong></summary>

**Basic Search Implementation:**
```javascript
function execute(keyword, page) {
  const searchUrl = `https://site.com/search?q=${encodeURIComponent(keyword)}&page=${page || 1}`;
  const doc = fetch(searchUrl).html();
  
  const results = doc.select(".search-result").map(item => ({
    name: item.select(".title").text(),
    link: item.select("a").attr("href"),
    cover: item.select("img").attr("src"),
    description: item.select(".desc").text()
  }));
  
  // Handle pagination
  const nextPage = doc.select(".next-page").length > 0 ? (parseInt(page || 1) + 1) : null;
  
  return Response.success(results, nextPage);
}
```

**Advanced Features:**
```javascript
// Support different search types
function execute(keyword, page, searchType) {
  let url;
  switch(searchType) {
    case 'author': url = buildAuthorSearchUrl(keyword); break;
    case 'genre': url = buildGenreSearchUrl(keyword); break;
    default: url = buildDefaultSearchUrl(keyword, page);
  }
  
  // ... process results
}

// Handle search suggestions
function getSearchSuggestions(partialKeyword) {
  const doc = fetch(`https://site.com/suggest?q=${partialKeyword}`).html();
  return doc.select(".suggestion").map(el => el.text());
}
```

**Performance Tips:**
- 💾 Cache popular searches
- ⏰ Debounce search requests  
- 📄 Load results incrementally
</details>

<details>
<summary><strong>🏠 Home function để làm gì và setup như thế nào?</strong></summary>

**Purpose:** Home function tạo các categories/sections cho trang chủ của extension.

**Basic Implementation:**
```javascript
// src/home.js
function execute() {
  return Response.success([
    {
      title: "🔥 Latest Updates",
      input: "https://site.com/latest",
      script: "latest.js"  // Will load src/latest.js
    },
    {
      title: "⭐ Popular",
      input: "https://site.com/popular", 
      script: "popular.js"
    },
    {
      title: "🆕 New Releases",
      input: "https://site.com/new",
      script: "new-releases.js"
    }
  ]);
}
```

**Supporting Scripts (src/latest.js):**
```javascript
function execute(url, page) {
  const doc = fetch(url + (page ? `?page=${page}` : '')).html();
  
  return Response.success([
    {
      name: "Manga Title",
      link: "manga-url",
      cover: "cover-url", 
      description: "Latest chapter info"
    }
    // ... more items
  ], nextPageUrl);
}
```

**Benefits:**
- 📱 Rich home page experience
- 🔍 Easy content discovery
- 📊 Popular/trending content
- 🎯 Curated recommendations
</details>

<details>
<summary><strong>🖼️ Images không load trong extension - fix sao?</strong></summary>

**Common Image Issues & Solutions:**

**1. Relative URLs**
```javascript
// ❌ Problem: Relative image paths
// <img src="/images/manga.jpg">

// ✅ Solution: Convert to absolute URLs
function fixImageUrl(src, baseUrl) {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  if (src.startsWith('//')) return 'https:' + src;
  if (src.startsWith('/')) return new URL(baseUrl).origin + src;
  return baseUrl + '/' + src;
}
```

**2. Lazy Loading Images**
```javascript
// Check multiple attributes for image URL
function extractImageUrl(imgElement) {
  return imgElement.attr('data-src') ||
         imgElement.attr('data-lazy') ||
         imgElement.attr('data-original') ||
         imgElement.attr('src');
}
```

**3. Image Format Compatibility**
```javascript
// Ensure compatible image formats
function validateImageUrl(url) {
  const validFormats = /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;
  return validFormats.test(url);
}

// Convert WebP to JPEG if needed
function getCompatibleImageUrl(url) {
  if (url.includes('.webp')) {
    return url.replace('.webp', '.jpg');
  }
  return url;
}
```

**4. Handle Image Servers**
```javascript
// Some sites use separate image domains
function buildImageUrl(imagePath) {
  const imageDomains = [
    'https://img1.site.com',
    'https://img2.site.com', 
    'https://cdn.site.com'
  ];
  
  // Try different domains until one works
  for (const domain of imageDomains) {
    const fullUrl = domain + imagePath;
    try {
      const response = fetch(fullUrl, {method: 'HEAD'});
      if (response.ok) return fullUrl;
    } catch (e) { /* Try next domain */ }
  }
  
  return null;
}
```
</details>

---

## 📊 Performance

<details>
<summary><strong>⚡ Extension chạy chậm hơn mong đợi - optimize thế nào?</strong></summary>

**Performance Optimization Checklist:**

**1. Reduce HTTP Requests**
```javascript
// ❌ Slow: Multiple sequential requests
async function slowApproach(urls) {
  const results = [];
  for (const url of urls) {
    results.push(fetch(url).html());
  }
  return results;
}

// ✅ Fast: Single request with smart parsing
function fastApproach(mainUrl) {
  const doc = fetch(mainUrl).html();
  // Extract all needed data from one page
  return extractAllData(doc);
}
```

**2. Optimize Selectors**
```javascript
// ❌ Slow: Complex nested selectors
doc.select("div.container > div.row > div.col-md-8 > h1.title");

// ✅ Fast: Direct selectors
doc.select("h1.title");
doc.select("[class*='title']"); // If class names vary
```

**3. Smart Caching**
```javascript
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedData(key, fetchFn) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const data = fetchFn();
  cache.set(key, {data, timestamp: Date.now()});
  return data;
}
```

**4. Batch Processing**
```javascript
// Process arrays efficiently
const chapters = doc.select(".chapter-item").map(el => ({
  name: el.select(".name").text().trim(),
  url: buildAbsoluteUrl(el.select("a").attr("href")),
  date: parseDate(el.select(".date").text())
})).filter(ch => ch.name && ch.url);
```

**Performance Targets:**
- ⏱ Detail page: < 2 seconds
- 📚 Chapter list: < 3 seconds  
- 🔍 Search results: < 4 seconds
- 📖 Chapter content: < 2 seconds
</details>

<details>
<summary><strong>💾 Memory usage cao khi extension chạy - giải quyết sao?</strong></summary>

**Memory Optimization Strategies:**

**1. Clean Up Resources**
```javascript
function execute(url) {
  const browser = Engine.newBrowser();
  
  try {
    const doc = browser.launch(url, 30000);
    return processDocument(doc);
  } finally {
    browser.close(); // Always cleanup!
  }
}
```

**2. Avoid Large Variables**
```javascript
// ❌ Memory intensive
function processLargeDocument(url) {
  const doc = fetch(url).html();
  const fullHtml = doc.html(); // Stores entire page in memory
  return extractSmallData(fullHtml);
}

// ✅ Memory efficient  
function processLargeDocument(url) {
  const doc = fetch(url).html();
  return extractSmallData(doc); // Work with DOM directly
}
```

**3. Limit Array Sizes**
```javascript
// Process large lists in chunks
function processLargeChapterList(doc) {
  const chapters = doc.select(".chapter");
  const CHUNK_SIZE = 50;
  
  for (let i = 0; i < chapters.length; i += CHUNK_SIZE) {
    const chunk = chapters.slice(i, i + CHUNK_SIZE);
    processChunk(chunk);
  }
}
```

**4. Clear Caches Periodically**
```javascript
let requestCount = 0;
const cache = new Map();

function managedFetch(url) {
  requestCount++;
  
  // Clear cache every 100 requests
  if (requestCount % 100 === 0) {
    cache.clear();
    Console.log("Cache cleared to free memory");
  }
  
  return fetch(url);
}
```
</details>

---

## 🤝 Community & Support

<details>
<summary><strong>🆘 Tôi bị stuck, làm sao get help?</strong></summary>

**Getting Effective Help:**

**1. Search First**
- 📖 Check [FAQ](faq.md) (this document)
- 🔍 Search [GitHub Issues](https://github.com/Vitbupdk/vbook/issues)
- 📚 Read [Troubleshooting Guide](common-issues.md)

**2. Prepare Good Questions**
```markdown
## Problem Description
Clear description of what's not working

## Expected Behavior  
What should happen

## Actual Behavior
What actually happens (include error messages)

## Code Sample
```javascript
// Relevant code that's causing issues
```

## Environment
- OS: Windows 10/macOS/Linux
- Java Version: 1.8.0_XXX  
- VBook App Version: X.X.X
- Target Website: https://example.com

## Steps to Reproduce
1. First step
2. Second step
3. Error occurs
```

**3. Where to Ask**
- 🐛 **Bugs**: [GitHub Issues](https://github.com/Vitbupdk/vbook/issues/new)
- 💬 **Questions**: [GitHub Discussions](https://github.com/Vitbupdk/vbook/discussions)
- 💡 **Feature Requests**: [Feature Template](https://github.com/Vitbupdk/vbook/issues/new?template=feature_request.md)

**Response Time:** Usually within 24-48 hours
</details>

<details>
<summary><strong>🤝 Làm sao contribute vào VBook Extensions project?</strong></summary>

**Ways to Contribute:**

**1. Create New Extensions**
```bash
# Fork repository
git fork https://github.com/Vitbupdk/vbook

# Create new extension
mkdir my-new-extension
# ... develop extension

# Submit pull request
git add .
git commit -m "Add extension for site-name.com"
git push origin main
# Create PR on GitHub
```

**2. Improve Documentation**
- 📝 Fix typos or unclear instructions
- 📚 Add new tutorials or examples
- 🌍 Translate docs to other languages

**3. Bug Reports & Testing**
- 🐛 Report bugs với detailed information
- 🧪 Test new features và provide feedback
- 💡 Suggest improvements

**4. Code Improvements**  
- ⚡ Performance optimizations
- 🛡 Security enhancements
- 🎨 Code quality improvements

**Recognition:**
- 📜 Contributors được credit trong README
- ⭐ Special badges for major contributors  
- 🏆 Community recognition

**Contribution Guidelines:** See [CONTRIBUTING.md](../CONTRIBUTING.md)
</details>

<details>
<summary><strong>📢 Làm sao stay updated với VBook Extensions development?</strong></summary>

**Stay in the Loop:**

**GitHub (Recommended)**
```bash
# Watch repository for updates
⭐ Star the repo: https://github.com/Vitbupdk/vbook
👁 Watch → All Activity
🔔 Notifications → Custom → Releases
```

**Community Channels**
- 💬 [GitHub Discussions](https://github.com/Vitbupdk/vbook/discussions)
- 📢 [Release Notes](https://github.com/Vitbupdk/vbook/releases)
- 🐛 [Issue Tracker](https://github.com/Vitbupdk/vbook/issues)

**Update Frequency:**
- 🔄 **Core API**: Stable, infrequent changes
- 📱 **VBook App**: Monthly updates
- 📚 **Documentation**: Weekly improvements  
- 🛠 **Tools**: As needed basis

**Breaking Changes:** Always announced in advance with migration guides
</details>

---

## 💡 Quick Tips

### 🚀 **Development Workflow**
1. 📖 Always start with existing extensions as templates
2. 🧪 Test frequently during development
3. 📝 Add Console.log() for debugging
4. 🔄 Keep backups of working versions

### 🎯 **Common Patterns**
```javascript
// URL validation
if (!url || !url.includes('target-site.com')) {
  return Response.error("Invalid URL");
}

// Element existence check
const element = doc.select("selector").first();
if (!element) {
  return Response.error("Element not found");
}

// Graceful degradation
const title = doc.select("h1").text() || 
              doc.select(".title").text() || 
              "Unknown Title";
```

### 🔧 **Debugging Tricks**
```javascript
// Log page structure
Console.log("Page title:", doc.select("title").text());
Console.log("Page size:", doc.html().length);
Console.log("Found elements:", doc.select("*").length);

// Test selectors incrementally  
const titles1 = doc.select("h1");
const titles2 = doc.select(".title"); 
const titles3 = doc.select("[class*=title]");
Console.log("Selector results:", titles1.length, titles2.length, titles3.length);
```

---

<div align="center">

**❓ Câu hỏi của bạn đã được trả lời chưa? 🎯**

**Chưa tìm thấy đáp án?** [Tạo issue mới](https://github.com/Vitbupdk/vbook/issues/new) **|** [Join Discussion](https://github.com/Vitbupdk/vbook/discussions)

**Helpful?** ⭐ [Star the repo](https://github.com/Vitbupdk/vbook) **|** 📢 [Share với friends](https://github.com/Vitbupdk/vbook)

---

*📝 FAQ này được cập nhật thường xuyên dựa trên câu hỏi từ cộng đồng!*

</div>