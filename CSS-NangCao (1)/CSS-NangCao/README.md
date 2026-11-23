# CSS nâng cao – Lab 07: Advanced CSS: Layout

Môn học: **Phát triển ứng dụng thương mại điện tử** – Chương 5: Advanced CSS – Layout.

## Thông tin sinh viên

| Mục | Nội dung |
|---|---|
| Họ và tên | Phạm Văn Thắng |
| Mã số sinh viên | 31241027009 |
| Lớp học phần | 26C1INF50902701 |
| GitHub | https://github.com/thangpham2202 |

## Mục tiêu thực hiện Lab 07

- Điều khiển document flow và thay đổi cách hiển thị bằng `display`.
- Định vị phần tử bằng relative / absolute positioning và kiểm soát thứ tự chồng lớp bằng `z-index`.
- Sử dụng `float`, `clear` và xây dựng bố cục hai cột, ba cột.
- Thiết kế giao diện responsive bằng media queries và viewport.
- Sử dụng CSS transforms, transitions, filters và animations.
- Ứng dụng Bootstrap grid system và các thành phần giao diện có sẵn.

## Cấu trúc thư mục

```
CSS-NangCao/
├── index.html              Trang chủ giới thiệu và liên kết đến các Exercise
├── README.md
├── css/style.css           CSS của trang chủ
├── images/avatar.jpg       Ảnh đại diện
└── Lab07/
    ├── index.html          Danh sách 19 Exercise
    ├── css/                base.css (dùng chung), lab-index.css
    ├── bootstrap/          Bootstrap 3.4.1 (css, js, fonts) và jQuery
    ├── images/             Hình ảnh dùng trong các Exercise
    └── Exercise01 ... Exercise19/
        ├── index.html      Mã HTML của Exercise
        └── style.css       Mã CSS của Exercise
            (Exercise12, 13 có thêm desktop.css và mobile.css)
```

## Nội dung các nhóm Exercise

| Nhóm | Nội dung |
|---|---|
| 7.1 – 7.4 | Document flow, relative/absolute positioning, z-index |
| 7.5 – 7.9 | Float, clear và positioning |
| 7.10 – 7.13 | Bố cục hai cột, ba cột, media queries, viewport |
| 7.14 – 7.18 | Transforms, transitions, filters, animations |
| 7.19 | Bootstrap grid system |

Ghi chú: Exercise 7.13 được thực hiện trên bộ file của Exercise 7.12 (bổ sung thẻ viewport và đổi menu điều hướng), được lưu thành thư mục `Exercise13` riêng để dễ so sánh.

## GitHub Pages

- Trang chủ: https://thangpham2202.github.io/-Tuan3-VeNha-/CSS-NangCao/
- Danh sách Exercise: https://thangpham2202.github.io/-Tuan3-VeNha-/CSS-NangCao/Lab07/

## Hướng dẫn truy cập các bài thực hành

1. Mở trang chủ GitHub Pages ở trên và chọn Exercise trong mục **Danh sách và liên kết đến các Exercise**.
2. Hoặc mở trang **Lab07/** để xem danh sách đầy đủ 19 Exercise.
3. Đường dẫn trực tiếp có dạng `https://thangpham2202.github.io/-Tuan3-VeNha-/CSS-NangCao/Lab07/Exercise05/`.
4. Với Exercise 7.7, 7.10, 7.11, 7.12, 7.13: kéo thay đổi kích thước cửa sổ trình duyệt để quan sát bố cục thay đổi.
5. Với Exercise 7.15, 7.16: di chuột lên các phần tử để xem hiệu ứng transition.
