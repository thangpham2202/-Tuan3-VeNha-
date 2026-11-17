/* Exercise 9.2 - DOM family relations */

// Bước 2-5 thực hiện trong Console, ở đây ghi lại để kiểm tra bằng code:
console.log(document.getElementById("first"));
console.log(document.getElementById("first").firstChild);              // nút văn bản (khoảng trắng)
console.log(document.getElementById("first").firstChild.nextSibling);  // phần tử <h1>
console.log(document.getElementById("first").parentNode);              // <div class="container">

// ---- Bước 6: duyệt các childNodes của #stories
var stories = document.getElementById("stories");
for (i = 0; i < stories.childNodes.length; i++) {
    console.log("child " + i + " =" + stories.childNodes[i] +
                " nodeType=" + stories.childNodes[i].nodeType);
}

// ---- Bước 7: đổi màu nền của các nút KHÔNG phải nút văn bản (nodeType != 3)
for (i = 0; i < stories.childNodes.length; i++) {
    if (stories.childNodes[i].nodeType != 3) {
        stories.childNodes[i].style.backgroundColor = "#e8f4fd";
    }
}
