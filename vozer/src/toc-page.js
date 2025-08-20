load('config.js');

// Helper functions
function _tx(el, d='') { try { return el ? el.text().trim() : d; } catch(e) { return d; } }
function _attr(el, k, d='') { try { return el ? (el.attr(k) || '').trim() : d; } catch(e) { return d; } }
function _pick(doc, sels) { if (typeof sels === 'string') sels = [sels]; for (const s of sels) { try { const e = doc.select(s).first(); if (e) return e; } catch(_) {} } return null; }

function execute(url) {
    let data = [];
    let response = fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    
    if (!response.ok) {
        return Response.error('Không thể tải phân trang mục lục');
    }
    
    let doc = response.html();
    
    // WordPress pagination selectors
    const anchors = doc.select([
        '[role=navigation] a[href*="pagechap="]',
        '.pagination a',
        '.page-numbers'
    ].join(', '));
    
    if (anchors.length === 0) {
        return Response.success([url]);
    }
    
    let lastNumber = 1;
    anchors.forEach(anchor => {
        const href = _attr(anchor, 'href');
        if (href) {
            const match = href.match(/(?:pagechap|page|paged)=(\d+)/);
            if (match) {
                const pageNumber = parseInt(match[1], 10);
                if (!isNaN(pageNumber)) {
                    lastNumber = Math.max(lastNumber, pageNumber);
                }
            }
        }
    });
    
    // Generate page URLs
    for (let i = 1; i <= lastNumber; i++) {
        const separator = url.includes('?') ? '&' : '?';
        data.push(url + separator + 'pagechap=' + i);
    }
    
    return Response.success(data);
}
