load('config.js');

function execute(url) {
    let response = fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    });
    
    if (!response.ok) {
        return Response.error('Không thể tải danh sách chương');
    }
    
    let doc = response.html();
    const data = [];
    
    // Tìm danh sách chương với multiple selectors
    let chapSelectors = [
        'table tr td a',
        '.chapter-list a',
        '.toc a',
        'a[href*="chuong"]',
        'a[href*="chapter"]'
    ];
    
    let chapList = null;
    for (let selector of chapSelectors) {
        chapList = doc.select(selector);
        if (chapList.size() > 0) break;
    }
    
    if (chapList && chapList.size() > 0) {
        for (let j = 0; j < chapList.size(); j++) {
            let element = chapList.get(j);
            let title = element.text().trim();
            let link = element.attr("href");
            
            if (title && link) {
                if (!link.startsWith('http')) {
                    link = link.startsWith('/') ? BASE_URL + link : BASE_URL + '/' + link;
                }
                
                data.push({
                    name: title,
                    url: link,
                    host: BASE_URL
                });
            }
        }
    }
    
    // Nếu không tìm thấy chương nào, thử tìm link đầu tiên
    if (data.length === 0) {
        let firstChapter = doc.select('a[href*="/"]').first();
        if (firstChapter) {
            let link = firstChapter.attr('href');
            if (link && !link.startsWith('http')) {
                link = link.startsWith('/') ? BASE_URL + link : BASE_URL + '/' + link;
            }
            data.push({
                name: 'Bắt đầu đọc',
                url: link,
                host: BASE_URL
            });
        }
    }
    
    return Response.success(data);
}