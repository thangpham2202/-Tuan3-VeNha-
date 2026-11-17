/* Exercise 10.10 - jqXHR handling */
var url = "https://www.randyconnolly.com/funwebdev/services/travel/cities.php";
var fallbackUrl = "../data/cities.json";

function showCities(data) {
    $.each(data, function (index, value) {
        var li = $('<li/>').html(value.name);
        li.appendTo("div#results ul");
    });
}

$(function () {
    $('.animLoading').hide();

    $("#consume").click(function () {
        $('.animLoading').show();
        $("#results").html("<ul></ul>");

        $.get(url)
            // done will happen first
            .done(function (data) {
                showCities(data);
            })
            // if error occurs will execute, but before always()
            .fail(function (xhr, status, error) {
                alert("failed loading data - status=" + status + " error=" + error);
                // dùng dữ liệu dự phòng để trang vẫn hiển thị kết quả
                $.getJSON(fallbackUrl, function (data) { showCities(data); });
            })
            // always should be last
            .always(function (data) {
                $('.animLoading').fadeOut("slow");
            });
    });
});
