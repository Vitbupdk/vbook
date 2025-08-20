load('config.js');

function execute(url, page) {
    if (!page) page = '1';
    
    // Thêm headers để bypass protection
    let response = fetch(url, {
        method: "GET",
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        },
        queries: {
            page: page
        }
    });
    
    if (response.ok) {
        let doc = response.html();
        let comiclist = [];
        
        // Selectors mới dựa trên cấu trúc hiện tại
        let novels = doc.select('article, .story-item, .novel-item, .post-item');
        
        // Fallback selectors nếu không tìm thấy
        if (novels.size() === 0) {
            novels = doc.select('.story, .novel, .post, .item');
        }
        
        // Fallback cuối cùng - tìm theo pattern link
        if (novels.size() === 0) {
            novels = doc.select('a[href*="/"]').parent();
        }
        
        novels.forEach(e => {
            try {
                // Tìm title link với multiple selectors
                let titleElement = e.select('a[href*="/"]').first();
                if (!titleElement) return;
                
                let title = titleElement.text().trim();
                let link = titleElement.attr('href');
                
                if (!title || !link) return;
                
                // Skip các link không phải truyện
                if (link.includes('javascript:') || 
                    link.includes('mailto:') || 
                    link.includes('#') ||
                    link.length < 5) return;
                
                // Đảm bảo link đầy đủ
                if (!link.startsWith('http')) {
                    if (link.startsWith('/')) {
                        link = BASE_URL + link;
                    } else {
                        link = BASE_URL + '/' + link;
                    }
                }
                
                // Tìm ảnh bìa
                let cover = '';
                let imgElement = e.select('img').first();
                if (imgElement) {
                    cover = imgElement.attr('data-src') || 
                           imgElement.attr('data-lazy-src') ||
                           imgElement.attr('src') || '';
                    
                    if (cover && !cover.startsWith('http')) {
                        if (cover.startsWith('/')) {
                            cover = BASE_URL + cover;
                        } else {
                            cover = BASE_URL + '/' + cover;
                        }
                    }
                }
                
                // Tìm mô tả
                let description = '';
                let descElement = e.select('p, .description, .summary').first();
                if (descElement) {
                    description = descElement.text().trim();
                }
                
                comiclist.push({
                    name: title,
                    link: link,
                    cover: cover,
                    description: description,
                    host: BASE_URL
                });
                
            } catch (error) {
                // Log error nhưng không dừng vòng lặp
                console.log('Error processing element:', error);
            }
        });
        
        // Tìm next page
        let next = null;
        try {
            let nextElement = doc.select('a[rel="next"], .next, .pagination a').last();
            if (nextElement) {
                let nextHref = nextElement.attr('href');
                if (nextHref) {
                    let pageMatch = nextHref.match(/page[=\/](\d+)/);
                    if (pageMatch) {
                        next = pageMatch[1];
                    }
                }
            }
        } catch (error) {
            // Ignore pagination errors
        }
        
        return Response.success(comiclist, next);
    }
    
    return Response.error('Không thể tải trang web. Vui lòng thử lại sau.');
}