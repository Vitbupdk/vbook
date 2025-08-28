#!/usr/bin/env node

/**
 * Auto-fix script for VBook Extensions
 * Tự động sửa các vấn đề phổ biến trong extensions
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class VBookExtensionFixer {
    constructor() {
        this.fixes = {
            baseUrlAdded: 0,
            consoleLogsRemoved: 0,
            httpFixedToHttps: 0,
            errorHandlingAdded: 0
        };
        
        // Mapping các extensions với baseUrl của chúng
        this.baseUrlMapping = {
            'misskon': 'https://misskon.com',
            '69shu': 'https://www.69shuba.com', 
            'baozimh': 'https://www.baozimh.com',
            'CManga': 'https://cmangax3.com',
            'CosplayTele': 'https://cosplaytele.com',
            'ManhwaHentai': 'https://manhwahentai.me',
            'nhentai': 'https://nhentai.net',
            'Sáng Tác Việt': 'https://sangtacviet.app',
            'Vozer': 'https://vozer.vn',
            'Tiên Vực': 'https://tienvuc.info',
            'Vozer 1': 'https://vozer.vn'
        };
    }

    // Tìm tất cả extensions
    findExtensions() {
        console.log('🔍 Tìm kiếm extensions để fix...');
        
        try {
            const output = execSync('find . -name "plugin.json" -type f', { encoding: 'utf8' });
            const pluginPaths = output.trim().split('\n').filter(path => path && path !== './plugin.json');
            
            console.log(`✅ Tìm thấy ${pluginPaths.length} extensions để fix:`);
            pluginPaths.forEach((pluginPath, index) => {
                console.log(`   ${index + 1}. ${pluginPath}`);
            });
            
            return pluginPaths;
        } catch (error) {
            console.error('❌ Lỗi khi tìm kiếm extensions:', error.message);
            return [];
        }
    }

    // Fix missing baseUrl
    fixMissingBaseUrl(pluginPath) {
        try {
            const pluginContent = fs.readFileSync(pluginPath, 'utf8');
            const plugin = JSON.parse(pluginContent);
            
            if (plugin.metadata && !plugin.metadata.baseUrl) {
                const extensionName = plugin.metadata.name;
                const baseUrl = this.baseUrlMapping[extensionName] || plugin.metadata.source;
                
                if (baseUrl) {
                    plugin.metadata.baseUrl = baseUrl;
                    fs.writeFileSync(pluginPath, JSON.stringify(plugin, null, 2));
                    console.log(`   ✅ Đã thêm baseUrl cho ${extensionName}: ${baseUrl}`);
                    this.fixes.baseUrlAdded++;
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error(`   ❌ Lỗi fix baseUrl cho ${pluginPath}:`, error.message);
            return false;
        }
    }

    // Remove console.log statements
    removeConsoleLogs(filePath) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            let original = content;
            
            // Remove console.log statements
            content = content.replace(/\s*console\.log\([^)]*\);?\n?/g, '');
            
            if (content !== original) {
                fs.writeFileSync(filePath, content);
                console.log(`   ✅ Đã xóa console.log() trong ${path.basename(filePath)}`);
                this.fixes.consoleLogsRemoved++;
                return true;
            }
            return false;
        } catch (error) {
            console.error(`   ❌ Lỗi xóa console.log trong ${filePath}:`, error.message);
            return false;
        }
    }

    // Fix HTTP to HTTPS
    fixHttpToHttps(filePath) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            let original = content;
            
            // Replace HTTP with HTTPS in URLs (but not in comments)
            content = content.replace(/(?<!\/\/)http:\/\//g, 'https://');
            
            if (content !== original) {
                fs.writeFileSync(filePath, content);
                console.log(`   ✅ Đã sửa HTTP thành HTTPS trong ${path.basename(filePath)}`);
                this.fixes.httpFixedToHttps++;
                return true;
            }
            return false;
        } catch (error) {
            console.error(`   ❌ Lỗi sửa HTTP trong ${filePath}:`, error.message);
            return false;
        }
    }

    // Add basic error handling to fetch calls
    addBasicErrorHandling(filePath) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            let original = content;
            
            // Check if file already has try/catch
            if (content.includes('try') && content.includes('catch')) {
                return false; // Already has error handling
            }

            // Simple pattern to add try/catch around fetch calls
            const fetchPattern = /fetch\([^)]+\)/g;
            const matches = content.match(fetchPattern);
            
            if (matches && !content.includes('try')) {
                // Wrap entire function content in try/catch if it has fetch calls
                const functionPattern = /function\s+execute\s*\([^)]*\)\s*\{([\s\S]*)\}/;
                const match = content.match(functionPattern);
                
                if (match) {
                    const functionBody = match[1];
                    const wrappedBody = `
    try {${functionBody}
    } catch (error) {
        return Response.error("Network error: " + error.message);
    }`;
                    
                    content = content.replace(functionPattern, `function execute($1) {${wrappedBody}}`);
                    
                    if (content !== original) {
                        fs.writeFileSync(filePath, content);
                        console.log(`   ✅ Đã thêm error handling cho ${path.basename(filePath)}`);
                        this.fixes.errorHandlingAdded++;
                        return true;
                    }
                }
            }
            
            return false;
        } catch (error) {
            console.error(`   ❌ Lỗi thêm error handling cho ${filePath}:`, error.message);
            return false;
        }
    }

    // Fix một extension
    fixExtension(pluginPath) {
        console.log(`\n🔧 Fixing: ${pluginPath}`);
        
        // Fix missing baseUrl
        this.fixMissingBaseUrl(pluginPath);
        
        // Fix JavaScript files trong src/
        const extensionDir = path.dirname(pluginPath);
        const srcDir = path.join(extensionDir, 'src');
        
        if (fs.existsSync(srcDir)) {
            const jsFiles = fs.readdirSync(srcDir)
                .filter(file => file.endsWith('.js'))
                .map(file => path.join(srcDir, file));
            
            jsFiles.forEach(jsFile => {
                // Skip encoded/obfuscated files
                const content = fs.readFileSync(jsFile, 'utf8');
                if (this.isEncodedContent(content)) {
                    console.log(`   ⏭️  Bỏ qua file đã encode: ${path.basename(jsFile)}`);
                    return;
                }
                
                // Apply fixes
                this.removeConsoleLogs(jsFile);
                this.fixHttpToHttps(jsFile);
                // Thêm error handling chỉ cho extensions không có encoded files
                // this.addBasicErrorHandling(jsFile);
            });
        }
    }

    // Check if content is encoded
    isEncodedContent(content) {
        const encodedPatterns = [
            /x0P[12]Xx/g,
            /^[A-Za-z0-9+/=]{100,}/,
            /^[0-9a-f]{100,}/,
            /[A-Z0-9]{20,}/g
        ];

        return encodedPatterns.some(pattern => pattern.test(content));
    }

    // Main fix function
    async runFixes() {
        console.log('🚀 Bắt đầu auto-fix VBook Extensions...\n');

        const pluginPaths = this.findExtensions();

        for (const pluginPath of pluginPaths) {
            this.fixExtension(pluginPath);
        }

        this.generateFixReport();
    }

    // Generate fix report
    generateFixReport() {
        console.log('\n' + '='.repeat(80));
        console.log('📋 BÁO CÁO AUTO-FIX VBOOK EXTENSIONS');
        console.log('='.repeat(80));

        console.log(`\n📈 TỔNG KẾT FIXES:`);
        console.log(`   • BaseUrl đã thêm: ${this.fixes.baseUrlAdded}`);
        console.log(`   • Console.log đã xóa: ${this.fixes.consoleLogsRemoved}`);
        console.log(`   • HTTP thành HTTPS: ${this.fixes.httpFixedToHttps}`);
        console.log(`   • Error handling đã thêm: ${this.fixes.errorHandlingAdded}`);

        const totalFixes = Object.values(this.fixes).reduce((a, b) => a + b, 0);
        console.log(`   • TỔNG FIXES: ${totalFixes}`);

        if (totalFixes > 0) {
            console.log(`\n🎯 Khuyến nghị:`);
            console.log(`   1. Chạy lại debug script để xác nhận fixes`);
            console.log(`   2. Test thực tế với VBook app`);
            console.log(`   3. Commit các thay đổi`);
        } else {
            console.log(`\n✅ Không có gì cần fix!`);
        }
    }
}

// Run the fixer
if (require.main === module) {
    const fixer = new VBookExtensionFixer();
    fixer.runFixes().catch(console.error);
}

module.exports = VBookExtensionFixer;