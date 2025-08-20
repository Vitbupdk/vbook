load('config.js');

function _tx(el, d) { if (d === undefined) d = ''; try { return el ? el.text().trim() : d; } catch (e) { return d; } }
function _attr(el, k, d) { if (d === undefined) d = ''; try { return el ? (el.attr(k) || '').trim() : d; } catch (e) { return d; } }
function _abs(u) { if (!u) return ''; if (u.indexOf('http') === 0) return u; if (u.indexOf('//') === 0) return 'https:' + u; if (u.indexOf('/') === 0) return BASE_URL + u; return BASE_URL + '/' + u; }

function execute() {
    var response = fetch(BASE_URL, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    
    if (!response || !response.ok) {
        return Response.error('Không thể tải thể loại');
    }
    
    var doc = response.html();
    var data = [];
    
    var links = doc.select('.menu-item a, nav a, .category-link, .categories-list a');
    
    for (var i = 0; i < links.size(); i++) {
        var e = links.get(i);
        var title = _tx(e);
        var input = _attr(e, 'href');
        
        if (title && input && input.indexOf('#') === -1 && input.indexOf('javascript:') === -1) {
            data.push({
                title: title,
                input: _abs(input),
                script: 'gen.js'
            });
        }
    }
    
    return Response.success(data);
}
