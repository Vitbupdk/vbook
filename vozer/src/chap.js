load('config.js');

// Helper functions
function _tx(el, d='') { try { return el ? el.text().trim() : d; } catch(e) { return d; } }
function _attr(el, k, d='') { try { return el ? (el.attr(k) || '').trim() : d; } catch(e) { return d; } }
function _html(el, d='') { try { return el ? (el.html() || '').trim() : d; } catch(e) { return d; } }
function _pick(doc, sels) { if (typeof sels === 'string') sels = [sels]; for (const s of sels) { try { const e = doc.select(s).first(); if (e) return e; } catch(_) {} } return null; }
function _abs(u) { if (!u) return ''; if (u.startsWith('http')) return u; if (u.startsWith('//')) return 'https:' + u; if (u.startsWith('/')) return BASE_URL + u; return BASE_URL + '/' + u; }

function execute(url) {
    let response = fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    
    if (!response.ok) {
        return Response.error('Không thể tải nội dung chương');
    }
    
    let doc = response.html();
    
    // Multiple selectors cho content
    let contentEl = _pick(doc, [
        '.smiley',                    // Original selector
        '.entry-content',
        '.post-content', 
        '.chapter-content',
        'article .entry-content'
    ]);
    
    if (!contentEl) {
        return Response.error('Không tìm thấy nội dung chương');
    }
    
    // Remove unwanted elements
    contentEl.select('script, style, noscript, iframe, .ads, .advertisement, .social-share, .related-posts, [class*="ad-"], [id*="ad-"]').remove();
    
    let content = _html(contentEl);
    
    if (!content) {
        return Response.error('Nội dung chương trống');
    }
    
    // Clean content
    content = content
        .replace(/\n/gm, '<br>')
        .replace(/&(nbsp|amp|quot|lt|gt|bp|emsp);/g, "")
        .replace(/(<br\s*\/?>( )?){2,}/g, '<br>')
        .replace(/<img[^>]*>/gi, '')
        .replace(/<\/?p[^>]*>/gi, '')
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '');
    
    // Navigation links
    const nextEl = _pick(doc, [
        'a[rel="next"]',
        'a.next-post',
        '.nav-next a'
    ]);
    
    const prevEl = _pick(doc, [
        'a[rel="prev"]', 
        'a.prev-post',
        '.nav-previous a'
    ]);
    
    const nextUrl = _abs(_attr(nextEl, 'href'));
    const prevUrl = _abs(_attr(prevEl, 'href'));
    
    return Response.success(content, nextUrl, prevUrl);
}
