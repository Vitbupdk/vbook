load('config.js');

function execute(url) {
    let response = fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    });
    
    if (!response.ok) {
        return Response.error('Không thể tải trang truyện');
    }
    
    let doc = response.html();
    
    // Tìm title với multiple selectors
    let name = '';
    let titleSelectors = ['h1', '.title', '.story-title', '.novel-title', '.entry-title'];
    for (let selector of titleSelectors) {
        let titleElement = doc.select(selector).first();
        if (titleElement && titleElement.text().trim()) {
            name = titleElement.text().trim();
            break;
        }
    }
    
    // Tìm ảnh bìa
    let cover = '';
    let coverSelectors = ['.cover img', '.thumbnail img', '.story-cover img', 'img'];
    for (let selector of coverSelectors) {
        let imgElement = doc.select(selector).first();
        if (imgElement) {
            cover = imgElement.attr('data-src') || 
                   imgElement.attr('src') || '';
            if (cover) {
                if (!cover.startsWith('http')) {
                    cover = cover.startsWith('/') ? BASE_URL + cover : BASE_URL + '/' + cover;
                }
                break;
            }
        }
    }
    
    // Tìm mô tả
    let description = '';
    let descSelectors = ['.description', '.summary', '.story-desc', '.content p'];
    for (let selector of descSelectors) {
        let descElement = doc.select(selector).first();
        if (descElement && descElement.text().trim()) {
            description = descElement.text().trim();
            if (description.length > 500) {
                description = description.substring(0, 500) + '...';
            }
            break;
        }
    }
    
    return Response.success({
        name: name || 'Không có tên',
        cover: cover,
        description: description,
        detail: description,
        category: '',
        host: BASE_URL
    });
}