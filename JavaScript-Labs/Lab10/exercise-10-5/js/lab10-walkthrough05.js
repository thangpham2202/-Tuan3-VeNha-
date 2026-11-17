/* Exercise 10.5 - Inserting DOM elements
   Bước 2-8 trong tài liệu thay đổi dòng cuối của cùng một đoạn mã.
   Để quan sát tất cả các phương thức cùng lúc, mỗi phương thức dưới đây
   chèn một ảnh khác nhau; phiên bản một ảnh của tài liệu được giữ ở chú thích. */
$(function () {
    var panel = $('.panel');

    /* Bước 2-3 (phiên bản gốc)
    var img = $('<img src="../images/art/thumbs/13030.jpg" >');
    panel.after(img);      // bước 2
    panel.before(img);     // bước 3
    panel.append(img);     // bước 4
    panel.prepend(img);    // bước 5
    img.appendTo(panel);   // bước 6
    img.prependTo(panel);  // bước 7
    img.insertBefore(panel); // bước 8
    */

    function thumb(name, title) {
        return $('<img src="../images/art/thumbs/' + name + '.jpg" title="' + title + '" >');
    }

    panel.after(thumb("13030", "after()"));              // bước 2: sau panel
    panel.before(thumb("05020", "before()"));            // bước 3: trước panel
    panel.append(thumb("06010", "append()"));            // bước 4: cuối bên trong panel
    panel.prepend(thumb("05030", "prepend()"));          // bước 5: đầu bên trong panel
    thumb("120010", "appendTo()").appendTo(panel);       // bước 6
    thumb("07020", "prependTo()").prependTo(panel);      // bước 7
    thumb("13030", "insertBefore()").insertBefore(panel);// bước 8
});
