/* Exercise 8.7 - Arrays */

/* Bước 2: tạo mảng Mon -> Fri */
var daysOfWeek = new Array("Mon", "Tues", "Wed", "Thur", "Fri");
document.write(daysOfWeek + "<br>");

/* Bước 3: thêm Sat vào cuối mảng bằng push() */
daysOfWeek.push("Sat");
document.write(daysOfWeek + "<br/>");

/* Bước 4: thêm Sun vào đầu mảng bằng unshift() */
daysOfWeek.unshift("Sun");
document.write(daysOfWeek + "<br/>");

/* Bước 5: tắt dòng in mảng ở trên (đã chuyển sang in bảng) */
// document.write(daysOfWeek + "<br/>");

/* Bước 6-7: duyệt mảng, in hàng tiêu đề của bảng.
   Ngày dài hơn 3 ký tự (Tues, Thur) được in nghiêng bằng <em> */
document.write("<table border=1>");
document.write("<tr>");
for (var i = 0; i < daysOfWeek.length; i++) {
    var day;
    if (daysOfWeek[i].length < 4)
        day = daysOfWeek[i];
    else
        day = "<em>" + daysOfWeek[i] + "</em>";
    document.write("<th>" + day + "</th>");
}
document.write("</tr>");

/* Bước 8: in các ngày 1..30, giả sử tháng bắt đầu vào Chủ nhật */
var dayNumber = 1;
var daysInMonth = 30;
while (dayNumber <= daysInMonth) {
    document.write("<tr>");
    for (var col = 0; col < daysOfWeek.length; col++) {
        if (dayNumber <= daysInMonth) {
            document.write("<td>" + dayNumber + "</td>");
            dayNumber++;
        } else {
            document.write("<td></td>");
        }
    }
    document.write("</tr>");
}
document.write("</table>");
