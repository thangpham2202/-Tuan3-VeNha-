/* Exercise 9.4 - Simple event handling */

// ---- Bước 5-6: xử lý click, ẩn/hiện đoạn văn với hiệu ứng CSS3 + setTimeout
function simpleHandler(event) {
    var content = document.getElementById("content");
    if (btn.innerHTML == "Hide") {
        btn.innerHTML = "Show";
        content.className = "makeItDisappear";
        // change the display mode after a 1000 millisecond delay
        setTimeout(function () {
            content.style.display = "none";
        }, 1000);
    }
    else {
        btn.innerHTML = "Hide";
        content.style.display = "block";

        // change the class after a 500 millisecond delay
        setTimeout(function () {
            content.className = "makeItNormal";
        }, 500);
    }
}

// ---- Bước 2: gán trình xử lý sự kiện click cho nút
var btn = document.getElementById("testButton");
btn.addEventListener("click", simpleHandler);

// ---- Bước 3: mouseover - đổi ảnh sang thang xám
var img = document.getElementById("mainImage");
img.addEventListener("mouseover", function (event) {
    img.className = "makeItGray";
});

// ---- Bước 4: mouseout - trả ảnh về bình thường
img.addEventListener("mouseout", function (event) {
    img.className = "makeItNormal";
});
