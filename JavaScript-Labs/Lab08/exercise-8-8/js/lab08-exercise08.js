/* Exercise 8.8 - JavaScript functions */

// Bước 8: biến có phạm vi global
var boxClass = 'movingDiv';

/* Bước 1: hàm xuất trực tiếp ra trang (phiên bản đầu)
function outputBox() {
   document.write("<div class='movingDiv' id='div1'>");
   document.write("This is div 1");
   document.write("</div>");
}
*/

/* Bước 4-6-8: hàm trả về chuỗi, có tham số num, dùng biến global boxClass */
function outputBox(num) {
   var box = "<div class='" + boxClass + "' id='div" + num + "'>";
   box += "This is div " + num;
   box += "</div>";
   return box;
}
