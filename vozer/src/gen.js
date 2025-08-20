load('config.js');

// Helper functions (copy từ trên)

function execute(url, page) {
    if (!page) page = '1';

    var res = fetch(url, {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
            'Referer': BASE_URL + '/',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8'
        },
        queries: { page: page, paged: page }
    });

    if (!res || !res.ok) {
        return Response.error('Không thể kết nối: ' + url + ' (Status: ' + (res ? res.code : 'null') + ')');
    }

    var doc = res.html();
    var list = [];
    var seen = {};

    // Debug: Check if we got valid HTML
    var pageTitle = _tx(doc.select('title').first(), 'No title');
    if (pageTitle === 'No title') {
        return Response.error('Trang trả về HTML không hợp lệ, có thể bị chặn');
    }

    // 1) WordPress standard selectors
    var rows = doc.select('article.post, .post, .entry');
    
    // 2) Vozer specific selectors  
    if (rows.size() === 0) {
        rows = doc.select('.container .mb-3 .mx-auto .flex, .flex.mb-3.mx-auto');
    }
    
    // 3) Generic fallback
    if (rows.size() === 0) {
        rows = doc.select('.story-item, .novel-item, .book-item, .item');
    }

    // 4) Last resort: find any containers with story links
    if (rows.size() === 0) {
        var allLinks = doc.select('a[href]');
        var storyContainers = [];
        for (var l = 0; l < allLinks.size(); l++) {
            var link = allLinks.get(l);
            var href = _attr(link, 'href');
            var text = _tx(link);
            if (href && text && text.length > 5 && !_isBad(href)) {
                var parent = link.parent();
                if (parent && !seen[href]) {
                    seen[href] = true;
                    storyContainers.push({
                        element: parent,
                        link: link,
                        href: href,
                        text: text
                    });
                }
            }
        }
        
        // Convert to comic list
        for (var st = 0; st < Math.min(storyContainers.length, 15); st++) {
            var story = storyContainers[st];
            list.push({
                name: _cleanTitle(story.text),
                link: _abs(story.href),
                cover: _cover(story.element),
                description: '',
                host: BASE_URL
            });
        }
        
        if (list.length > 0) {
            return Response.success(list, null);
        }
        
        return Response.error('Không tìm thấy truyện. Page title: ' + pageTitle);
    }

    // Process found articles
    for (var i = 0; i < rows.size(); i++) {
        var e = rows.get(i);

        var a = _pick(e, ['h2.entry-title a', 'h3.entry-title a', '.post-title a', '.story-title a', 'a[rel=bookmark]', 'h2 a', 'h3 a']);
        if (!a) a = _pick(e, ['a']); // fallback

        var href = _attr(a, 'href');
        var name = _tx(a);

        if (!href || !name || _isBad(href)) continue;

        var full = _abs(href);
        if (seen[full]) continue;
        seen[full] = true;

        var cover = _cover(e);
        var desc = _tx(_pick(e, ['.excerpt', '.entry-summary', 'p', '.description']));

        list.push({
            name: _cleanTitle(name),
            link: full,
            cover: cover,
            description: desc,
            host: BASE_URL
        });
    }

    // Pagination
    var next = null;
    var nextLink = _pick(doc, ['a[rel=next]', '.pagination a.next', '.nav-links a.next', '.page-numbers.next', '.my-5 nav a']);
    if (nextLink) {
        var nh = _attr(nextLink, 'href');
        if (nh) {
            var m = nh.match(/(?:page|paged)=(\d+)/);
            next = m ? m[1] : (parseInt(page, 10) + 1).toString();
        }
    }

    if (list.length === 0) {
        return Response.error('Không tìm thấy truyện. Found ' + rows.size() + ' articles. Page: ' + pageTitle);
    }

    return Response.success(list, next);
}
