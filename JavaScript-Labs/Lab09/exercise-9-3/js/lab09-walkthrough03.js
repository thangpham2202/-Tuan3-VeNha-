/* Exercise 9.3 - Modifying the DOM */

// ---- Bước 1: tạo và thêm phần tử <p> vào div#first
var first = document.getElementById("first");

var text = document.createTextNode("this is programmatically created");
var p = document.createElement("p");

p.appendChild(text);
first.appendChild(p);

// ---- Bước 3: xóa một phần tử <li>
var icons = document.getElementById("iconList");
icons.removeChild(document.getElementById("deleteThisOne"));
