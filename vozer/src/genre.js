load('config.js');

// Helper functions (copy từ trên)

function execute() {
    // 1) Thử lấy từ menu website
    var res = fetch(BASE_URL, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
    });

    var data = [];
    if (res && res.ok) {
        var doc = res.html();
        var links = doc.select('.menu a, nav a, .menu-item a, .categories a, .category-link');
        for (var i = 0; i < links.size(); i++) {
            var e = links.get(i);
            var t = _tx(e);
            var h = _attr(e, 'href');
            if (!t || !h) continue;
            if (h.indexOf('/the-loai/') > -1) { // Chỉ lấy thể loại
                data.push({ title: t, input: _abs(h), script: 'gen.js' });
            }
        }
        if (data.length > 0) return Response.success(data);
    }

    // 2) Fallback: danh mục tĩnh (khớp với vozer.vn)
    data = [
        { title: 'Truyện Voz', input: BASE_URL + '/the-loai/truyen-voz', script: 'gen.js' },
        { title: 'Tâm Linh', input: BASE_URL + '/the-loai/tam-linh', script: 'gen.js' },
        { title: 'Ngôn Tình', input: BASE_URL + '/the-loai/ngon-tinh', script: 'gen.js' },
        { title: 'Bí Ẩn', input: BASE_URL + '/the-loai/bi-an', script: 'gen.js' },
        { title: 'Kinh Dị', input: BASE_URL + '/the-loai/kinh-di', script: 'gen.js' },
        { title: 'Hài Hước', input: BASE_URL + '/the-loai/hai-huoc', script: 'gen.js' },
        { title: 'Kiếm Hiệp', input: BASE_URL + '/the-loai/kiem-hiep', script: 'gen.js' },
        { title: 'Tiên Hiệp', input: BASE_URL + '/the-loai/tien-hiep', script: 'gen.js' },
        { title: 'Giới Thiệu', input: BASE_URL + '/the-loai/gioi-thieu', script: 'gen.js' }
    ];
    return Response.success(data);
}
