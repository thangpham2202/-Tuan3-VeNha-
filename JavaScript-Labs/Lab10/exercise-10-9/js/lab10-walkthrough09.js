/* Exercise 10.9 - GET requests
   Dịch vụ web gốc của tài liệu (randyconnolly.com) có thể không phản hồi,
   nên nếu yêu cầu thất bại sẽ dùng dữ liệu dự phòng ../data/cities.json. */
var url = "https://www.randyconnolly.com/funwebdev/services/travel/cities.php";
var fallbackUrl = "../data/cities.json";

/* Bước 5: dùng $.each() để thêm từng thành phố vào danh sách <ul> */
function showCities(data) {
    $.each(data, function (index, value) {
        var li = $('<li/>').html(value.name);
        li.appendTo("div#results ul");
    });
}

$(function () {
    $("#consume").click(function () {
        $("#results").html("<ul></ul>");

        $.get(url, function (data, status) {
            // Bước 4: chỉ xử lý khi trạng thái là success
            if (status == "success") {
                showCities(data);
            }
        }).fail(function () {
            // Dự phòng khi dịch vụ ngoài không truy cập được
            $.getJSON(fallbackUrl, function (data) {
                showCities(data);
            });
        });
    });
});

/* Bước 3 (phiên bản đầu): in tên thành phố bằng vòng for
$.get(url, function (data, status) {
    var list = "";
    for (var i = 0; i < data.length; i++) {
        list += data[i].name + "<br>";
    }
    $("#results").html(list);
});
*/
