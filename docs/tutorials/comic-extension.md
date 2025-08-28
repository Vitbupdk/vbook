# 📱 Comic Extension Tutorial

<div align="center">

![Comic Extension](https://img.shields.io/badge/📱-Comic_Extension-orange?style=for-the-badge)
![Time](https://img.shields.io/badge/⏰-30_Minutes-blue?style=for-the-badge)
![Difficulty](https://img.shields.io/badge/🎯-Intermediate-yellow?style=for-the-badge)

**Hướng dẫn tạo extension cho trang web manga/comic từ A-Z**

</div>

---

## 🎯 Mục tiêu Tutorial

Sau khi hoàn thành tutorial này, bạn sẽ:
- ✅ Tạo được comic extension hoàn chỉnh
- ✅ Hiểu cách parse HTML cho trang comic
- ✅ Xử lý image loading và pagination
- ✅ Implement search và home functions
- ✅ Test và debug extension

---

## 🌐 Target Website Analysis

Chúng ta sẽ tạo extension cho **MangaDemo** (website giả định):

### 📋 Website Structure:
```
🏠 Home: https://manga-demo.com/
🔍 Search: https://manga-demo.com/search?q=keyword
📚 Manga Detail: https://manga-demo.com/manga/12345
📖 Chapter: https://manga-demo.com/chapter/67890
📂 Genres: https://manga-demo.com/genres
```

### 🎯 HTML Patterns to Extract:
- **Title**: `<h1 class="manga-title">`
- **Cover**: `<img class="cover-image" src="...">`
- **Chapters**: `<div class="chapter-list"> <a href="...">`
- **Images**: `<img class="page-image" data-src="...">`

---

## 🏗 Step 1: Project Setup

### 📁 Create Extension Directory

```bash
# Navigate to your VBook project
cd /path/to/vbook

# Create extension directory
mkdir manga-demo-extension
cd manga-demo-extension

# Create structure
mkdir src
touch plugin.json
# Add icon.png (128x128px)
```

### ⚙️ Create plugin.json

```json
{
  "metadata": {
    "name": "Manga Demo",
    "author": "Your Name",
    "version": 1,
    "source": "https://manga-demo.com",
    "regexp": "(manga-demo\\.com/manga/\\d+|manga-demo\\.com/chapter/\\d+)",
    "description": "Extension for manga-demo.com website",
    "locale": "en_US",
    "type": "comic",
    "language": "javascript",
    "tag": "" // Add "nsfw" if 18+ content
  },
  "script": {
    "detail": "detail.js",
    "toc": "toc.js", 
    "chap": "chap.js",
    "search": "search.js",
    "home": "home.js"
  }
}
```

### 🔍 Regex Pattern Explanation:
```regex
(manga-demo\.com/manga/\d+|manga-demo\.com/chapter/\d+)
```
- `manga-demo\.com/manga/\d+` - Matches manga detail pages
- `manga-demo\.com/chapter/\d+` - Matches chapter pages  
- `|` - OR operator
- `\d+` - One or more digits
- `\.` - Escaped dot (literal dot)

---

## 📖 Step 2: Detail Script (detail.js)

Tạo `src/detail.js`:

```javascript
/**
 * Get manga information from detail page
 * @param {string} url - Manga detail URL (e.g., https://manga-demo.com/manga/12345)
 */
function execute(url) {
  // Log for debugging
  Console.log("Fetching manga details from:", url);
  
  try {
    // Fetch the manga detail page
    const response = fetch(url);
    
    if (!response.ok) {
      return Response.error(`HTTP ${response.status}: Could not fetch ${url}`);
    }
    
    const doc = response.html();
    
    // Extract manga information
    const title = doc.select("h1.manga-title").text().trim();
    const author = doc.select(".manga-author").text().replace("Author:", "").trim();
    const cover = doc.select("img.cover-image").attr("src");
    const description = doc.select(".manga-description").text().trim();
    const status = doc.select(".manga-status").text().trim();
    
    // Extract additional details
    const genres = doc.select(".genre-tags a").map(tag => tag.text()).join(", ");
    const rating = doc.select(".rating-score").text().trim();
    const lastUpdate = doc.select(".last-update").text().trim();
    
    // Check if manga is ongoing
    const ongoing = status.toLowerCase().includes("ongoing") || 
                   status.toLowerCase().includes("updating");
    
    // Validate required fields
    if (!title) {
      return Response.error("Manga title not found");
    }
    
    // Build absolute cover URL if needed
    let absoluteCoverUrl = cover;
    if (cover && !cover.startsWith('http')) {
      absoluteCoverUrl = 'https://manga-demo.com' + cover;
    }
    
    // Build detail HTML with additional info
    const detailHtml = `
      <div class="manga-details">
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Genres:</strong> ${genres}</p>
        <p><strong>Rating:</strong> ${rating}</p>
        <p><strong>Last Update:</strong> ${lastUpdate}</p>
      </div>
    `;
    
    Console.log("Successfully extracted manga:", title);
    
    return Response.success({
      name: title,
      author: author || "Unknown",
      cover: absoluteCoverUrl,
      description: description || "No description available",
      detail: detailHtml,
      ongoing: ongoing
    });
    
  } catch (error) {
    Console.log("Error in detail.js:", error.message);
    return Response.error(`Exception: ${error.message}`);
  }
}
```

### 🔧 Advanced Features (Optional):

```javascript
// Handle multiple cover image sources
function extractBestCoverImage(doc) {
  // Try different selectors in order of preference
  const selectors = [
    "img.cover-image",
    ".manga-cover img", 
    ".thumbnail img",
    ".poster img"
  ];
  
  for (const selector of selectors) {
    const img = doc.select(selector).first();
    if (img) {
      const src = img.attr("data-src") || img.attr("src");
      if (src) return src;
    }
  }
  
  return null;
}

// Extract genre links for navigation
function extractGenreLinks(doc) {
  return doc.select(".genre-tags a").map(link => ({
    title: link.text(),
    input: link.attr("href"),
    script: "genre-content.js"
  }));
}
```

---

## 📚 Step 3: Table of Contents (toc.js)

Tạo `src/toc.js`:

```javascript
/**
 * Get chapter list for manga
 * @param {string} url - Manga detail URL
 */
function execute(url) {
  Console.log("Fetching chapter list from:", url);
  
  try {
    const response = fetch(url);
    
    if (!response.ok) {
      return Response.error(`HTTP ${response.status}: Could not fetch chapters`);
    }
    
    const doc = response.html();
    
    // Extract chapter list
    const chapterElements = doc.select(".chapter-list .chapter-item");
    
    if (chapterElements.length === 0) {
      return Response.error("No chapters found");
    }
    
    const chapters = chapterElements.map(element => {
      const link = element.select("a").first();
      const chapterUrl = link.attr("href");
      const chapterName = link.text().trim();
      const chapterDate = element.select(".chapter-date").text().trim();
      
      // Build absolute URL if needed
      let absoluteUrl = chapterUrl;
      if (chapterUrl && !chapterUrl.startsWith('http')) {
        absoluteUrl = 'https://manga-demo.com' + chapterUrl;
      }
      
      // Clean chapter name
      const cleanName = chapterName || `Chapter ${element.attr('data-num') || '??'}`;
      
      return {
        name: chapterDate ? `${cleanName} (${chapterDate})` : cleanName,
        url: absoluteUrl,
        host: "manga-demo.com" // Optional: helps with URL resolution
      };
    });
    
    // Reverse order if needed (latest first vs oldest first)
    // Most manga sites show latest chapters first, but VBook expects oldest first
    const sortedChapters = chapters.reverse();
    
    Console.log(`Found ${sortedChapters.length} chapters`);
    
    return Response.success(sortedChapters);
    
  } catch (error) {
    Console.log("Error in toc.js:", error.message);
    return Response.error(`Exception: ${error.message}`);
  }
}
```

### 🔄 Handling Pagination (if chapters are split across pages):

```javascript
function execute(url, pageUrl) {
  // Use pageUrl if provided (from page.js), otherwise use main URL
  const targetUrl = pageUrl || url;
  
  Console.log("Fetching chapters from:", targetUrl);
  
  const doc = fetch(targetUrl).html();
  
  // ... extract chapters logic ...
  
  return Response.success(chapters);
}
```

---

## 📖 Step 4: Chapter Content (chap.js)

Tạo `src/chap.js`:

```javascript
/**
 * Get chapter images/pages
 * @param {string} url - Chapter URL from toc.js
 */
function execute(url) {
  Console.log("Fetching chapter content from:", url);
  
  try {
    const response = fetch(url);
    
    if (!response.ok) {
      return Response.error(`HTTP ${response.status}: Could not fetch chapter`);
    }
    
    const doc = response.html();
    
    // Method 1: Extract image URLs from page
    let images = doc.select(".page-image").map(img => {
      return img.attr("data-src") || img.attr("src");
    });
    
    // Method 2: Sometimes images are in JavaScript
    if (images.length === 0) {
      const scriptText = doc.select("script").text();
      const imageRegex = /page_images\s*=\s*\[(.*?)\]/s;
      const match = scriptText.match(imageRegex);
      
      if (match) {
        // Extract URLs from JavaScript array
        const imageArray = match[1].match(/"([^"]+)"/g);
        if (imageArray) {
          images = imageArray.map(url => url.replace(/"/g, ''));
        }
      }
    }
    
    // Method 3: Ajax-loaded images
    if (images.length === 0) {
      const chapterId = url.match(/chapter\/(\d+)/)?.[1];
      if (chapterId) {
        const apiResponse = fetch(`https://manga-demo.com/api/chapter/${chapterId}/images`);
        if (apiResponse.ok) {
          const data = apiResponse.json();
          images = data.images || [];
        }
      }
    }
    
    if (images.length === 0) {
      return Response.error("No images found in chapter");
    }
    
    // Convert relative URLs to absolute
    const absoluteImages = images.map(imgUrl => {
      if (!imgUrl) return '';
      if (imgUrl.startsWith('http')) return imgUrl;
      if (imgUrl.startsWith('//')) return 'https:' + imgUrl;
      if (imgUrl.startsWith('/')) return 'https://manga-demo.com' + imgUrl;
      return 'https://manga-demo.com/' + imgUrl;
    }).filter(url => url); // Remove empty URLs
    
    // Format as HTML for display
    const imageHtml = absoluteImages.map((imgUrl, index) => 
      `<img src="${imgUrl}" alt="Page ${index + 1}" style="width:100%;margin-bottom:5px;">`
    ).join('\n');
    
    Console.log(`Found ${absoluteImages.length} images in chapter`);
    
    return Response.success(imageHtml);
    
  } catch (error) {
    Console.log("Error in chap.js:", error.message);
    return Response.error(`Exception: ${error.message}`);
  }
}
```

### 🖼️ Advanced Image Handling:

```javascript
// Handle lazy-loaded images
function extractLazyImages(doc) {
  return doc.select("img").map(img => {
    return img.attr("data-lazy") || 
           img.attr("data-src") || 
           img.attr("data-original") ||
           img.attr("src");
  }).filter(src => src && !src.includes('placeholder'));
}

