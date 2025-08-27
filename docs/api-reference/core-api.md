# 🔧 Core API Reference

<div align="center">

![Core API](https://img.shields.io/badge/🔧-Core_API-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/API_Version-2.0-green?style=for-the-badge)
![Stability](https://img.shields.io/badge/Stability-Stable-brightgreen?style=for-the-badge)

**API Documentation cho VBook Extensions Core Functions**

</div>

---

## 📋 Tổng quan

Core API cung cấp các functions cơ bản nhất để phát triển VBook Extensions:

- 🌐 **HTTP Requests** - Fetch data từ web
- 🧹 **HTML Parsing** - Parse và extract content  
- ✅ **Response Handling** - Format output chuẩn
- 🤖 **Browser Automation** - Advanced web scraping
- 🔧 **Utility Functions** - Helper functions

---

## 🏗 Extension Structure

### 📄 Plugin Configuration (plugin.json)

```json
{
  "metadata": {
    "name": "Extension Name",
    "author": "Your Name",
    "version": 1,
    "source": "https://example.com",
    "regexp": "Regex pattern to match URLs",
    "description": "Extension description",
    "locale": "vi_VN",
    "type": "comic|novel|chinese_novel",
    "tag": "nsfw", // Optional: for 18+ content
    "language": "javascript",
    "encrypt": false // Optional: encrypt scripts
  },
  "script": {
    "detail": "detail.js",     // Required
    "toc": "toc.js",          // Required
    "chap": "chap.js",        // Required
    "search": "search.js",    // Optional
    "home": "home.js",        // Optional
    "genre": "genre.js",      // Optional
    "page": "page.js"         // Optional
  }
}
```

### 📁 Directory Structure

```
my-extension/
├── 📄 plugin.json          # Extension configuration
├── 🖼️ icon.png             # Extension icon (128x128px)
└── 📁 src/                 # Scripts directory
    ├── detail.js           # Get manga/novel details
    ├── toc.js             # Get table of contents  
    ├── chap.js            # Get chapter content
    ├── search.js          # Search functionality
    ├── home.js            # Home page content
    └── genre.js           # Genre listings
```

---

## 🌐 HTTP API

### 📡 **fetch(url, options?)**

Thực hiện HTTP request và trả về Response object.

#### Syntax:
```javascript
// GET request
const response = fetch(url);

// POST request with options
const response = fetch(url, {
  method: "POST|GET|PUT|DELETE|PATCH",
  headers: {
    "Content-Type": "application/json",
    "User-Agent": "Custom User Agent",
    "Cookie": "session=abc123"
  },
  body: {
    key: "value",
    param: "data"
  }
});
```

#### Parameters:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | `string` | ✅ | Target URL to fetch |
| `options` | `object` | ❌ | Request configuration |
| `options.method` | `string` | ❌ | HTTP method (default: GET) |
| `options.headers` | `object` | ❌ | Request headers |
| `options.body` | `object` | ❌ | Request body data |

#### Returns: `Response`
```javascript
{
  status: number,           // HTTP status code
  ok: boolean,             // true if status 200-299
  headers: object,         // Response headers
  html(): Document,        // Parse as HTML Document
  text(): string,          // Get as plain text
  json(): object          // Parse as JSON
}
```

#### Examples:

**Basic GET request:**
```javascript
function execute(url) {
  const response = fetch(url);
  
  if (!response.ok) {
    return Response.error(`HTTP ${response.status}: Failed to fetch`);
  }
  
  const doc = response.html();
  // Process document...
}
```

**POST request với authentication:**
```javascript
function searchManga(keyword) {
  const response = fetch("https://api.manga-site.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer token123"
    },
    body: {
      query: keyword,
      limit: 20
    }
  });
  
  const results = response.json();
  return results.data;
}
```

**Handle cookies và sessions:**
```javascript
function fetchWithSession(url) {
  const response = fetch(url, {
    headers: {
      "Cookie": "PHPSESSID=abc123; user_pref=dark_mode"
    }
  });
  
  // Extract cookies from response
  const setCookie = response.headers['Set-Cookie'];
  Console.log("New cookies:", setCookie);
  
  return response.html();
}
```

---

## 🧹 HTML Parsing API

### 📄 **Html.parse(htmlString)**

Parse HTML string thành Document object.

#### Syntax:
```javascript
const doc = Html.parse(htmlString);
```

#### Parameters:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `htmlString` | `string` | ✅ | Raw HTML content |

#### Returns: `Document`

#### Example:
```javascript
function parseCustomHTML() {
  const htmlContent = `
    <div class="manga-info">
      <h1>Manga Title</h1>
      <p class="author">By: Author Name</p>
    </div>
  `;
  
  const doc = Html.parse(htmlContent);
  const title = doc.select("h1").text();
  const author = doc.select(".author").text();
  
  return { title, author };
}
```

### 🧽 **Html.clean(htmlString, allowedTags)**

Clean HTML content, chỉ giữ lại các thẻ được chỉ định.

#### Syntax:
```javascript
const cleanHtml = Html.clean(htmlString, ["p", "br", "strong", "em"]);
```

#### Parameters:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `htmlString` | `string` | ✅ | Raw HTML content |
| `allowedTags` | `string[]` | ✅ | Array of allowed HTML tags |

#### Returns: `string`

#### Example:
```javascript
function getCleanContent(rawHtml) {
  // Remove unwanted tags, keep only content tags
  const cleanContent = Html.clean(rawHtml, [
    "p", "br", "strong", "em", "i", "b", 
    "h1", "h2", "h3", "ul", "ol", "li"
  ]);
  
  return cleanContent;
}
```

---

## 🔍 Document Selectors

VBook sử dụng **JSoup CSS Selectors** để query HTML elements.

### 📝 **Common Selectors**

| Selector | Description | Example |
|----------|-------------|---------|
| `tag` | Select by tag name | `doc.select("p")` |
| `.class` | Select by class | `doc.select(".manga-title")` |
| `#id` | Select by ID | `doc.select("#content")` |
| `[attr]` | Select by attribute | `doc.select("[data-id]")` |
| `[attr=value]` | Select by attribute value | `doc.select("[class=title]")` |

### 🎯 **Advanced Selectors**

```javascript
// Descendant selectors
doc.select("div.content p");           // <p> inside <div class="content">
doc.select("ul > li");                 // Direct <li> children of <ul>
doc.select("h1 + p");                  // <p> immediately after <h1>

// Attribute selectors
doc.select("img[src*=cover]");         // Images with "cover" in src
doc.select("a[href^=https]");          // Links starting with https
doc.select("div[class$=info]");        // Divs with class ending in "info"

// Pseudo selectors
doc.select("tr:nth-child(odd)");       // Odd table rows
doc.select("li:first-child");          // First list item
doc.select("p:contains(Chapter)");     // Paragraphs containing "Chapter"
```

### 🛠 **Element Methods**

```javascript
const element = doc.select(".manga-title").first();

// Get content
const text = element.text();           // Plain text content
const html = element.html();           // HTML content
const outerHtml = element.outerHtml(); // Element + content

// Get attributes
const href = element.attr("href");     // Get href attribute
const className = element.className(); // Get class name
const hasClass = element.hasClass("active"); // Check if has class

// Traversal
const parent = element.parent();       // Parent element
const siblings = element.siblings();   // Sibling elements
const children = element.children();   // Child elements

// Manipulation
element.text("New text");              // Set text content
element.attr("href", "new-url");       // Set attribute
element.addClass("new-class");         // Add CSS class
element.removeClass("old-class");      // Remove CSS class
```

---

## ✅ Response API

### 🎯 **Response.success(data, nextPage?)**

Trả về response thành công.

#### Syntax:
```javascript
// Single data
Response.success(data);

// With pagination
Response.success(dataArray, nextPageUrl);
```

#### Parameters:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | `any` | ✅ | Response data |
| `nextPage` | `string` | ❌ | URL for next page (pagination) |

#### Examples:

**Detail response:**
```javascript
function execute(url) {
  const doc = fetch(url).html();
  
  return Response.success({
    name: doc.select("h1.title").text(),
    author: doc.select(".author").text(),
    cover: doc.select("img.cover").attr("src"),
    description: doc.select(".description").text(),
    ongoing: doc.select(".status").text().includes("Ongoing"),
    detail: doc.select(".meta-info").html()
  });
}
```

**List với pagination:**
```javascript
function execute(url, page) {
  const doc = fetch(url + "?page=" + (page || 1)).html();
  
  const mangaList = doc.select(".manga-item").map(item => ({
    name: item.select(".title").text(),
    link: item.select("a").attr("href"),
    cover: item.select("img").attr("src"),
    description: item.select(".desc").text()
  }));
  
  // Check if has next page
  const nextPage = doc.select(".next-page").attr("href");
  
  return Response.success(mangaList, nextPage);
}
```

### ❌ **Response.error(message)**

Trả về response lỗi.

#### Syntax:
```javascript
Response.error(errorMessage);
```

#### Parameters:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | `string` | ✅ | Error description |

#### Example:
```javascript
function execute(url) {
  const response = fetch(url);
  
  if (!response.ok) {
    return Response.error(`Failed to fetch: HTTP ${response.status}`);
  }
  
  const doc = response.html();
  const title = doc.select("h1").text();
  
  if (!title) {
    return Response.error("Could not find manga title");
  }
  
  return Response.success({ name: title });
}
```

---

## 🔧 Utility Functions

### 📝 **Console.log(...args)**

Log debug information (hiển thị trong logcat tab).

```javascript
Console.log("Debug message");
Console.log("Value:", variable, "Object:", {key: "value"});
```

### 📁 **load(filename)**

Load và execute JavaScript file khác.

```javascript
// Load helper functions
load("helpers.js");

// helpers.js content:
function parseDate(dateString) {
  // Date parsing logic
  return new Date(dateString);
}
```

### ⏰ **sleep(milliseconds)**

Pause execution trong một khoảng thời gian.

```javascript
function delayedExecution() {
  Console.log("Starting...");
  sleep(2000); // Wait 2 seconds
  Console.log("Continuing after delay...");
}
```

---

## 📚 Required Script Functions

### 🔍 **detail.js** - Manga/Novel Details
```javascript
/**
 * Get manga/novel information
 * @param {string} url - Manga/novel URL
 * @returns {object} Manga/novel details
 */
function execute(url) {
  const doc = fetch(url).html();
  
  return Response.success({
    name: "Required - Manga/novel title",
    author: "Optional - Author name",
    cover: "Optional - Cover image URL", 
    description: "Optional - Plot description",
    detail: "Optional - Additional info HTML",
    ongoing: true, // boolean - Is ongoing?
    genres: [], // Optional - Genre links
    suggests: [], // Optional - Related manga
    comments: [] // Optional - Comments section
  });
}
```

### 📚 **toc.js** - Table of Contents
```javascript
/**
 * Get chapter list
 * @param {string} url - Manga URL or page URL from page.js
 * @returns {array} Chapter list
 */
function execute(url) {
  const doc = fetch(url).html();
  
  const chapters = doc.select(".chapter-list a").map(link => ({
    name: link.text(), // Required - Chapter title
    url: link.attr("href"), // Required - Chapter URL
    host: "example.com" // Optional - Domain if URL is relative
  }));
  
  return Response.success(chapters);
}
```

### 📖 **chap.js** - Chapter Content
```javascript
/**
 * Get chapter content
 * @param {string} url - Chapter URL from toc.js
 * @returns {string} Chapter content HTML
 */
function execute(url) {
  const doc = fetch(url).html();
  
  // For comics: return image URLs
  const images = doc.select(".page-img").map(img => 
    img.attr("data-src") || img.attr("src")
  ).join("<br>");
  
  // For novels: return text content
  const content = doc.select(".chapter-content").html();
  
  return Response.success(content || images);
}
```

---

## 🎯 Optional Script Functions

### 🏠 **home.js** - Home Page Categories
```javascript
function execute() {
  return Response.success([
    {
      title: "Latest Updates",
      input: "https://site.com/latest",
      script: "latest.js"
    },
    {
      title: "Popular Today", 
      input: "https://site.com/popular",
      script: "popular.js"
    }
  ]);
}
```

### 🔍 **search.js** - Search Function
```javascript
/**
 * Search manga/novels
 * @param {string} keyword - Search keyword
 * @param {string} page - Page number for pagination
 * @returns {array} Search results
 */
function execute(keyword, page) {
  const searchUrl = `https://site.com/search?q=${keyword}&page=${page || 1}`;
  const doc = fetch(searchUrl).html();
  
  const results = doc.select(".search-result").map(item => ({
    name: item.select(".title").text(),
    link: item.select("a").attr("href"),
    cover: item.select("img").attr("src"),
    description: item.select(".desc").text()
  }));
  
  const nextPage = doc.select(".next").attr("href");
  
  return Response.success(results, nextPage);
}
```

### 📂 **genre.js** - Genre Categories
```javascript
function execute() {
  const doc = fetch("https://site.com/genres").html();
  
  const genres = doc.select(".genre-list a").map(link => ({
    title: link.text(),
    input: link.attr("href"),
    script: "genre-content.js"
  }));
  
  return Response.success(genres);
}
```

---

## 🔒 Best Practices

### ⚡ **Performance**
```javascript
// ❌ Bad: Multiple requests
function slowFunction(url) {
  const doc1 = fetch(url + "/page1").html();
  const doc2 = fetch(url + "/page2").html(); 
  // Process separately...
}

// ✅ Good: Single request with smart parsing
function fastFunction(url) {
  const doc = fetch(url).html();
  // Extract all needed data from single request
}
```

### 🛡 **Error Handling**
```javascript
function robustFunction(url) {
  try {
    const response = fetch(url);
    
    if (!response.ok) {
      return Response.error(`HTTP ${response.status}: ${url}`);
    }
    
    const doc = response.html();
    const title = doc.select("h1").text();
    
    if (!title || title.trim() === "") {
      return Response.error("Title not found or empty");
    }
    
    return Response.success({name: title});
    
  } catch (error) {
    return Response.error(`Exception: ${error.message}`);
  }
}
```

### 🧹 **Clean Code**
```javascript
// Use descriptive function names
function extractMangaChapters(mangaDoc) {
  return mangaDoc.select(".chapter-list a").map(link => ({
    name: sanitizeChapterName(link.text()),
    url: buildAbsoluteUrl(link.attr("href"))
  }));
}

function sanitizeChapterName(rawName) {
  return rawName.trim().replace(/\s+/g, ' ');
}

function buildAbsoluteUrl(relativeUrl) {
  if (relativeUrl.startsWith('http')) return relativeUrl;
  return 'https://site.com' + relativeUrl;
}
```

---

<div align="center">

**🎯 Đây là Core API cơ bản! Tiếp tục với Advanced APIs:**

**📄 Tiếp theo:** [HTTP Utils](http-utils.md) **|** [HTML Parser](html-parser.md) **|** [Browser Engine](browser-engine.md)

---

*📝 Cần hỗ trợ? [Tạo issue](https://github.com/Vitbupdk/vbook/issues/new) để được giúp đỡ!*

</div>