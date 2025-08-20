load('config.js');

// Helper functions ES5
function _tx(el, d) {
    if (d === undefined) d = '';
    try { return el ? el.text().trim() : d; } catch (e) { return d; }
}
function _attr(el, k, d) {
    if (d === undefined) d = '';
    try { return el ? (el.attr(k) || '').trim() : d; } catch (e) { return d; }
}
function _pick(doc, sels) {
    if (typeof sels === 'string') sels = [sels];
    for (var i = 0; i < sels.length; i++) {
        try { var e = doc.select(sels[i]).first(); if (e) return e; } catch (_) {}
    }
    return null;
}
function _abs(u) {
    if (!u) return '';
    if (u.indexOf('http') === 0) return u;
    if (u.indexOf('//') === 0) return 'https:' + u;
    if (u.indexOf('/') === 0) return BASE_URL + u;
    return BASE_URL + '/' + u;
}
function _cover(scope) {
    if (!scope) return '';
    var img = scope.select('img').first();
    if (!img) return '';
    var src = _attr(img, 'data-src') || _attr(img, 'data-lazy-src') || 
              _attr(img, 'data-original') || _attr(img, 'srcset');
    if (src && src.indexOf(' ') > -1) src = src.split(' ')[0];
    if (!src) src = _attr(img, 'src');
    return _abs(src);
}
function _cleanTitle(t) {
    if (!t) return '';
    return t.replace(/^Chương\s+\d+\s*:?\s*/i, '').trim() || t;
}

function execute(url, page) {
    if (!page) page = '1';
    
    var response = fetch(url, {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        queries: {
            page: page,
            paged: page
        }
    });
    
    if (!response || !response.ok) {
        return Response.error('Không thể tải danh sách truyện');
    }
    
    var doc = response.html();
    var comiclist = [];
    var seen = {};
    
    // WordPress post selectors với fallbacks
    var articles = doc.select('article.post, .post-item, .story-item, .entry, .flex.mb-3.mx-auto');
    if (articles.size() === 0) {
        articles = doc.select('.post, .item, .card, .story');
    }
    
    // Traditional for loop thay vì forEach
    for (var i = 0; i < articles.size(); i++) {
        try {
            var e = articles.get(i);
            var titleLink = _pick(e, [
                'h2.entry-title a', 'h3.entry-title a', '.post-title a',
                '.story-title a', 'a[rel="bookmark"]', 'h2 a', 'h3 a'
            ]);
            
            if (!titleLink) continue;
            
            var href = _attr(titleLink, 'href');
            var title = _tx(titleLink);
            
            if (!href || !title) continue;
            
            // Skip non-story pages
            if (href.indexOf('/the-loai/') > -1 || 
                href.indexOf('/lien-he') > -1 || 
                href.indexOf('/thong-bao') > -1 || 
                href.indexOf('/terms-of-service') > -1 ||
                href.indexOf('/tag/') > -1 ||
                href.indexOf('/category/') > -1) continue;
            
            var fullUrl = _abs(href);
            if (seen[fullUrl]) continue;
            seen[fullUrl] = true;
            
            var cover = _cover(e);
            var descEl = _pick(e, ['.excerpt', '.entry-summary', '.description', 'p']);
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
    
    // Pagination
    var next = null;
    var nextLink = _pick(doc, [
        'a[rel="next"]', '.pagination a.next', '.nav-links a.next', '.page-numbers.next'
    ]);
    
    if (nextLink) {
        var nextHref = _attr(nextLink, 'href');
        if (nextHref) {
            var match = nextHref.match(/(?:page|paged)=(\d+)/);
            next = match ? match[1] : (parseInt(page, 10) + 1).toString();
        }
    }
    
    return Response.success(comiclist, next);
}
