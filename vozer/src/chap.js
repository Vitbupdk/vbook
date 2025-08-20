load('config.js');

function _html(el, d) { if (d === undefined) d = ''; try { return el ? (el.html() || '').trim() : d; } catch (e) { return d; } }
function _pick(doc, sels) { if (typeof sels === 'string') sels = [sels]; for (var i = 0; i < sels.length; i++) { try { var e = doc.select(sels[i]).first(); if (e) return e; } catch (_) {} } return null; }

function execute(url) {
    var response = fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    
    if (!response || !response.ok) {
        return Response.error('Không thể tải chương');
    }
    
    var doc = response.html();
    var contentEl = _pick(doc, [
        '.smiley', '.entry-content', '.post-content', '.chapter-content', 'article .entry-content'
    ]);
    
    if (!contentEl) {
        return Response.error('Không tìm thấy nội dung chương');
    }
    
    // Remove unwanted elements
    contentEl.select('script, style, noscript, iframe, .ads, .advertisement, .social-share, .related-posts, [class*="ad-"], [id*="ad-"]').remove();
    
    var content = _html(contentEl);
    
    if (!content) {
        return Response.error('Nội dung chương trống');
    }
    
    // Clean content
    content = content
        .replace(/\n/gm, '<br>')
        .replace(/&(nbsp|amp|quot|lt|gt|bp|emsp);/g, '')
        .replace(/(<br\s*\/?>( )?){2,}/g, '<br>')
        .replace(/<img[^>]*>/gi, '')
        .replace(/<\/?p[^>]*>/gi, '')
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '');
    
    return Response.success(content);
}
