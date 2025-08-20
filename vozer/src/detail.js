load('config.js');

// Helper functions
function _tx(el, d='') { try { return el ? el.text().trim() : d; } catch(e) { return d; } }
function _attr(el, k, d='') { try { return el ? (el.attr(k) || '').trim() : d; } catch(e) { return d; } }
function _html(el, d='') { try { return el ? (el.html() || '').trim() : d; } catch(e) { return d; } }
function _pick(doc, sels) { if (typeof sels === 'string') sels = [sels]; for (const s of sels) { try { const e = doc.select(s).first(); if (e) return e; } catch(_) {} } return null; }
function _abs(u) { if (!u) return ''; if (u.startsWith('http')) return u; if (u.startsWith('//')) return 'https:' + u; if (u.startsWith('/')) return BASE_URL + u; return BASE_URL + '/' + u; }
function _cover(scope) { if (!scope) return ''; const img = scope.select('img').first(); if (!img) return ''; let src = _attr(img, 'data-src') || _attr(img, 'data-lazy-src') || _attr(img, 'data-original') || _attr(img, 'srcset'); if (src && src.includes(' ')) src = src.split(' ')[0]; if (!src) src = _attr(img, 'src'); return _abs(src); }

function execute(url) {
    const response = fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    
    if (!response.ok) {
        return Response.error('Không thể tải chi tiết truyện');
    }
    
    const doc = response.html();
    
    // Get title với WordPress selectors
    const nameEl = _pick(doc, [
        'h1.entry-title',
        'h2.entry-title', 
        '.post-title',
        'h1',
        '.page-title'
    ]);
    const name = _tx(nameEl, 'Không có tên');
    
    // Get cover image
    const cover = _cover(doc.select('article, .post, .entry').first() || doc);
    
    // Get description
    const descEl = _pick(doc, [
        '.entry-content p',
        '.post-content p',
        '.entry-summary',
        '.excerpt'
    ]);
    const description = _html(descEl);
    
    // Get author/detail info
    const detailEl = _pick(doc, [
        '.entry-meta .author',
        '.post-meta .author',
        '.byline'
    ]);
    const detail = _tx(detailEl);
    
    // Get category
    const categoryEl = _pick(doc, [
        '.entry-meta .cat-links a',
        '.post-categories a',
        '.category a'
    ]);
    const category = _tx(categoryEl);
    
    return Response.success({
        name: name,
        cover: cover,
        description: description,
        detail: detail,
        category: category,
        host: BASE_URL
    });
}
