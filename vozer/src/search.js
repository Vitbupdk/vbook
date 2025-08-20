load('config.js');

function execute(key, page) {
    if (!page) page = '1';
    
    // URL search mới
    let searchUrl = BASE_URL + '/?s=' + encodeURIComponent(key);
    if (page > 1) {
        searchUrl += '&paged=' + page;
    }
    
    let response = fetch(searchUrl, {
        method: "GET",
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8'
        }
    });
    
    if (response.ok) {
        let doc = response.html();
        let comiclist = [];
        
        // Sử dụng logic tương tự gen.js
        let results = doc.select('article, .search-result, .story-item');
        
        if (results.size() === 0) {
            results = doc.select('.post, .item, .result');
        }
        
        results.forEach(e => {
            try {
                let titleElement = e.select('a[href*="/"]').first();
                if (!titleElement) return;
                
                let title = titleElement.text().trim();
                let link = titleElement.attr('href');
                
                if (!title || !link) return;
                
                // Đảm bảo link đầy đủ
                if (!link.startsWith('http')) {
                    link = link.startsWith('/') ? BASE_URL + link : BASE_URL + '/' + link;
                }
                
                let cover = '';
                let imgElement = e.select('img').first();
                if (imgElement) {
                    cover = imgElement.attr('data-src') || 
                           imgElement.attr('src') || '';
                    if (cover && !cover.startsWith('http')) {
                        cover = cover.startsWith('/') ? BASE_URL + cover : BASE_URL + '/' + cover;
                    }
                }
                
                comiclist.push({
                    name: title,
                    link: link,
                    cover: cover,
                    description: '',
                    host: BASE_URL
                });
                
            } catch (error) {
                console.log('Search error:', error);
            }
        });
        
        // Tìm next page
        let next = null;
        try {
            let nextElement = doc.select('.next, .pagination a[rel="next"]').first();
            if (nextElement) {
                let nextHref = nextElement.attr('href');
                if (nextHref) {
                    let pageMatch = nextHref.match(/paged[=\/](\d+)/);
                    if (pageMatch) {
                        next = pageMatch[1];
                    }
                }
            }
        } catch (error) {
            // Ignore
        }
        
        return Response.success(comiclist, next);
    }
    
    return Response.error('Không thể tìm kiếm. Vui lòng thử lại.');
}