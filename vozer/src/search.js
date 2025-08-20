load('config.js');

// Helper functions (same pattern as gen.js)
function _tx(el, d) { if (d === undefined) d = ''; try { return el ? el.text().trim() : d; } catch (e) { return d; } }
function _attr(el, k, d) { if (d === undefined) d = ''; try { return el ? (el.attr(k) || '').trim() : d; } catch (e) { return d; } }
function _pick(doc, sels) { if (typeof sels === 'string') sels = [sels]; for (var i = 0; i < sels.length; i++) { try { var e = doc.select(sels[i]).first(); if (e) return e; } catch (_) {} } return null; }
function _abs(u) { if (!u) return ''; if (u.indexOf('http') === 0) return u; if (u.indexOf('//') === 0) return 'https:' + u; if (u.indexOf('/') === 0) return BASE_URL + u; return BASE_URL + '/' + u; }
function _cover(s) { if (!s) return ''; var img = s.select('img').first(); if (!img) return ''; var src = _attr(img, 'data-src') || _attr(img, 'data-lazy-src') || _attr(img, 'data-original') || _attr(img, 'srcset'); if (src && src.indexOf(' ') > -1) src = src.split(' ')[0]; if (!src) src = _attr(img, 'src'); return _abs(src); }
function _cleanTitle(t) { if (!t) return ''; return t.replace(/^Chương\s+\d+\s*:?\s*/i, '').trim() || t; }

function execute(key, page) {
    if (!page) page = '1';
    
    var searchUrl = BASE_URL + '/?s=' + encodeURIComponent(key);
    if (parseInt(page, 10) > 1) {
        searchUrl += '&paged=' + page;
    }
    
    var response = fetch(searchUrl, {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    
    if (!response || !response.ok) {
        return Response.error('Không thể tìm kiếm');
    }
    
    var doc = response.html();
    var comiclist = [];
    var seen = {};
    
    var articles = doc.select('article.post, .post-item, .story-item, .search-result, .flex.mb-3.mx-auto');
    if (articles.size() === 0) {
        articles = doc.select('.post, .item, .result');
    }
    
    for (var i = 0; i < articles.size(); i++) {
        try {
            var e = articles.get(i);
            var titleLink = _pick(e, [
                'h2.entry-title a', 'h3.entry-title a', '.post-title a',
                'a[rel="bookmark"]', 'h2 a', 'h3 a'
            ]);
            
            if (!titleLink) continue;
            
            var href = _attr(titleLink, 'href');
            var title = _tx(titleLink);
            
            if (!href || !title) continue;
            
            var fullUrl = _abs(href);
            if (seen[fullUrl]) continue;
            seen[fullUrl] = true;
            
            var cover = _cover(e);
            var descEl = _pick(e, ['.excerpt', '.entry-summary', 'p']);
            var description = _tx(descEl);
            var cleanedTitle = _cleanTitle(title);
            
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
    }
    
    var next = null;
    var nextLink = _pick(doc, [
        'a[rel="next"]', '.pagination a.next', '.nav-links a.next'
    ]);
    
    if (nextLink) {
        var nextHref = _attr(nextLink, 'href');
        if (nextHref) {
            var match = nextHref.match(/paged=(\d+)/);
            next = match ? match[1] : (parseInt(page, 10) + 1).toString();
        }
    }
    
    return Response.success(comiclist, next);
}
