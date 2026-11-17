/* Exercise 10.8 - Complex animations */
$(function () {
    $("button").click(function () {
        // Bước 4: chuỗi 3 hoạt ảnh, mỗi hoạt ảnh chạy sau khi hoạt ảnh trước kết thúc
        // (bước 2: chỉ animate left; bước 3: animate đồng thời left, opacity, height)
        $("#box")
            .animate({
                left: '495px',
                opacity: '1',
                height: '50px'
            })
            .animate({ top: '400px', opacity: '0.2' })
            .animate({ height: '200px' }, 2000);
    });
});