// Handle encrypted/obfuscated image URLs
function decryptImageUrl(encryptedUrl) {
  // Implement decryption logic if needed
  // This depends on the specific website's protection method
  return encryptedUrl;
}

// Add image loading optimization
function optimizeImageDisplay(imageUrls) {
  return imageUrls.map((url, index) => `
    <div class="page-container" data-page="${index + 1}">
      <img src="${url}" 
           alt="Page ${index + 1}" 
           loading="lazy"
           style="width:100%;height:auto;margin-bottom:10px;"/>
    </div>
  `).join('\n');
}
```

---

## 🔍 Step 5: Search Function (search.js)

Tạo `src/search.js`:

```javascript
/**
 * Search manga by keyword
 * @param {string} keyword - Search term
 * @param {string} page - Page number for pagination (optional)
 */
function execute(keyword, page) {
  Console.log("Searching for:", keyword, "Page:", page || 1);
  
  try {
    // Build search URL with pagination
    const pageNum = page || 1;
    const searchUrl = `https://manga-demo.com/search?q=${encodeURIComponent(keyword)}&page=${pageNum}`;
    
    const response = fetch(searchUrl);
    
    if (!response.ok) {
      return Response.error(`Search failed: HTTP ${response.status}`);
    }
    
    const doc = response.html();
    
    // Extract search results
    const resultElements = doc.select(".search-results .manga-item");
    
    if (resultElements.length === 0) {
      if (pageNum === 1) {
        return Response.error(`No results found for: ${keyword}`);
      } else {
        return Response.success([]); // Empty page
      }
    }
    
    const results = resultElements.map(element => {
      const link = element.select("a").first();
      const title = link.attr("title") || element.select(".manga-title").text();
      const mangaUrl = link.attr("href");
      const cover = element.select("img").attr("src") || element.select("img").attr("data-src");
      const description = element.select(".manga-summary").text().trim();
      const rating = element.select(".rating").text().trim();
      const status = element.select(".status").text().trim();
      
      // Build absolute URLs
      let absoluteUrl = mangaUrl;
      if (mangaUrl && !mangaUrl.startsWith('http')) {
        absoluteUrl = 'https://manga-demo.com' + mangaUrl;
      }
      
      let absoluteCover = cover;
      if (cover && !cover.startsWith('http')) {
        absoluteCover = 'https://manga-demo.com' + cover;
      }
      
      // Add extra info to description
      let fullDescription = description;
      if (rating || status) {
        fullDescription += `\n${rating ? `Rating: ${rating}` : ''} ${status ? `Status: ${status}` : ''}`.trim();
      }
      
      return {
        name: title.trim(),
        link: absoluteUrl,
        cover: absoluteCover,
        description: fullDescription || "No description available",
        host: "manga-demo.com"
      };
    });
    
    // Check for next page
    const nextPageLink = doc.select(".pagination .next").attr("href");
    let nextPage = null;
    
    if (nextPageLink) {
      // Extract page number from next link
      const nextPageMatch = nextPageLink.match(/page=(\d+)/);
      if (nextPageMatch) {
        nextPage = nextPageMatch[1];
      }
    }
    
    Console.log(`Found ${results.length} results, next page: ${nextPage}`);
    
    return Response.success(results, nextPage);
    
  } catch (error) {
    Console.log("Error in search.js:", error.message);
    return Response.error(`Search exception: ${error.message}`);
  }
}
```

### 🔍 Advanced Search Features:

```javascript
// Handle different search types
function execute(keyword, page, searchType) {
  let searchUrl;
  
  switch(searchType) {
    case 'author':
      searchUrl = `https://manga-demo.com/author-search?author=${encodeURIComponent(keyword)}`;
      break;
    case 'genre':
      searchUrl = `https://manga-demo.com/genre/${encodeURIComponent(keyword)}`;
      break;
    default:
      searchUrl = `https://manga-demo.com/search?q=${encodeURIComponent(keyword)}&page=${page || 1}`;
  }
  
  // ... rest of search logic
}

