load('config.js');

// Helper functions (same as gen.js)
function _tx(el, d='') { try { return el ? el.text().trim() : d; } catch(e) { return d; } }
function _attr(el, k, d='') { try { return el ? (el.attr(k) || '').trim() : d; } catch(e) { return d; } }
function _pick(doc, sels) { if (typeof sels === 'string') sels = [sels]; for (const s of sels) { try { const e = doc.select(s).first(); if (e) return e; } catch(_) {} } return null; }
function _abs(u) { if (!u) return ''; if (u.startsWith('http')) return u; if (u.startsWith('//')) return 'https:' + u; if (u.startsWith('/')) return BASE_URL + u; return BASE_URL + '/' + u; }
function _cover(scope) { if (!scope) return ''; const img = scope.select('img').first(); if (!img) return ''; let src = _attr(img, 'data-src') || _attr(img, 'data-lazy-src') || _attr(img, 'data-original') || _attr(img, 'srcset'); if (src && src.includes(' ')) src = src.split(' ')[0]; if (!src) src = _attr(img, 'src'); return _abs(src); }
function _cleanTitle(title) { if (!title) return ''; return title.replace(/^Chương\s+\d+\s*:?\s*/i, '').trim() || title; }

function execute(key, page) {
    if (!page) page = '1';
    
    // WordPress search URL
    let searchUrl = BASE_URL + '/?s=' + encodeURIComponent(key);
    if (page > 1) {
        searchUrl += '&paged=' + page;
    }
    
    let response = fetch(searchUrl, {
        method: "GET",
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
    });
    
    if (response.ok) {
        let doc = response.html();
        let comiclist = [];
        let seen = {};
        
        // Same logic as gen.js for consistency
        let articles = doc.select('article.post, .post-item, .story-item, .search-result');
        
        if (articles.size() === 0) {
            articles = doc.select('.post, .item, .result');
        }
        
        articles.forEach(e => {
            try {
                const titleLink = _pick(e, [
                    'h2.entry-title a',
                    'h3.entry-title a', 
                    '.post-title a',
                    'a[rel="bookmark"]',
                    'h2 a', 'h3 a'
                ]);
                
                if (!titleLink) return;
                
                const href = _attr(titleLink, 'href');
                const title = _tx(titleLink);
                
                if (!href || !title) return;
                
                const fullUrl = _abs(href);
                if (seen[fullUrl]) return;
                seen[fullUrl] = true;
                
                const cover = _cover(e);
                const descEl = _pick(e, ['.excerpt', '.entry-summary', 'p']);
                const description = _tx(descEl);
                const cleanedTitle = _cleanTitle(title);
                
                comiclist.push({
                    name: cleanedTitle,
                    link: fullUrl,
                    cover: cover,
                    description: description,
                    host: BASE_URL
                });
                
            } catch (error) {
                // Continue on error
            }
        });
        
        // Pagination
        let next = null;
        const nextLink = _pick(doc, [
            'a[rel="next"]',
            '.pagination a.next', 
            '.nav-links a.next'
        ]);
        
        if (nextLink) {
            const nextHref = _attr(nextLink, 'href');
            if (nextHref) {
                const match = nextHref.match(/paged=(\d+)/);
                next = match ? match[1] : (parseInt(page, 10) + 1).toString();
            }
        }
        
        return Response.success(comiclist, next);
    }
    
    return Response.error('Không thể tìm kiếm');
}
