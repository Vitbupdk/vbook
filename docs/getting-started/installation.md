# ⚡ Installation Guide

<div align="center">

![Installation](https://img.shields.io/badge/⚙️-Installation-blue?style=for-the-badge)
![Time](https://img.shields.io/badge/⏰-15_Minutes-orange?style=for-the-badge)
![Difficulty](https://img.shields.io/badge/🎯-Beginner-green?style=for-the-badge)

**Hướng dẫn cài đặt chi tiết cho VBook Extensions Development**

</div>

---

## 📋 Tổng quan

Hướng dẫn này sẽ giúp bạn:
- 🔧 Cài đặt môi trường phát triển hoàn chỉnh
- 📱 Kết nối VBook App với development tools
- 💻 Thiết lập VSCode extension (khuyến nghị)
- 🧪 Verify installation hoạt động đúng

---

## 📋 System Requirements

### 💻 **Máy tính (Windows/Mac/Linux)**

| Component | Requirement | Recommended |
|-----------|-------------|-------------|
| **Java** | 1.8+ | OpenJDK 11+ |
| **Node.js** | 14+ | 18+ LTS |
| **VSCode** | Latest | + Extensions |
| **Git** | 2.20+ | Latest |
| **RAM** | 4GB+ | 8GB+ |
| **Storage** | 1GB free | 2GB+ free |

### 📱 **Mobile Device**

| Component | Requirement | Notes |
|-----------|-------------|-------|
| **VBook App** | Latest version | Download từ store |
| **Android** | 7.0+ | iOS support coming |
| **Network** | WiFi | Cùng mạng với PC |
| **Storage** | 100MB free | Cho extensions |

---

## 🔧 Chi tiết cài đặt

### 1️⃣ **Cài đặt Java Development Kit**

#### Windows:
```powershell
# Option 1: Chocolatey (khuyến nghị)
choco install openjdk11

# Option 2: Manual download
# Tải từ: https://adoptium.net/
# Cài đặt và set JAVA_HOME
```

#### macOS:
```bash
# Option 1: Homebrew (khuyến nghị)
brew install openjdk@11

# Option 2: Manual download
# Tải từ: https://adoptium.net/
```

#### Linux (Ubuntu/Debian):
```bash
# Update package list
sudo apt update

# Install OpenJDK 11
sudo apt install openjdk-11-jdk

# Verify installation
java -version
javac -version
```

#### ✅ **Verify Java Installation:**
```bash
java -version
# Output expected:
# openjdk version "11.0.x" 2023-xx-xx
# OpenJDK Runtime Environment (build 11.0.x+x)
```

### 2️⃣ **Cài đặt Node.js & npm**

#### All Platforms:
```bash
# Download từ: https://nodejs.org/
# Chọn LTS version (khuyến nghị)

# Verify installation
node --version  # v18.x.x or higher
npm --version   # 8.x.x or higher
```

#### Alternative - Using Version Manager:
```bash
# Windows: Chocolatey
choco install nodejs

# macOS: Homebrew  
brew install node

# Linux: NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3️⃣ **Clone Repository & Dependencies**

```bash
# Clone repository
git clone https://github.com/Vitbupdk/vbook.git
cd vbook

# Install dependencies
npm install

# Verify structure
ls -la
# Should see: ExtensionMaker.jar, package.json, docs/, etc.
```

### 4️⃣ **Cài đặt VSCode & Extensions**

#### Download VSCode:
- **Website**: https://code.visualstudio.com/
- **Platform**: Chọn OS phù hợp

#### Required Extensions:
```bash
# Mở VSCode trong project
code .

# Install extensions via Command Palette (Ctrl+Shift+P)
# Search: "Extensions: Install Extensions"
```

**Essential Extensions:**
- 🔧 **VBook Extension Maker** - [Download](https://github.com/faea726/vbook-extension-maker/releases/latest)
- 📝 **JavaScript (ES6) code snippets**
- 🎨 **Prettier - Code formatter**  
- 🔍 **ESLint**
- 📋 **Markdown All in One**

#### Manual VBook Extension Installation:
1. **Download** `.vsix` file từ [releases page](https://github.com/faea726/vbook-extension-maker/releases/latest)
2. **Open VSCode** → Extensions → `...` menu → **Install from VSIX**
3. **Select** file đã download
4. **Reload** VSCode

---

## 📱 VBook App Setup

### 1️⃣ **Download VBook App**

| Platform | Store | Notes |
|----------|-------|-------|
| **Android** | Google Play Store | Tìm "VBook" |
| **iOS** | App Store | Coming soon |
| **APK** | GitHub Releases | Beta versions |

### 2️⃣ **Enable Developer Mode**

#### Step-by-step:
1. **Mở VBook App**
2. **Vào Settings** (⚙️ icon)
3. **Scroll xuống** tìm "Version" hoặc "About"
4. **Tap 7 lần** vào version number
5. **Developer options xuất hiện**
6. **Enable "Developer Mode"**
7. **Ghi lại IP address** (ví dụ: `192.168.1.100:8080`)

#### Visual Guide:
```
Settings ──► About ──► Version (tap 7x) ──► Developer Options
    ⚙️         ℹ️           🔢                    🛠
```

### 3️⃣ **Network Configuration**

#### Ensure Same Network:
```bash
# Check PC IP
ipconfig        # Windows
ifconfig        # macOS/Linux
ip addr show    # Linux alternative

# Phone và PC phải cùng subnet
# Ví dụ: PC: 192.168.1.50, Phone: 192.168.1.100
```

#### Firewall Settings:
- **Windows**: Allow Java through Windows Defender
- **macOS**: Allow incoming connections for Java
- **Linux**: Configure iptables if needed

---

## 🧪 Testing Installation

### 1️⃣ **Test Java Extension Maker**

```bash
# Navigate to project directory
cd /path/to/vbook

# Run Extension Maker
java -jar ExtensionMaker.jar

# Should open GUI tool
# Enter phone IP: 192.168.1.100:8080
```

### 2️⃣ **Test VSCode Extension**

1. **Open VSCode** trong project folder
2. **Mở file** `5in1/src/detail.js`
3. **Right-click** → **VBook: Test Detail Function**
4. **Nhập URL**: https://sangtacviet.com/truyen/12345
5. **Verify** output returned

### 3️⃣ **Test Connection với Phone**

```javascript
// Test script - save as test.js
function execute() {
    return Response.success("Hello from VBook Extension!");
}

// Run in VSCode with VBook extension
// Expected: "Hello from VBook Extension!" in output
```

---

## 🔧 Troubleshooting Common Issues

### ❌ **Java không tìm thấy**
```bash
# Check JAVA_HOME
echo $JAVA_HOME

# Set JAVA_HOME nếu cần
export JAVA_HOME=/path/to/java
# Hoặc thêm vào ~/.bashrc / ~/.zshrc
```

### ❌ **ExtensionMaker.jar không chạy**
```bash
# Check file exists
ls -la ExtensionMaker.jar

# Try với full java path
/usr/bin/java -jar ExtensionMaker.jar

# Check Java version compatibility  
java -version
```

### ❌ **VSCode extension không hoạt động**
1. **Restart VSCode** hoàn toàn
2. **Check extension** đã enable chưa
3. **Reload window**: Ctrl+Shift+P → "Developer: Reload Window"
4. **Check console**: Help → Toggle Developer Tools

### ❌ **Không kết nối được với phone**
```bash
# Check phone IP
ping 192.168.1.100

# Check port accessibility
telnet 192.168.1.100 8080

# Verify phone developer mode enabled
# Try different IP:port combination
```

### ❌ **Extensions không load**
- ✅ Check `plugin.json` syntax
- ✅ Verify file paths trong `plugin.json`
- ✅ Ensure `src/` folder exists
- ✅ Check JavaScript syntax errors

---

## 🚀 Next Steps

### ✅ **Installation hoàn tất! Bây giờ bạn có thể:**

1. **📖 Tạo extension đầu tiên**  
   → [First Extension Tutorial](first-extension.md)

2. **📚 Tìm hiểu API chi tiết**  
   → [Core API Reference](../api-reference/core-api.md)

3. **💡 Xem examples thực tế**  
   → [Extension Examples](../examples/)

4. **🎮 Làm tutorials**  
   → [Comic Extension](../tutorials/comic-extension.md)

---

## 📦 Optional Tools

### 🔧 **Additional Development Tools**

```bash
# Postman - API testing
# Download: https://www.postman.com/

# HTTPie - Command line HTTP client
pip install httpie

# jq - JSON processor
# macOS: brew install jq
# Ubuntu: sudo apt install jq

# Chrome DevTools - Browser debugging
# Built into Chrome/Edge
```

### 📝 **Recommended VSCode Settings**

Create `.vscode/settings.json`:
```json
{
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "editor.formatOnSave": true,
    "files.autoSave": "afterDelay",
    "eslint.autoFixOnSave": true,
    "prettier.singleQuote": true,
    "prettier.trailingComma": "es5"
}
```

---

## 📞 Support & Help

### 🆘 **Cần trợ giúp?**

- 🐛 **Installation issues**: [Create issue](https://github.com/Vitbupdk/vbook/issues/new)
- 💬 **General questions**: [Discussions](https://github.com/Vitbupdk/vbook/discussions)  
- 📚 **Documentation**: [Wiki](../README.md)
- ❓ **FAQ**: [Common Questions](../troubleshooting/faq.md)

### 🔗 **Useful Links**

- 📱 [VBook App Download](#)
- 🛠 [VSCode Extension](https://github.com/faea726/vbook-extension-maker)
- 🧪 [Test Extensions](../examples/)
- 📖 [API Documentation](../api-reference/)

---

<div align="center">

**✅ Installation hoàn tất! Chào mừng đến với VBook Extensions! 🎉**

**Tiếp theo:** [🚀 First Extension Tutorial](first-extension.md)

---

*📝 Gặp khó khăn? [Tạo issue](https://github.com/Vitbupdk/vbook/issues/new) để được hỗ trợ ngay!*

</div>