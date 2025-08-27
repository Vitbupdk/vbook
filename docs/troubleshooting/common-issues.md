# 🐛 Common Issues & Solutions

<div align="center">

![Troubleshooting](https://img.shields.io/badge/🔧-Troubleshooting-red?style=for-the-badge)
![Updated](https://img.shields.io/badge/🔄-Updated-green?style=for-the-badge)
![Community](https://img.shields.io/badge/🤝-Community_Driven-blue?style=for-the-badge)

**Giải quyết các vấn đề thường gặp khi phát triển VBook Extensions**

</div>

---

## 📋 Mục lục vấn đề

- [🔌 Connection Issues](#-connection-issues)
- [🧩 Extension Loading Problems](#-extension-loading-problems)
- [📄 Script Execution Errors](#-script-execution-errors)
- [🌐 HTTP Request Issues](#-http-request-issues)
- [🧹 HTML Parsing Problems](#-html-parsing-problems)
- [📱 VBook App Issues](#-vbook-app-issues)
- [💻 Development Environment](#-development-environment)
- [⚡ Performance Issues](#-performance-issues)

---

## 🔌 Connection Issues

### ❌ **"Cannot connect to phone"**

#### 🔍 **Symptoms:**
- Extension Maker không thể kết nối
- Timeout errors
- "Connection refused" messages

#### ✅ **Solutions:**

**1. Check Network Configuration**
```bash
# Kiểm tra IP của PC
ipconfig          # Windows
ifconfig          # macOS/Linux

# Ping điện thoại
ping 192.168.1.100

# Test port connectivity
telnet 192.168.1.100 8080
```

**2. Verify Phone Settings**
- ✅ Developer Mode đã bật
- ✅ VBook App đang chạy
- ✅ IP address hiển thị đúng
- ✅ Cùng mạng WiFi với PC

**3. Firewall Configuration**
```bash
# Windows: Allow Java through firewall
# Control Panel → System & Security → Windows Defender Firewall
# → Allow an app through firewall → Java

# macOS: System Preferences → Security & Privacy → Firewall
# → Options → Allow incoming connections for Java

# Linux: Configure iptables
sudo ufw allow 8080
```

**4. Alternative Connection Methods**
```bash
# Try different IP format
192.168.1.100:8080    # Standard
192.168.1.100         # Without port
http://192.168.1.100:8080  # With protocol
```

### ❌ **"Connection lost during testing"**

#### ✅ **Solutions:**
- 🔄 Restart VBook App
- 📱 Re-enable Developer Mode
- 🌐 Check WiFi stability
- 💡 Use USB tethering nếu WiFi không ổn định

---

## 🧩 Extension Loading Problems

### ❌ **"Extension not found" / "Invalid extension"**

#### 🔍 **Common Causes:**
- Sai cấu trúc thư mục
- `plugin.json` syntax lỗi
- Thiếu files bắt buộc

#### ✅ **Solutions:**

**1. Verify Directory Structure**
```
my-extension/
├── 📄 plugin.json      ✅ Required
├── 🖼️ icon.png          ✅ Required (128x128px)
└── 📁 src/             ✅ Required
    ├── detail.js       ✅ Required
    ├── toc.js          ✅ Required
    └── chap.js         ✅ Required
```

**2. Validate plugin.json**
```bash
# Check JSON syntax
cat plugin.json | jq .    # Linux/macOS
# Or use online JSON validator
```

**3. Common plugin.json errors:**
```json
{
  "metadata": {
    "name": "Extension Name", // ❌ No trailing comma in JSON
    "version": 1,             // ✅ Correct
    "regexp": "site\\.com",   // ✅ Escaped dots
    "type": "comic"           // ✅ Valid types: comic, novel, chinese_novel
  },
  "script": {
    "detail": "detail.js",    // ✅ File must exist in src/
    "toc": "toc.js"          // ✅ No trailing comma
  }
}
```

### ❌ **"Script not found" errors**

#### ✅ **Solutions:**
```bash
# Check file paths
ls -la src/
# Ensure files match plugin.json script names

# Verify file permissions
chmod 644 src/*.js

# Check file encoding (must be UTF-8)
file src/detail.js
```

---

## 📄 Script Execution Errors

### ❌ **"Response.success is not defined"**

#### ✅ **Solution:**
```javascript
// ❌ Wrong
return {success: true, data: result};

// ✅ Correct
return Response.success(result);
```

### ❌ **"fetch is not defined" / HTTP errors**

#### ✅ **Solutions:**

**1. Check URL format:**
```javascript
// ❌ Wrong
const response = fetch("manga-site.com/page");

// ✅ Correct
const response = fetch("https://manga-site.com/page");
```

**2. Handle response properly:**
```javascript
function execute(url) {
  try {
    const response = fetch(url);
    
    // Always check response status
    if (!response.ok) {
      return Response.error(`HTTP ${response.status}: ${url}`);
    }
    
    const doc = response.html();
    // ... process document
    
  } catch (error) {
    return Response.error(`Exception: ${error.message}`);
  }
}
```

### ❌ **"Cannot read property 'text' of null"**

#### 🔍 **Cause:** Element không tồn tại
#### ✅ **Solutions:**

```javascript
// ❌ Wrong - crashes if element not found
const title = doc.select("h1.title").text();

// ✅ Better - handle missing elements
const titleElement = doc.select("h1.title").first();
const title = titleElement ? titleElement.text() : "No title found";

// ✅ Best - with default value
const title = doc.select("h1.title").text() || "Untitled";
```

### ❌ **Infinite loops / Timeout errors**

#### ✅ **Solutions:**

```javascript
// ❌ Dangerous - potential infinite loop
function fetchAllPages(baseUrl) {
  let page = 1;
  while (true) {
    const response = fetch(`${baseUrl}?page=${page}`);
    // ... process
    page++;
  }
}

// ✅ Safe - with limits
function fetchAllPages(baseUrl, maxPages = 50) {
  let page = 1;
  let hasNext = true;
  
  while (hasNext && page <= maxPages) {
    const response = fetch(`${baseUrl}?page=${page}`);
    
    if (!response.ok) break;
    
    const doc = response.html();
    const nextLink = doc.select(".next-page");
    hasNext = nextLink.length > 0;
    
    page++;
    
    // Add delay to avoid being blocked
    if (hasNext) sleep(1000);
  }
}
```

---

## 🌐 HTTP Request Issues

### ❌ **403 Forbidden / 503 Service Unavailable**

#### 🔍 **Causes:**
- Website blocks crawlers
- Rate limiting
- Missing headers

#### ✅ **Solutions:**

**1. Add realistic headers:**
```javascript
const response = fetch(url, {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate",
    "DNT": "1",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1"
  }
});
```

**2. Add delays between requests:**
```javascript
function executeWithDelay(url) {
  // Add random delay to avoid detection
  const delay = Math.floor(Math.random() * 2000) + 1000; // 1-3 seconds
  sleep(delay);
  
  const response = fetch(url);
  return response;
}
```

**3. Handle cookies/sessions:**
```javascript
function fetchWithCookies(url) {
  // First request to get session cookies
  const initialResponse = fetch("https://site.com/");
  const cookies = initialResponse.headers["Set-Cookie"];
  
  // Subsequent requests with cookies
  const response = fetch(url, {
    headers: {
      "Cookie": cookies
    }
  });
  
  return response;
}
```

### ❌ **SSL/TLS Certificate errors**

#### ✅ **Solutions:**
```javascript
// Try different URL formats
const urls = [
  "https://site.com/page",    // HTTPS first
  "http://site.com/page",     // Fallback to HTTP
  "https://www.site.com/page" // With www
];

for (const testUrl of urls) {
  try {
    const response = fetch(testUrl);
    if (response.ok) {
      return processResponse(response);
    }
  } catch (error) {
    Console.log(`Failed to fetch ${testUrl}:`, error.message);
  }
}

return Response.error("All URL attempts failed");
```

---

## 🧹 HTML Parsing Problems

### ❌ **"Elements not found" / Empty results**

#### 🔍 **Debugging steps:**

```javascript
function debugSelectors(doc, url) {
  Console.log("=== DEBUG INFO ===");
  Console.log("URL:", url);
  Console.log("Document title:", doc.select("title").text());
  Console.log("Document length:", doc.html().length);
  
  // Test different selectors
  const selectors = [".title", "h1", ".manga-title", "[class*=title]"];
  
  selectors.forEach(selector => {
    const elements = doc.select(selector);
    Console.log(`Selector "${selector}": ${elements.length} elements`);
    if (elements.length > 0) {
      Console.log(`First match: ${elements.first().text().substring(0, 100)}`);
    }
  });
}
```

### ❌ **JavaScript-generated content not available**

#### 🔍 **Problem:** Content loaded by JavaScript sau khi page load
#### ✅ **Solutions:**

**1. Use Browser Engine:**
```javascript
function executeWithBrowser(url) {
  const browser = Engine.newBrowser();
  
  try {
    browser.setUserAgent(UserAgent.android());
    
    // Launch page and wait for JS to load
    const doc = browser.launch(url, 30000);
    
    // Wait for specific elements to load
    browser.waitUrl(["/api/data"], 10000);
    
    // Or execute JavaScript to trigger loading
    browser.callJs("loadMoreContent()", 5000);
    
    const finalDoc = browser.html();
    
    // Now parse the fully loaded content
    const title = finalDoc.select("h1.title").text();
    
    return Response.success({name: title});
    
  } finally {
    browser.close(); // Always close browser
  }
}
```

**2. Find API endpoints:**
```javascript
function fetchFromAPI(mangaId) {
  // Often there's a JSON API behind the scenes
  const apiResponse = fetch(`https://site.com/api/manga/${mangaId}`);
  
  if (apiResponse.ok) {
    const data = apiResponse.json();
    return data;
  }
  
  return null;
}
```

### ❌ **Encoding issues (special characters garbled)**

#### ✅ **Solutions:**

```javascript
// Specify encoding when fetching
const response = fetch(url);
const doc = response.html("UTF-8"); // Specify charset

// Or try different encodings
const encodings = ["UTF-8", "ISO-8859-1", "Windows-1252"];
for (const encoding of encodings) {
  try {
    const doc = response.html(encoding);
    const title = doc.select("title").text();
    if (title && !title.includes("�")) {
      // Found working encoding
      return processWithEncoding(response, encoding);
    }
  } catch (error) {
    // Try next encoding
  }
}
```

---

## 📱 VBook App Issues

### ❌ **"Extension not loading in app"**

#### ✅ **Solutions:**

**1. Check app version:**
- Ensure VBook app is latest version
- Some features require specific app versions

**2. Clear app cache:**
- Settings → Apps → VBook → Storage → Clear Cache
- Restart app after clearing cache

**3. Reinstall extension:**
- Remove extension from app
- Restart app
- Re-import extension

### ❌ **"Images not displaying"**

#### ✅ **Solutions:**

**1. Check image URLs:**
```javascript
function validateImageUrl(imgUrl) {
  // Ensure absolute URL
  if (!imgUrl.startsWith('http')) {
    return 'https://site.com' + imgUrl;
  }
  
  // Check for common issues
  if (imgUrl.includes(' ')) {
    return imgUrl.replace(/ /g, '%20');
  }
  
  return imgUrl;
}
```

**2. Handle different image formats:**
```javascript
function getCompatibleImageUrl(imgElement) {
  // Try different attributes
  const sources = [
    imgElement.attr("data-src"),
    imgElement.attr("data-lazy"),
    imgElement.attr("data-original"),
    imgElement.attr("src")
  ];
  
  for (const src of sources) {
    if (src && src.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return validateImageUrl(src);
    }
  }
  
  return null;
}
```

---

## 💻 Development Environment

### ❌ **VSCode extension not working**

#### ✅ **Solutions:**

**1. Reinstall extension:**
- Uninstall VBook Extension Maker
- Restart VSCode completely
- Reinstall from latest release

**2. Check VSCode settings:**
```json
// .vscode/settings.json
{
  "javascript.validate.enable": true,
  "typescript.validate.enable": false
}
```

**3. Manual testing:**
- Use Java Extension Maker as fallback
- Copy-paste code for testing

### ❌ **Java tool crashes/won't start**

#### ✅ **Solutions:**

**1. Check Java version:**
```bash
java -version
# Should be 1.8 or higher

# Update if needed
sudo apt install openjdk-11-jre  # Linux
brew install openjdk@11          # macOS
```

**2. Run with error logging:**
```bash
java -jar ExtensionMaker.jar 2>&1 | tee error.log
# Check error.log for detailed error messages
```

**3. Alternative: Command line testing**
```bash
# Create test script
cat > test.js << 'EOF'
function execute() {
  return Response.success("Hello World");
}
EOF

# Test with node (if available)
node -e "
const fetch = require('node-fetch');
// Mock VBook environment
global.Response = {success: (d) => ({success: true, data: d})};
$(cat test.js)
console.log(execute());
"
```

---

## ⚡ Performance Issues

### ❌ **Slow extension loading**

#### ✅ **Optimization tips:**

**1. Minimize HTTP requests:**
```javascript
// ❌ Slow - multiple requests
function getDetails(url) {
  const mainPage = fetch(url).html();
  const authorPage = fetch(mainPage.select("a.author").attr("href")).html();
  const genrePage = fetch(mainPage.select("a.genre").attr("href")).html();
  // ... more requests
}

// ✅ Fast - single request
function getDetails(url) {
  const doc = fetch(url).html();
  // Extract all info from single page
  return {
    title: doc.select("h1").text(),
    author: doc.select(".author").text(),
    genres: doc.select(".genre").map(el => el.text()).join(", ")
  };
}
```

**2. Cache frequently used data:**
```javascript
let genreCache = null;

function getGenres() {
  if (genreCache) {
    return genreCache; // Use cached data
  }
  
  const doc = fetch("https://site.com/genres").html();
  genreCache = doc.select(".genre a").map(link => ({
    name: link.text(),
    url: link.attr("href")
  }));
  
  return genreCache;
}
```

**3. Optimize selectors:**
```javascript
// ❌ Slow - complex nested selectors
doc.select("div.container div.content div.manga-info h1.title");

// ✅ Fast - direct selectors
doc.select("h1.title");
```

---

## 🆘 Quick Fixes Checklist

When extension fails, try these in order:

### ✅ **Level 1: Basic Checks**
- [ ] URL format correct (https://)
- [ ] Internet connection working
- [ ] VBook app running with Developer Mode
- [ ] PC and phone on same network

### ✅ **Level 2: Extension Checks**
- [ ] plugin.json syntax valid
- [ ] Required files exist (detail.js, toc.js, chap.js)
- [ ] No JavaScript syntax errors
- [ ] Selectors match actual website HTML

### ✅ **Level 3: Advanced Debugging**
- [ ] Add Console.log() statements
- [ ] Test with simple hardcoded data
- [ ] Check website in regular browser
- [ ] Verify website hasn't changed structure

### ✅ **Level 4: Environment Issues**
- [ ] Try different Java version
- [ ] Restart all development tools
- [ ] Clear VBook app cache
- [ ] Test on different device/network

---

## 📞 Getting Help

### 🤝 **Community Support:**
- 💬 [GitHub Discussions](https://github.com/Vitbupdk/vbook/discussions)
- 🐛 [Report Bug](https://github.com/Vitbupdk/vbook/issues/new?template=bug_report.md)
- 💡 [Feature Request](https://github.com/Vitbupdk/vbook/issues/new?template=feature_request.md)

### 📊 **When asking for help, include:**
1. **Error message** (complete text)
2. **Extension code** (relevant parts)
3. **Target website** URL
4. **Environment info** (OS, Java version, VBook app version)
5. **Steps to reproduce**

### 🔗 **Useful Tools:**
- [JSoup CSS Selector Tester](https://try.jsoup.org/)
- [Regex101](https://regex101.com/) - Test regex patterns
- [JSON Validator](https://jsonlint.com/) - Validate plugin.json
- [HTTP Status Checker](https://httpstatus.io/) - Check website status

---

<div align="center">

**🛠️ Troubleshooting Guide hoàn tất! Vấn đề đã được giải quyết? 🎉**

**Helpful:** [🔍 Debugging Guide](debugging.md) **|** [❓ FAQ](faq.md) **|** [⚡ Performance Tips](performance.md)

---

*📝 Vấn đề chưa được giải quyết? [Tạo issue](https://github.com/Vitbupdk/vbook/issues/new) để được hỗ trợ chi tiết!*

</div>