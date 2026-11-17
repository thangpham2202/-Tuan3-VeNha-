
// this variable has global scope
var boxClass = 'movingDiv';

function outputBox(num) {
   var box = "<div class='" + boxClass + "' id='div" + num + "'>";
   box += "This is div " + num;
   box += "</div>";
   return box;
}

/* Exercise 9.6 - Debugging events
   Đặt breakpoint tại dòng alert() trong tab Sources của DevTools,
   rồi rê chuột vào các hộp để xem biến e và e.target. */
window.addEventListener("load", function () {
    var divs = document.querySelectorAll(".movingDiv");
    for (i = 0; i < divs.length; i++) {
        divs[i].addEventListener("mouseover", function (e) {
            console.log("triggered by " + e.target.id);   // hỗ trợ kiểm tra trong Console
            alert("triggered by " + e.target.id);        // breakpoint đặt tại dòng này
        });
    }
});
