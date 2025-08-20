load('config.js');

function _tx(el, d) { if (d === undefined) d = ''; try { return el ? el.text().trim() : d; } catch (e) { return d; } }
function _attr(el, k, d) { if (d === undefined) d = ''; try { return el ? (el.attr(k) || '').trim() : d; } catch (e) { return d; } }
function _pick(doc, sels) { if (typeof sels === 'string') sels = [sels]; for (var i = 0; i < sels.length; i++) { try { var e = doc.select(sels[i]).first(); if (e) return e; } catch (_) {} } return null; }
function _abs(u) { if (!u) return ''; if (u.indexOf('http') === 0) return u; if (u.indexOf('//') === 0) return 'https:' + u; if (u.indexOf('/') === 0) return BASE_URL + u; return BASE_URL + '/' + u; }
function _chapterNum(u) { if (!u) return 0; var m = u.match(/chuong-(\d+)/i); return m ? parseInt(m[1], 10) : 0; }

function execute(url) {
    var response = fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    
    if (!response || !response.ok) {
        return Response.error('Không thể tải mục lục');
    }
    
    var doc = response.html();
    var data = [];
    var seen = {};
    
    var chapList = doc.select('table.w-full.mb-5 tr td a, .chapter-list a, .toc a, a[href*="/chuong-"], .entry-content a[href*="/chuong-"]');
    
    for (var j = 0; j < chapList.size(); j++) {
        var element = chapList.get(j);
        var name = _tx(element);
        var href = _attr(element, 'href');
        
        if (name && href) {
            var fullUrl = _abs(href);
            if (seen[fullUrl] || !fullUrl.match(/chuong-\d+/i)) continue;
            seen[fullUrl] = true;
            
            data.push({
                name: name,
                url: fullUrl,
                host: BASE_URL
            });
        }
    }
    
    // Sort chapters
    data.sort(function(a, b) {
        return _chapterNum(a.url) - _chapterNum(b.url);
    });
    
    // Fallback
    if (data.length === 0) {
        data.push({
            name: 'Bắt đầu đọc',
            url: url,
            host: BASE_URL
        });
    }
    
    return Response.success(data);
}
