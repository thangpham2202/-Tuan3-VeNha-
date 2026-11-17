
var boxClass = 'movingDiv';

function outputBox(num) {
   var box = "<div class='" + boxClass + "' id='div" + num + "'>";
   box += "This is div " + num;
   box += "</div>";
   return box;
}

/* Phiên bản LỖI (bước 2-3): script chạy trong <head> trước khi DOM được tải */
var divToGet = document.getElementById("div1");
alert(divToGet.innerHTML);
