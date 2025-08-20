load('config.js');

// Helper functions
function _tx(el, d='') { try { return el ? el.text().trim() : d; } catch(e) { return d; } }
function _attr(el, k, d='') { try { return el ? (el.attr(k) || '').trim() : d; } catch(e) { return d; } }
function _pick(doc, sels) { if (typeof sels === 'string') sels = [sels]; for (const s of sels) { try { const e = doc.select(s).first(); if (e) return e; } catch(_) {} } return null; }
function _abs(u) { if (!u) return ''; if (u.startsWith('http')) return u; if (u.startsWith('//')) return 'https:' + u; if (u.startsWith('/')) return BASE_URL + u; return BASE_URL + '/' + u; }
function _chapterNum(url) { if (!url) return 0; const match = url.match(/chuong-(\d+)/i); return match ? parseInt(match[1], 10) : 0; }

function execute(url) {
    const response = fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    
    if (!response.ok) {
        return Response.error('Không thể tải mục lục');
    }
    
    let doc = response.html();
    const data = [];
    const seen = {};
    
    // Multiple selectors cho chapter links
    let chapList = doc.select([
        'table.w-full.mb-5 tr td a',  // Original selector
        '.chapter-list a',
        '.toc a',
        'a[href*="/chuong-"]',
        '.entry-content a[href*="/chuong-"]'
    ].join(', '));
    
    for (let j = 0; j < chapList.size(); j++) {
        let element = chapList.get(j);
        const name = _tx(element);
        const href = _attr(element, 'href');
        
        if (name && href) {
            const fullUrl = _abs(href);
            if (seen[fullUrl]) continue;
            seen[fullUrl] = true;
            
            data.push({
                name: name,
                url: fullUrl,
                host: BASE_URL
            });
        }
    }
    
    // Sort chapters by number
    data.sort((a, b) => _chapterNum(a.url) - _chapterNum(b.url));
    
    // Fallback nếu không tìm thấy chapters
    if (data.length === 0) {
        if (url.match(/\/chuong-\d+/i)) {
            const currentTitle = _tx(_pick(doc, ['h1.entry-title', 'h2.entry-title']), 'Chương hiện tại');
            data.push({
                name: currentTitle,
                url: url,
                host: BASE_URL
            });
        } else {
            data.push({
                name: 'Bắt đầu đọc',
                url: url,
                host: BASE_URL
            });
        }
    }
    
    return Response.success(data);
}
