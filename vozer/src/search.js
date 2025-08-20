load('config.js');

// Helper functions (copy từ trên)

function execute(key, page) {
    if (!page) page = '1';
    
    var searchUrl = BASE_URL + '/?s=' + encodeURIComponent(key);
    if (parseInt(page, 10) > 1) {
        searchUrl += '&paged=' + page;
    }
    
    var response = fetch(searchUrl, {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
    });
    
    if (!response || !response.ok) {
        return Response.error('Không thể tìm kiếm: ' + searchUrl);
    }
    
    var doc = response.html();
    var comiclist = [];
    var seen = {};
    
    // Same logic as gen.js for consistency
    var articles = doc.select('article.post, .post-item, .story-item, .search-result');
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
            
            if (!href || !title || _isBad(href)) continue;
            
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
            continue;
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
    
    if (comiclist.length === 0) {
        return Response.error('Không tìm thấy kết quả cho: ' + key);
    }
    
    return Response.success(comiclist, next);
}
