/* Exercise 8.12 (bài tập mở rộng kèm theo bộ Lab 08):
   thay các danh sách HTML viết tay bằng các hàm JavaScript sinh nội dung
   từ dữ liệu trong travel-data.js (continents, countries, posts). */

/* Danh sách châu lục */
function createContinentList(items) {
    var html = "";
    for (var i = 0; i < items.length; i++) {
        html += '<li class="list-group-item"><a href="#">' + items[i] + '</a></li>';
    }
    return html;
}

/* Danh sách quốc gia; quốc gia được chọn (Canada) hiển thị dạng "active" */
function createCountryList(items, selected) {
    var html = "";
    for (var i = 0; i < items.length; i++) {
        if (items[i] === selected) {
            html += '<li class="list-group-item active">' + items[i] + '</li>';
        } else {
            html += '<li class="list-group-item"><a href="#">' + items[i] + '</a></li>';
        }
    }
    return html;
}

/* Một dòng tóm tắt bài viết */
function createPostSummary(post) {
    var html = '<div class="row">';
    html += '<div class="col-md-2">';
    html += '<a href="post.php?id=' + post.id + '"><img src="../images/travel/' + post.thumb +
            '" alt="' + post.title + '" class="img-thumbnail"/></a>';
    html += '</div>';
    html += '<div class="col-md-10">';
    html += '<h2>' + post.title + '</h2>';
    html += '<div class="details">Posted by ' + post.user +
            '<span class="pull-right">' + post.postdate + '</span></div>';
    html += '<p class="excerpt">' + post.excerpt + '</p>';
    html += '<p><a href="post.php?id=' + post.id + '" class="btn btn-primary btn-sm">Read more</a></p>';
    html += '</div></div><hr/>';
    return html;
}

/* Thanh phân trang: « 1 2 ... n », trang hiện tại là "active" */
function createPagination(total, current) {
    var html = '<li><a href="#">&laquo;</a></li>';
    for (var p = 1; p <= total; p++) {
        html += (p === current)
            ? '<li class="active"><a href="#">' + p + '</a></li>'
            : '<li><a href="#">' + p + '</a></li>';
    }
    html += '<li><a href="#">&raquo;</a></li>';
    return html;
}

function renderPage() {
    document.getElementById("continentList").innerHTML = createContinentList(continents);
    document.getElementById("countryList").innerHTML = createCountryList(countries, "Canada");
    var out = "";
    for (var i = 0; i < posts.length; i++) {
        out += createPostSummary(posts[i]);
    }
    document.getElementById("postList").innerHTML = out;
    document.getElementById("pagination").innerHTML = createPagination(9, 4);
}