// Handle advanced search filters
function buildAdvancedSearchUrl(params) {
  const baseUrl = 'https://manga-demo.com/search';
  const queryParams = new URLSearchParams({
    q: params.keyword || '',
    page: params.page || 1,
    status: params.status || '',
    genre: params.genre || '',
    sort: params.sort || 'popularity'
  });
  
  return `${baseUrl}?${queryParams.toString()}`;
}
```

---

## 🏠 Step 6: Home Function (home.js)

Tạo `src/home.js`:

```javascript
/**
 * Get home page categories/sections
 */
function execute() {
  Console.log("Loading home page categories");
  
  try {
    // Return static categories that link to dynamic content scripts
    return Response.success([
      {
        title: "🔥 Hot Updates",
        input: "https://manga-demo.com/latest-updates",
        script: "latest-updates.js"
      },
      {
        title: "⭐ Popular This Week",
        input: "https://manga-demo.com/popular?period=week",
        script: "popular.js"
      },
      {
        title: "🆕 New Releases",
        input: "https://manga-demo.com/new-releases",
        script: "new-releases.js"
      },
      {
        title: "📈 Trending Now",
        input: "https://manga-demo.com/trending",
        script: "trending.js"
      },
      {
        title: "✅ Completed Series",
        input: "https://manga-demo.com/completed",
        script: "completed.js"
      }
    ]);
    
  } catch (error) {
    Console.log("Error in home.js:", error.message);
    return Response.error(`Home page error: ${error.message}`);
  }
}
```

### 📊 Create supporting content scripts:

**`src/latest-updates.js`:**
```javascript
function execute(url, page) {
  const doc = fetch(url + (page ? `?page=${page}` : '')).html();
  
  const updates = doc.select(".latest-manga .manga-item").map(item => ({
    name: item.select(".title").text(),
    link: item.select("a").attr("href"),
    cover: item.select("img").attr("src"),
    description: `Latest: ${item.select(".latest-chapter").text()}`
  }));
  
  const nextPage = doc.select(".pagination .next").length > 0 ? (parseInt(page || 1) + 1) : null;
  
  return Response.success(updates, nextPage);
}
```

---

## 🧪 Step 7: Testing Your Extension

### 🔧 **Setup Testing Environment:**

1. **Start Extension Maker:**
```bash
java -jar ExtensionMaker.jar
```

2. **Connect to phone** (IP từ VBook Developer Mode)

3. **Load extension folder** trong tool

### ✅ **Test Each Function:**

#### Test Detail Function:
```
URL: https://manga-demo.com/manga/12345
Function: detail
Expected Output: Manga info object
```

#### Test TOC Function:
```
URL: https://manga-demo.com/manga/12345  
Function: toc
Expected Output: Array of chapters
```

#### Test Chapter Function:
```
URL: https://manga-demo.com/chapter/67890
Function: chap  
Expected Output: HTML with images
```

#### Test Search Function:
```
Input: "naruto", "1"
Function: search
Expected Output: Search results array
```

### 🐛 **Common Debugging Steps:**

```javascript
// Add debug logs
Console.log("Variable value:", variableName);
Console.log("Element found:", doc.select("selector").length);

