/* Exercise 10.4 - jQuery listeners */

/* Bước 2: phương thức rút gọn click()
$(".panel").click(function() {
    $("#message").html("You clicked in the panel");
});
*/
/* Bước 3: phương thức on()
$(".panel").on("click", function() {
    $("#message").html("You clicked in the panel");
});
*/

// ---- Bước 4-5: document ready + chaining nhiều sự kiện
$(function () {
    // chaining handlers
    $(".panel")
        .on("mousemove", function (e) {
            $("#message").html("x=" + e.pageX + " y=" + e.pageY);
        })
        .on("mouseleave", function (e) {
            $("#message").html("goodbye!");
        })
        .on("click", function () {
            $("#message").html("stopped move reporting");
            $(".panel").off("mousemove");
        });
});
