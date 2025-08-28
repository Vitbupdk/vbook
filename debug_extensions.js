#!/usr/bin/env node

/**
 * VBook Extensions Debug & Test Script
 * Kiểm tra lỗi trong các extension scripts
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class VBookExtensionDebugger {
    constructor() {
        this.extensions = [];
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            errors: []
        };
    }

    // Tìm tất cả plugin.json files
    findExtensions() {
        console.log('🔍 Đang tìm kiếm extensions...');
        
        try {
            const output = execSync('find . -name "plugin.json" -type f', { encoding: 'utf8' });
            const pluginPaths = output.trim().split('\n').filter(path => path);
            
            console.log(`✅ Tìm thấy ${pluginPaths.length} extensions:`);
            pluginPaths.forEach((pluginPath, index) => {
                console.log(`   ${index + 1}. ${pluginPath}`);
            });
            
            return pluginPaths;
        } catch (error) {
            console.error('❌ Lỗi khi tìm kiếm extensions:', error.message);
            return [];
        }
    }

    // Phân tích một plugin.json file
    analyzePlugin(pluginPath) {
        try {
            const pluginContent = fs.readFileSync(pluginPath, 'utf8');
            const plugin = JSON.parse(pluginContent);

            // Bỏ qua file plugin.json chính của repo (danh sách extensions)
            if (pluginPath === './plugin.json' && plugin.data && Array.isArray(plugin.data)) {
                return {
                    path: pluginPath,
                    name: 'Extensions Repository Config',
                    author: plugin.metadata?.author || 'Unknown',
                    version: 'N/A',
                    description: 'File cấu hình danh sách extensions',
                    encrypted: false,
                    plugin: plugin,
                    errors: [],
                    warnings: ['Đây là file cấu hình repository, không phải extension plugin']
                };
            }
            
            const extension = {
                path: pluginPath,
                dir: path.dirname(pluginPath),
                name: plugin.metadata?.name || 'Unknown',
                author: plugin.metadata?.author || 'Unknown', 
                version: plugin.metadata?.version || 'Unknown',
                description: plugin.metadata?.description || '',
                encrypted: plugin.encrypt === true,
                plugin: plugin,
                errors: [],
                warnings: []
            };

            // Kiểm tra cấu trúc cơ bản
            this.validatePluginStructure(extension);
            
            // Kiểm tra scripts nếu không encrypted
            if (!extension.encrypted) {
                this.validateScripts(extension);
            } else {
                extension.warnings.push('Extension sử dụng encrypted scripts - không thể phân tích chi tiết code');
                // Kiểm tra cơ bản có tồn tại src directory
                const srcDir = path.join(extension.dir, 'src');
                if (fs.existsSync(srcDir)) {
                    const jsFiles = fs.readdirSync(srcDir).filter(file => file.endsWith('.js'));
                    extension.warnings.push(`Tìm thấy ${jsFiles.length} encrypted JavaScript files trong src/`);
                } else {
                    extension.errors.push('Không tìm thấy thư mục src/ cho encrypted extension');
                }
            }

            return extension;
        } catch (error) {
            return {
                path: pluginPath,
                name: 'ERROR',
                errors: [`Lỗi parse plugin.json: ${error.message}`]
            };
        }
    }

    // Validate plugin structure
    validatePluginStructure(extension) {
        const plugin = extension.plugin;

        // Kiểm tra metadata
        if (!plugin.metadata) {
            extension.errors.push('Thiếu metadata section');
        } else {
            if (!plugin.metadata.name) extension.errors.push('Thiếu metadata.name');
            if (!plugin.metadata.author) extension.warnings.push('Thiếu metadata.author');
            if (!plugin.metadata.version) extension.warnings.push('Thiếu metadata.version');
        }

        // Kiểm tra script definitions
        if (!plugin.script) {
            extension.errors.push('Thiếu script definitions');
        } else {
            const requiredMethods = ['home', 'detail', 'search'];
            requiredMethods.forEach(method => {
                if (!plugin.script[method]) {
                    extension.errors.push(`Thiếu script.${method} method`);
                }
            });
        }

        // Kiểm tra baseUrl
        if (plugin.metadata && !plugin.metadata.baseUrl) {
            extension.warnings.push('Thiếu metadata.baseUrl');
        }
    }

    // Validate JavaScript files
    validateScripts(extension) {
        const srcDir = path.join(extension.dir, 'src');
        
        if (!fs.existsSync(srcDir)) {
            extension.errors.push('Không tìm thấy thư mục src/');
            return;
        }

        try {
            const jsFiles = fs.readdirSync(srcDir).filter(file => file.endsWith('.js'));
            
            if (jsFiles.length === 0) {
                extension.warnings.push('Không có JavaScript files trong src/');
                return;
            }

            console.log(`   📄 Kiểm tra ${jsFiles.length} JavaScript files...`);

            jsFiles.forEach(jsFile => {
                const jsPath = path.join(srcDir, jsFile);
                this.validateJavaScriptFile(extension, jsPath);
            });

        } catch (error) {
            extension.errors.push(`Lỗi đọc thư mục src: ${error.message}`);
        }
    }

    // Validate individual JavaScript file
    validateJavaScriptFile(extension, jsPath) {
        try {
            const jsContent = fs.readFileSync(jsPath, 'utf8');
            const fileName = path.basename(jsPath);

            // Bỏ qua kiểm tra syntax cho encrypted extensions
            if (extension.encrypted) {
                extension.warnings.push(`${fileName} - File đã được encrypt, bỏ qua kiểm tra syntax`);
                return;
            }

            // Kiểm tra nếu file có vẻ như đã được encode (chứa nhiều ký tự random)
            if (this.isEncodedContent(jsContent)) {
                extension.warnings.push(`${fileName} - File có vẻ đã được encode/obfuscated, bỏ qua kiểm tra syntax`);
                return;
            }

            // Kiểm tra syntax errors bằng cách eval trong sandbox
            try {
                // Tạo một sandbox environment đơn giản
                const Function = global.Function;
                new Function(jsContent);
            } catch (syntaxError) {
                extension.errors.push(`${fileName}: Syntax error - ${syntaxError.message}`);
            }

            // Kiểm tra common patterns và issues
            this.checkCommonIssues(extension, fileName, jsContent);

        } catch (error) {
            extension.errors.push(`Lỗi đọc file ${path.basename(jsPath)}: ${error.message}`);
        }
    }

    // Check if content appears to be encoded/obfuscated
    isEncodedContent(content) {
        // Kiểm tra các patterns của encoded content
        const encodedPatterns = [
            /x0P[12]Xx/g, // Pattern như trong các file đã decode
            /^[A-Za-z0-9+/=]{100,}/, // Base64-like pattern
            /^[0-9a-f]{100,}/, // Hex pattern
            /[A-Z0-9]{20,}/g // Random uppercase + numbers
        ];

        return encodedPatterns.some(pattern => pattern.test(content));
    }

    // Check for common coding issues
    checkCommonIssues(extension, fileName, jsContent) {
        const lines = jsContent.split('\n');

        lines.forEach((line, index) => {
            const lineNum = index + 1;

            // Check for common selectors issues
            if (line.includes('querySelector') || line.includes('querySelectorAll')) {
                if (line.includes('null') && !line.includes('!==') && !line.includes('!=')) {
                    extension.warnings.push(`${fileName}:${lineNum} - Có thể cần kiểm tra null cho querySelector`);
                }
            }

            // Check for fetch without error handling
            if (line.includes('fetch(') && !jsContent.includes('catch')) {
                extension.warnings.push(`${fileName}:${lineNum} - fetch() không có error handling`);
            }

            // Check for console.log (should be removed in production)
            if (line.includes('console.log')) {
                extension.warnings.push(`${fileName}:${lineNum} - Có console.log() (nên xóa trong production)`);
            }

            // Check for hardcoded URLs that might break
            if (line.includes('http://')) {
                extension.warnings.push(`${fileName}:${lineNum} - Sử dụng HTTP thay vì HTTPS`);
            }
        });

        // Check for missing error handling patterns
        if (!jsContent.includes('try') && !jsContent.includes('catch')) {
            extension.warnings.push(`${fileName} - Không có error handling (try/catch)`);
        }
    }

    // Run complete analysis
    async runAnalysis() {
        console.log('🚀 Bắt đầu phân tích VBook Extensions...\n');

        const pluginPaths = this.findExtensions();
        this.results.total = pluginPaths.length;

        console.log('\n📊 Phân tích từng extension...\n');

        for (const pluginPath of pluginPaths) {
            console.log(`🔍 Analyzing: ${pluginPath}`);
            const extension = this.analyzePlugin(pluginPath);
            this.extensions.push(extension);

            if (extension.errors.length === 0) {
                this.results.passed++;
                console.log(`   ✅ ${extension.name} - OK`);
            } else {
                this.results.failed++;
                console.log(`   ❌ ${extension.name} - Có lỗi`);
            }

            if (extension.warnings.length > 0) {
                console.log(`   ⚠️  ${extension.warnings.length} warnings`);
            }
        }

        this.generateReport();
    }

    // Generate detailed report
    generateReport() {
        console.log('\n' + '='.repeat(80));
        console.log('📋 BÁO CÁO PHÂN TÍCH VBOOK EXTENSIONS');
        console.log('='.repeat(80));

        console.log(`\n📈 TỔNG QUAN:`);
        console.log(`   • Tổng số extensions: ${this.results.total}`);
        console.log(`   • Passed: ${this.results.passed} ✅`);
        console.log(`   • Failed: ${this.results.failed} ❌`);
        console.log(`   • Success rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);

        // Chi tiết từng extension
        this.extensions.forEach((ext, index) => {
            console.log(`\n${index + 1}. 📦 ${ext.name}`);
            console.log(`   📍 Path: ${ext.path}`);
            console.log(`   👤 Author: ${ext.author}`);
            console.log(`   🔢 Version: ${ext.version}`);
            console.log(`   🔒 Encrypted: ${ext.encrypted ? 'Yes' : 'No'}`);

            if (ext.errors && ext.errors.length > 0) {
                console.log(`   ❌ ERRORS (${ext.errors.length}):`);
                ext.errors.forEach(error => console.log(`      • ${error}`));
            }

            if (ext.warnings && ext.warnings.length > 0) {
                console.log(`   ⚠️  WARNINGS (${ext.warnings.length}):`);
                ext.warnings.forEach(warning => console.log(`      • ${warning}`));
            }

            if ((!ext.errors || ext.errors.length === 0) && (!ext.warnings || ext.warnings.length === 0)) {
                console.log(`   ✅ Không có vấn đề`);
            }
        });

        // Lưu report ra file
        this.saveReportToFile();

        console.log(`\n💾 Chi tiết report đã được lưu vào: extension-debug-report.json`);
        console.log('🎯 Recommendations:');
        console.log('   1. Sửa các lỗi ERRORS trước');
        console.log('   2. Xem xét các WARNINGS để cải thiện code quality');
        console.log('   3. Thêm error handling và validation cho các extensions');
        console.log('   4. Test thực tế với VBook app');
    }

    // Save detailed report to JSON file
    saveReportToFile() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: this.results,
            extensions: this.extensions.map(ext => ({
                name: ext.name,
                path: ext.path,
                author: ext.author,
                version: ext.version,
                encrypted: ext.encrypted,
                description: ext.description,
                errors: ext.errors || [],
                warnings: ext.warnings || [],
                status: (ext.errors && ext.errors.length > 0) ? 'FAILED' : 'PASSED'
            }))
        };

        fs.writeFileSync('extension-debug-report.json', JSON.stringify(report, null, 2));
    }
}

// Run the debugger
if (require.main === module) {
    const extensionDebugger = new VBookExtensionDebugger();
    extensionDebugger.runAnalysis().catch(console.error);
}

module.exports = VBookExtensionDebugger;