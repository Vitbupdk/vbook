load('config.js');

function _attr(el, k, d) { if (d === undefined) d = ''; try { return el ? (el.attr(k) || '').trim() : d; } catch (e) { return d; } }

function execute(url) {
    var data = [];
    var response = fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    
    if (!response || !response.ok) {
        return Response.success([url]);
    }
    
    var doc = response.html();
    var anchors = doc.select('[role=navigation] a[href*="pagechap="], .pagination a, .page-numbers');
    
    if (anchors.length === 0) {
        return Response.success([url]);
    }
    
    var lastNumber = 1;
    for (var i = 0; i < anchors.size(); i++) {
        var href = _attr(anchors.get(i), 'href');
        if (href) {
            var match = href.match(/(?:pagechap|page|paged)=(\d+)/);
            if (match) {
                var pageNumber = parseInt(match[1], 10);
                if (!isNaN(pageNumber)) {
                    lastNumber = Math.max(lastNumber, pageNumber);
                }
            }
        }
    }
    
    for (var p = 1; p <= lastNumber; p++) {
        var separator = url.indexOf('?') > -1 ? '&' : '?';
        data.push(url + separator + 'pagechap=' + p);
    }
    
    return Response.success(data);
}
