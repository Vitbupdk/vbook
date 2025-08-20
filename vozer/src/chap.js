function execute(url) {
    let response = fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    });
    
    if (!response.ok) {
        return Response.error('Không thể tải nội dung chương');
    }
    
    let doc = response.html();
    
    // Tìm nội dung với multiple selectors
    let contentSelectors = [
        '.smiley',
        '.content',
        '.chapter-content', 
        '.entry-content',
        '.post-content',
        'article .content'
    ];
    
    let content = '';
    for (let selector of contentSelectors) {
        let contentElement = doc.select(selector).first();
        if (contentElement && contentElement.html().trim()) {
            content = contentElement.html();
            break;
        }
    }
    
    if (!content) {
        return Response.error('Không tìm thấy nội dung chương');
    }
    
    // Clean content
    content = content
        .replace(/\n/gm, '<br>')
        .replace(/&(nbsp|amp|quot|lt|gt|bp|emsp);/g, "")
        .replace(/(<br\s*\/?>( )?){2,}/g, '<br>')
        .replace(/<img[^>]*>/gi, '')
        .replace(/<\/?p[^>]*>/gi, '')
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '');

    return Response.success(content);
}