# 🧪 VBook Extensions Testing & Debugging Guide

Hướng dẫn toàn diện về testing và debugging cho VBook Extensions.

## 📋 Mục Lục

1. [Quick Start](#quick-start)
2. [Công Cụ Debug](#công-cụ-debug) 
3. [Testing Workflow](#testing-workflow)
4. [Common Issues](#common-issues)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Chạy Debug Tool

```bash
# Phân tích tất cả extensions
node debug_extensions.js

# Tự động sửa các lỗi phổ biến
node fix_extensions.js
```

### Kiểm Tra Nhanh

```bash
# Tìm tất cả plugin.json files
find . -name "plugin.json" -type f

# Kiểm tra syntax JavaScript
node -c path/to/extension/src/file.js

# Validate JSON
python -m json.tool plugin.json > /dev/null && echo "Valid JSON" || echo "Invalid JSON"
```

---

## 🔧 Công Cụ Debug

### 1. Extension Debugger (`debug_extensions.js`)

**Chức năng chính:**
- ✅ Phân tích cấu trúc plugin.json
- ✅ Kiểm tra syntax JavaScript files
- ✅ Detect encrypted/obfuscated code
- ✅ Tìm các vấn đề về error handling
- ✅ Report chi tiết với JSON output

**Cách sử dụng:**
```bash
cd /path/to/vbook-extensions
node debug_extensions.js
```

**Output Files:**
- `extension-debug-report.json` - Report chi tiết dạng JSON
- Console output với màu sắc và emoji

### 2. Auto Fixer (`fix_extensions.js`)

**Tự động sửa:**
- ➕ Thêm baseUrl thiếu
- 🗑️ Xóa console.log() statements
- 🔒 Chuyển HTTP thành HTTPS
- ⚠️ Thêm basic error handling (optional)

**Cách sử dụng:**
```bash
node fix_extensions.js
```

---

## 🔄 Testing Workflow

### 1. Initial Analysis
```bash
# Step 1: Chạy debug tool
node debug_extensions.js

# Step 2: Xem report
cat extension-debug-report.json | jq '.summary'

# Step 3: Identify issues
grep -i "error" extension-debug-report.json
```

### 2. Fix Issues
```bash
# Auto-fix common issues
node fix_extensions.js

# Manual fixes (nếu cần)
# - Sửa syntax errors
# - Thêm proper error handling
# - Update deprecated APIs
```

### 3. Validation
```bash
# Re-run debug after fixes
node debug_extensions.js

# Check success rate improvement
grep "Success rate" extension-debug-report.json
```

### 4. Testing với VBook App
```bash
# Package extension (if needed)
zip -r extension_name.zip extension_folder/

# Test trong VBook app
# 1. Import extension
# 2. Test basic functions (home, search, detail)
# 3. Check error handling
# 4. Verify all URLs work
```

---

## ⚠️ Common Issues

### 1. Syntax Errors
**Dấu hiệu:**
- `Syntax error - Invalid or unexpected token`
- Extension không load

**Cách sửa:**
```bash
# Kiểm tra syntax
node -c src/problematic_file.js

# Common fixes:
# - Missing quotes/brackets
# - Invalid characters
# - Encoding issues
```

### 2. Missing BaseURL
**Dấu hiệu:**
- `Thiếu metadata.baseUrl`

**Cách sửa:**
```json
{
  "metadata": {
    "name": "Extension Name",
    "baseUrl": "https://target-website.com",
    // other fields...
  }
}
```

### 3. No Error Handling
**Dấu hiệu:**
- `Không có error handling (try/catch)`
- `fetch() không có error handling`

**Cách sửa:**
```javascript
// Bad
function execute(url) {
    let response = fetch(url);
    return Response.success(response.text());
}

// Good  
function execute(url) {
    try {
        let response = fetch(url);
        if (response.ok) {
            return Response.success(response.text());
        } else {
            return Response.error("HTTP " + response.status);
        }
    } catch (error) {
        return Response.error("Network error: " + error.message);
    }
}
```

### 4. Console.log in Production
**Dấu hiệu:**
- `Có console.log() (nên xóa trong production)`

**Cách sửa:**
```bash
# Remove all console.log statements
sed -i '/console\.log/d' src/*.js
```

### 5. HTTP vs HTTPS
**Dấu hiệu:**
- `Sử dụng HTTP thay vì HTTPS`

**Cách sửa:**
```bash
# Replace HTTP with HTTPS
sed -i 's/http:\/\//https:\/\//g' src/*.js
```

---

## ✅ Best Practices

### 1. Plugin.json Structure
```json
{
  "metadata": {
    "name": "Extension Name",
    "author": "Your Name", 
    "version": 1,
    "baseUrl": "https://target-site.com",
    "source": "https://target-site.com",
    "description": "Mô tả extension",
    "locale": "vi_VN",
    "type": "novel|comic",
    "encrypt": false
  },
  "script": {
    "home": "home.js",
    "detail": "detail.js", 
    "search": "search.js",
    "toc": "toc.js",
    "chap": "chap.js"
  }
}
```

### 2. JavaScript Best Practices
```javascript
// Always include error handling
function execute(url) {
    try {
        // Your logic here
        let response = fetch(url);
        
        if (!response.ok) {
            return Response.error("HTTP " + response.status);
        }
        
        return Response.success(processData(response));
        
    } catch (error) {
        return Response.error("Error: " + error.message);
    }
}

// Validate inputs
function execute(url) {
    if (!url || typeof url !== 'string') {
        return Response.error("Invalid URL");
    }
    
    // Rest of logic...
}

// Use proper selectors
function parseHTML(html) {
    try {
        let doc = html;
        let elements = doc.select(".target-class");
        
        if (!elements || elements.size() === 0) {
            return Response.error("No content found");
        }
        
        return elements;
    } catch (error) {
        return Response.error("Parse error: " + error.message);
    }
}
```

### 3. Testing Checklist
- [ ] Plugin.json valid JSON
- [ ] All required fields present
- [ ] JavaScript syntax valid
- [ ] Error handling implemented
- [ ] No console.log statements
- [ ] HTTPS URLs used
- [ ] BaseUrl configured
- [ ] Test with actual website
- [ ] Handle edge cases (empty results, errors)

---

## 🛠️ Troubleshooting

### Debug Tool Issues

**Vấn đề:** `find: command not found`
```bash
# Windows alternative
dir /s /b plugin.json

# Or use PowerShell
Get-ChildItem -Recurse -Name "plugin.json"
```

**Vấn đề:** `node: command not found`
```bash
# Install Node.js
# Ubuntu/Debian
sudo apt install nodejs npm

# macOS
brew install node

# Windows: Download from nodejs.org
```

**Vấn đề:** Permission denied
```bash
chmod +x debug_extensions.js fix_extensions.js
```

### Extension Loading Issues

**Vấn đề:** Extension không xuất hiện trong VBook
- ✅ Kiểm tra plugin.json format
- ✅ Đảm bảo tất cả required files tồn tại
- ✅ Check syntax errors trong JavaScript
- ✅ Verify baseUrl và source URLs

**Vấn đề:** Network errors
- ✅ Test URLs trong browser trước
- ✅ Check CORS policies
- ✅ Verify SSL certificates
- ✅ Add proper headers nếu cần

**Vấn đề:** Parsing errors
- ✅ Inspect website HTML structure
- ✅ Update selectors nếu site thay đổi
- ✅ Handle dynamic content loading
- ✅ Add fallback selectors

---

## 📊 Extension Quality Metrics

### Success Criteria
- ✅ **100% Pass Rate** trong debug tool
- ✅ **Zero Syntax Errors** 
- ✅ **Complete Error Handling**
- ✅ **No Console.log** statements
- ✅ **HTTPS URLs only**
- ✅ **Valid baseUrl** configured
- ✅ **Working in VBook app**

### Performance Guidelines
- ⚡ Response time < 5 seconds
- 🔄 Proper caching implementation
- 📱 Mobile-friendly (responsive)
- 🌐 Network error resilience

---

## 🤝 Contributing

### Reporting Issues
```bash
# Include debug output
node debug_extensions.js > debug_output.txt

# Create issue with:
# 1. Extension name
# 2. Debug output
# 3. Expected vs actual behavior
# 4. Steps to reproduce
```

### Submitting Fixes
```bash
# Test your changes
node debug_extensions.js
node fix_extensions.js

# Run full test suite
npm test  # if available

# Create pull request with:
# 1. Clear description
# 2. Test results
# 3. Before/after screenshots
```

---

## 📚 Additional Resources

- [VBook Extension API Documentation](./docs/api-reference/core-api.md)
- [Common Selectors Guide](./docs/troubleshooting/common-issues.md)
- [FAQ](./docs/troubleshooting/faq.md)
- [Community Discord](#) <!-- Add actual link -->

---

## 🏷️ Tags

`vbook` `extensions` `testing` `debugging` `javascript` `json` `automation` `quality-assurance`

---

**💡 Pro Tip:** Chạy debug tool thường xuyên trong quá trình development để catch issues sớm!

**🔄 Last Updated:** $(date '+%Y-%m-%d')  
**📝 Version:** 1.0.0