load('config.js');

function _tx(el, d) { if (d === undefined) d = ''; try { return el ? el.text().trim() : d; } catch (e) { return d; } }
function _attr(el, k, d) { if (d === undefined) d = ''; try { return el ? (el.attr(k) || '').trim() : d; } catch (e) { return d; } }
function _html(el, d) { if (d === undefined) d = ''; try { return el ? (el.html() || '').trim() : d; } catch (e) { return d; } }
function _pick(doc, sels) { if (typeof sels === 'string') sels = [sels]; for (var i = 0; i < sels.length; i++) { try { var e = doc.select(sels[i]).first(); if (e) return e; } catch (_) {} } return null; }
function _abs(u) { if (!u) return ''; if (u.indexOf('http') === 0) return u; if (u.indexOf('//') === 0) return 'https:' + u; if (u.indexOf('/') === 0) return BASE_URL + u; return BASE_URL + '/' + u; }
function _cover(s) { if (!s) return ''; var img = s.select('img').first(); if (!img) return ''; var src = _attr(img, 'data-src') || _attr(img, 'data-lazy-src') || _attr(img, 'data-original') || _attr(img, 'srcset'); if (src && src.indexOf(' ') > -1) src = src.split(' ')[0]; if (!src) src = _attr(img, 'src'); return _abs(src); }

function execute(url) {
    var response = fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    
    if (!response || !response.ok) {
        return Response.error('Không thể tải chi tiết truyện');
    }
    
    var doc = response.html();
    
    var nameEl = _pick(doc, [
        'h1.entry-title', 'h2.entry-title', '.post-title', 'h1', '.page-title'
    ]);
    var name = _tx(nameEl, 'Không có tên');
    
    var coverScope = _pick(doc, ['article', '.post', '.entry']) || doc;
    var cover = _cover(coverScope);
    
    var descEl = _pick(doc, [
        '.entry-content p', '.post-content p', '.entry-summary', '.excerpt'
    ]);
    var description = _html(descEl);
    
    var detailEl = _pick(doc, [
        '.entry-meta .author', '.post-meta .author', '.byline'
    ]);
    var detail = _tx(detailEl);
    
    var categoryEl = _pick(doc, [
        '.entry-meta .cat-links a', '.post-categories a', '.category a'
    ]);
    var category = _tx(categoryEl);
    
    return Response.success({
        name: name,
        cover: cover,
        description: description,
        detail: detail,
        category: category,
        host: BASE_URL
    });
}
