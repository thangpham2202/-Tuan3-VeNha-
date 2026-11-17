/* Exercise 10.6 - Simple jQuery animation */
$(function () {
    // Bước 2: fade in 1000 ms
    $("#btnFadeIn").click(function () {
        $("figure").fadeIn(1000);
    });
    // Bước 3: fade out 1000 ms
    $("#btnFadeOut").click(function () {
        $("figure").fadeOut(1000);
    });
    // Bước 4: bật/tắt fade
    $("#btnFade").click(function () {
        $("figure").fadeToggle(500);
    });
    // Bước 5: các hiệu ứng slide
    $("#btnSlideDown").click(function () {
        $("figure").slideDown("slow");
    });
    $("#btnSlideUp").click(function () {
        $("figure").slideUp("slow");
    });
    $("#btnSlide").click(function () {
        $("figure").slideToggle(2000);
    });
});
