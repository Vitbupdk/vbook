load('config.js');

// Helper functions
function _tx(el, d='') { try { return el ? el.text().trim() : d; } catch(e) { return d; } }
function _attr(el, k, d='') { try { return el ? (el.attr(k) || '').trim() : d; } catch(e) { return d; } }
function _pick(doc, sels) { if (typeof sels === 'string') sels = [sels]; for (const s of sels) { try { const e = doc.select(s).first(); if (e) return e; } catch(_) {} } return null; }
function _abs(u) { if (!u) return ''; if (u.startsWith('http')) return u; if (u.startsWith('//')) return 'https:' + u; if (u.startsWith('/')) return BASE_URL + u; return BASE_URL + '/' + u; }
function _cover(scope) { if (!scope) return ''; const img = scope.select('img').first(); if (!img) return ''; let src = _attr(img, 'data-src') || _attr(img, 'data-lazy-src') || _attr(img, 'data-original') || _attr(img, 'srcset'); if (src && src.includes(' ')) src = src.split(' ')[0]; if (!src) src = _attr(img, 'src'); return _abs(src); }
function _cleanTitle(title) { if (!title) return ''; return title.replace(/^Chương\s+\d+\s*:?\s*/i, '').trim() || title; }

function execute(url, page) {
    if (!page) page = '1';
    
    let response = fetch(url, {
        method: "GET",
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8'
        },
        queries: {
            page: page,
            paged: page // WordPress pagination
        }
    });
    
    if (response.ok) {
        let doc = response.html();
        let comiclist = [];
        let seen = {};
        
        // WordPress post selectors với fallbacks
        let articles = doc.select('article.post, .post-item, .story-item, .entry');
        
        // Fallback nếu không tìm thấy
        if (articles.size() === 0) {
            articles = doc.select('.post, .item, .card, .story');
        }
        
        articles.forEach(e => {
            try {
                // Tìm title link với multiple selectors
                const titleLink = _pick(e, [
                    'h2.entry-title a',
                    'h3.entry-title a', 
                    '.post-title a',
                    '.story-title a',
                    'a[rel="bookmark"]',
                    'h2 a',
                    'h3 a'
                ]);
                
                if (!titleLink) return;
                
                const href = _attr(titleLink, 'href');
                const title = _tx(titleLink);
                
                if (!href || !title) return;
                
                // Skip non-story pages
                if (href.includes('/the-loai/') || 
                    href.includes('/lien-he') || 
                    href.includes('/thong-bao') || 
                    href.includes('/terms-of-service') ||
                    href.includes('/tag/') ||
                    href.includes('/category/')) return;
                
                const fullUrl = _abs(href);
                if (seen[fullUrl]) return;
                seen[fullUrl] = true;
                
                // Get cover image với lazy loading support
                const cover = _cover(e);
                
                // Get description
                const descEl = _pick(e, ['.excerpt', '.entry-summary', '.description', 'p']);
                const description = _tx(descEl);
                
                // Clean title
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
        
        // Pagination với multiple selectors
        let next = null;
        const nextLink = _pick(doc, [
            'a[rel="next"]',
            '.pagination a.next',
            '.nav-links a.next',
            '.page-numbers.next'
        ]);
        
        if (nextLink) {
            const nextHref = _attr(nextLink, 'href');
            if (nextHref) {
                const match = nextHref.match(/(?:page|paged)=(\d+)/);
                if (match) {
                    next = match[1];
                } else {
                    // Fallback: increment current page
                    next = (parseInt(page, 10) + 1).toString();
                }
            }
        }
        
        return Response.success(comiclist, next);
    }
    
    return Response.error('Không thể tải danh sách truyện');
}