// Check response status
const response = fetch(url);
Console.log("Response status:", response.status);
Console.log("Response OK:", response.ok);

// Validate selectors
const elements = doc.select(".my-selector");
Console.log("Elements found:", elements.length);
if (elements.length > 0) {
  Console.log("First element:", elements.first().outerHtml());
}
```

---

## 🚀 Step 8: Advanced Features

### 📄 **Page Function (for multi-page TOC):**

Tạo `src/page.js` nếu chapter list được chia nhiều trang:

```javascript
function execute(url) {
  const doc = fetch(url).html();
  
  const pages = doc.select(".chapter-pagination a").map(link => {
    return link.attr("href");
  });
  
  return Response.success(pages);
}
```

### 🎨 **Genre Function:**

Tạo `src/genre.js`:

```javascript
function execute() {
  const doc = fetch("https://manga-demo.com/genres").html();
  
  const genres = doc.select(".genre-list a").map(link => ({
    title: link.text(),
    input: link.attr("href"),
    script: "genre-content.js"
  }));
  
  return Response.success(genres);
}
```

### 🔒 **Error Handling & Security:**

```javascript
function safeExecute(url) {
  try {
    // Input validation
    if (!url || typeof url !== 'string') {
      return Response.error("Invalid URL provided");
    }
    
    // URL whitelist check
    if (!url.includes('manga-demo.com')) {
      return Response.error("URL not supported");
    }
    
    const response = fetch(url);
    
    // ... rest of logic with proper error handling
    
  } catch (error) {
    // Never expose internal errors to users
    Console.log("Internal error:", error);
    return Response.error("Processing failed. Please try again.");
  }
}
```

---

## 📋 Final Checklist

### ✅ **Before Publishing:**

- [ ] **Tested all functions** với real URLs
- [ ] **Error handling** cho edge cases  
- [ ] **Performance optimization** (minimize HTTP requests)
- [ ] **Clean code** với comments
- [ ] **Icon file** added (128x128px PNG)
- [ ] **plugin.json** validated
- [ ] **Regex pattern** matches target URLs correctly

### 📊 **Extension Quality Metrics:**

| Aspect | Target | Status |
|--------|--------|--------|
| **Load Time** | < 3 seconds | ⏱ |
| **Success Rate** | > 95% | 📊 |
| **Error Handling** | Graceful degradation | 🛡 |
| **Code Quality** | Clean & documented | 📝 |

---

## 🎉 Congratulations!

Bạn đã tạo thành công một comic extension hoàn chỉnh! 

### 📖 **Tiếp theo bạn có thể:**

1. **📚 Làm Novel Extension Tutorial** - [Novel Tutorial](novel-extension.md)
2. **🔍 Học Advanced Features** - [Advanced Tutorial](advanced-features.md)  
3. **🧪 Tìm hiểu Testing** - [Testing Guide](../advanced/testing.md)
4. **🚀 Deploy Extension** - [Deployment Guide](../advanced/deployment.md)

### 🤝 **Chia sẻ với cộng đồng:**
- Fork repo và submit PR với extension mới
- Tạo issue để báo bug hoặc request features
- Chia sẻ tips & tricks trên Discussions

---

<div align="center">

**🎊 Chúc mừng! Bạn đã master Comic Extension Development! 🚀**

**Next:** [📚 Novel Extension](novel-extension.md) **|** [🔍 Advanced Features](advanced-features.md)

---

*📝 Có thắc mắc? [Tạo issue](https://github.com/Vitbupdk/vbook/issues/new) để được hỗ trợ!*

</div>