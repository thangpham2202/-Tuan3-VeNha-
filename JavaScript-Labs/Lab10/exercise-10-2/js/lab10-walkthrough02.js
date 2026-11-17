/* Exercise 10.2 - Basic selectors */

// ---- Bước 2: chọn theo id và gán giá trị bằng val()
var msg = $('#msgArea');
msg.val("here is some new text");

// ---- Bước 3: html() đọc/ghi nội dung HTML
$('#first').html("new Title");

// ---- Bước 4: attr() đọc/ghi thuộc tính
$('#msgArea').val("My class is " + $('#msgArea').attr("class"));

// ---- Bước 5: chọn tất cả <button> và đổi màu nền (không cần vòng lặp)
var buttons = $('button');
buttons.css('background-color', 'red');

// ---- Bước 6: chọn <body>
var temp = $('body');
temp.css("background-color", "ivory");

// ---- Bước 7: chọn theo class và thêm class bằng addClass() (chaining)
$('.center-icons').addClass('selected');
