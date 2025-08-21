function execute(url) 
{
    // get id
    var res = fetch(url)
    if (!res.ok) {
        return null
    }

    let id = res.html().select("body").attr("class")
    id = id.match(/postid-(\d+)/)[1]

    // get html
    res = fetch('https://manhwahentai.me/wp-admin/admin-ajax.php', {
        method: "POST",
        body: {
            "action": "ajax_chap",
            "post_id": id
        }
    })
    if (!res.ok) {
        return null
    }

    let doc = res.html()
    var el = doc.select(".wp-manga-chapter > a")
    var data = [];

    for (var i = el.size() - 1; i >= 0; i--) {
        var e = el.get(i);

        data.push({
            name: e.select("a").text(),
            url: e.attr("href"),
            host: "https://manhwahentai.me"
        })
    }

    return Response.success(data);
}
