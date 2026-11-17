
// this variable has global scope
var boxClass = 'movingDiv';

function outputBox(num) {
   var box = "<div class='" + boxClass + "' id='div" + num + "'>";
   box += "This is div " + num;
   box += "</div>";
   return box;
}

/* Exercise 9.5 - Responding to load events */
/* Bước 2-3 (phiên bản lỗi, xem index-error.html + js/lab09-walkthrough05-error.js):
     var divToGet = document.getElementById("div1");
     alert(divToGet.innerHTML);
   -> div1 chưa tồn tại vì script chạy trước khi DOM tải xong. */

/* Bước 4: chờ sự kiện load rồi mới truy cập DOM */
window.addEventListener("load", function () {
    var divToGet = document.getElementById("div1");
    alert(divToGet.innerHTML);
});
