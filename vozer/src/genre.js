load('config.js');

// Helper functions
function _tx(el, d='') { try { return el ? el.text().trim() : d; } catch(e) { return d; } }
function _attr(el, k, d='') { try { return el ? (el.attr(k) || '').trim() : d; } catch(e) { return d; } }
function _pick(doc, sels) { if (typeof sels === 'string') sels = [sels]; for (const s of sels) { try { const e = doc.select(s).first(); if (e) return e; } catch(_) {} } return null; }
function _abs(u) { if (!u) return ''; if (u.startsWith('http')) return u; if (u.startsWith('//')) return 'https:' + u; if (u.startsWith('/')) return BASE_URL + u; return BASE_URL + '/' + u; }

function execute() {
    let response = fetch(BASE_URL, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });

    if (response.ok) {
        let doc = response.html();
        const data = [];
        
        // WordPress menu selectors
        doc.select('.menu-item a, nav a, .category-link').forEach(e => {
           const title = _tx(e);
           const input = _attr(e, 'href');
           if (title && input && !input.includes('#') && !input.includes('javascript:')) {
               data.push({
                   title: title,
                   input: _abs(input),
                   script: 'gen.js'
               });
           }
        });
        return Response.success(data);
    }
    return Response.error('Không thể tải thể loại truyện');
}
