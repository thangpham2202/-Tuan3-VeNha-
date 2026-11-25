'use strict';
// Dữ liệu mock: ngày được tính tương đối so với hôm nay để trang "Hôm nay" luôn có việc.
const CATEGORIES = [
  ['Học tập', '#6366f1'], ['Công việc', '#0ea5e9'], ['Cá nhân', '#f59e0b'],
  ['Sức khỏe', '#10b981'], ['Mua sắm', '#ec4899'],
  ['Giảng dạy', '#8b5cf6'], ['Cuộc thi', '#f97316'],
];
// [tiêu đề, mô tả, danh mục, ưu tiên, trạng thái, lệch ngày hạn, số ngày trước đã hoàn thành (nếu done), mức độ hoàn thành % (nếu doing)]
// Việc 'done' luôn là 100%, việc 'todo' luôn là 0%.
const TASKS = [
  ['Làm báo cáo CSS nâng cao', 'Chụp ảnh code và kết quả cho Lab 07', 'Học tập', 'high', 'doing', 0, null, 50],
  ['Ôn bài Phát triển ứng dụng TMĐT', 'Xem lại JavaScript và ASP.NET Core', 'Học tập', 'high', 'todo', 0],
  ['Nộp bài tập nhóm Chiến lược kinh doanh', 'Kiểm tra file cuối trước khi gửi', 'Học tập', 'high', 'todo', 0],
  ['Họp nhóm 20h tối', 'Chốt phần phân công slide', 'Công việc', 'medium', 'todo', 0],
  ['Trả lời email giảng viên', '', 'Công việc', 'low', 'done', 0],
  ['Tập thể dục 30 phút', 'Chạy bộ hoặc đạp xe', 'Sức khỏe', 'medium', 'done', 0],
  ['Uống đủ 2 lít nước', '', 'Sức khỏe', 'low', 'todo', 0],
  ['Mua sổ tay và bút highlight', 'Hiệu sách gần trường', 'Mua sắm', 'low', 'todo', 0],
  ['Gọi điện về nhà', '', 'Cá nhân', 'medium', 'todo', 0],
  ['Nộp bài tập ASP.NET Core', 'Đã làm xong, chờ nộp', 'Học tập', 'high', 'todo', -1],
  ['Dọn dẹp bàn học', '', 'Cá nhân', 'low', 'todo', -2],
  ['Đọc tài liệu Bootstrap', 'Grid và navbar', 'Học tập', 'medium', 'todo', 1],
  ['Chuẩn bị slide thuyết trình', 'Phần Mở đầu và Khái niệm', 'Công việc', 'high', 'doing', 1, null, 30],
  ['Đặt lịch khám sức khỏe', '', 'Sức khỏe', 'medium', 'todo', 2],
  ['Mua quà sinh nhật bạn', 'Ngân sách khoảng 300k', 'Mua sắm', 'medium', 'todo', 3],
  ['Viết README cho đồ án', '', 'Công việc', 'medium', 'todo', 4],
  ['Lên kế hoạch cuối tuần', '', 'Cá nhân', 'low', 'todo', 5],
  ['Làm Lab JavaScript 3 (jQuery)', '', 'Học tập', 'high', 'done', -1, 1],
  ['Chụp ảnh minh chứng Lab 07', '', 'Học tập', 'medium', 'done', -1, 1],
  ['Ôn tập giữa kỳ', '', 'Học tập', 'high', 'done', -2, 2],
  ['Họp nhóm tuần trước', '', 'Công việc', 'medium', 'done', -2, 2],
  ['Chạy bộ buổi sáng', '', 'Sức khỏe', 'low', 'done', -3, 3],
  ['Giặt đồ cuối tuần', '', 'Cá nhân', 'low', 'done', -3, 3],
  ['Thiết kế infographic R4K26', '', 'Công việc', 'high', 'done', -4, 4],
  ['Mua đồ dùng học tập', '', 'Mua sắm', 'low', 'done', -4, 4],
  ['Đọc chương 6 Advanced FrontEnd', '', 'Học tập', 'medium', 'done', -5, 5],
  ['Tập yoga', '', 'Sức khỏe', 'low', 'done', -5, 5],
  ['Nộp bài CSS cơ bản', '', 'Học tập', 'high', 'done', -6, 6],
  ['Sắp xếp lại thư mục tài liệu', '', 'Cá nhân', 'low', 'done', -6, 6],
  ['Làm bài tập cơ sở dữ liệu', '', 'Học tập', 'high', 'done', -7, 7],
  ['Gặp bạn cà phê', '', 'Cá nhân', 'low', 'done', -7, 7],
  ['Phân tích SWOT cho KQM', '', 'Công việc', 'high', 'done', -8, 8],
  // --- Giảng dạy ---
  ['Soạn bài đi dạy: Responsive Web Design', 'Slide, ví dụ Flexbox/Grid và 3 bài tập trên lớp', 'Giảng dạy', 'high', 'doing', 0, null, 60],
  ['Soạn bài đi dạy: Thực hành jQuery', 'Chuẩn bị file mẫu và đáp án', 'Giảng dạy', 'medium', 'doing', 1, null, 35],
  ['Chấm bài tập sinh viên lớp WEB01', 'Nhập điểm lên hệ thống trước thứ Sáu', 'Giảng dạy', 'medium', 'todo', 2],
  ['Ra đề kiểm tra 15 phút', 'Tối đa 10 câu trắc nghiệm', 'Giảng dạy', 'medium', 'doing', 4, null, 20],
  ['Soạn giáo án buổi 5: Flexbox và Grid', '', 'Giảng dạy', 'high', 'done', -3, 3],
  // --- Cuộc thi ---
  ['Bán hàng cho cuộc thi: lên danh sách sản phẩm', 'Chốt giá, số lượng và nhà cung cấp', 'Cuộc thi', 'high', 'doing', 0, null, 70],
  ['Bán hàng cho cuộc thi: chụp ảnh và đăng bài', 'Đăng fanpage và nhóm sinh viên', 'Cuộc thi', 'high', 'doing', 1, null, 40],
  ['Bán hàng cho cuộc thi: chốt đơn, tổng kết doanh thu', 'Làm bảng doanh thu nộp ban tổ chức', 'Cuộc thi', 'high', 'todo', 5],
  ['Nộp hồ sơ dự thi', 'Đã nộp đủ giấy tờ và kế hoạch kinh doanh', 'Cuộc thi', 'high', 'done', -4, 4],
  // --- Bài tập về nhà ---
  ['Làm bài tập về nhà môn Cơ sở dữ liệu', 'Tuần 12: truy vấn nhiều bảng và GROUP BY', 'Học tập', 'high', 'doing', 0, null, 45],
  ['Làm bài tập về nhà môn Tiếng Anh', 'Unit 8: Reading và Writing', 'Học tập', 'medium', 'todo', 2],
  ['Làm bài tập về nhà môn Toán rời rạc', '', 'Học tập', 'medium', 'done', -1, 1],
  // --- Báo cáo môn học ---
  ['Viết báo cáo môn Phát triển ứng dụng TMĐT', 'Chương 1-3, kèm sơ đồ chức năng', 'Học tập', 'high', 'doing', 3, null, 55],
  ['Viết báo cáo môn Quản trị dự án', 'Phần kế hoạch và quản lý rủi ro', 'Học tập', 'high', 'doing', 6, null, 15],
  ['Tổng hợp tài liệu tham khảo cho báo cáo', 'Ghi nguồn theo chuẩn APA', 'Học tập', 'low', 'todo', 2],
  ['Viết báo cáo thực hành Lab 06', '', 'Học tập', 'medium', 'done', -5, 5],
  // --- Khác ---
  ['Họp góp ý với giáo viên hướng dẫn', 'Mang bản nháp báo cáo', 'Học tập', 'medium', 'todo', 3],
  ['Đóng học phí học kỳ 2', '', 'Cá nhân', 'high', 'todo', 7],
];

function ymd(offset) {
  const d = new Date(); d.setDate(d.getDate() + offset);
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function seed(db) {
  const insCat = db.prepare('INSERT INTO categories (name, color) VALUES (?, ?)');
  const insTask = db.prepare(`INSERT INTO tasks
    (title, description, category_id, priority, status, progress, due_date, created_at, updated_at, completed_at)
    VALUES (@title, @description, @category_id, @priority, @status, @progress, @due, @created, @created, @completed)`);
  db.transaction(() => {
    const ids = {};
    for (const [n, c] of CATEGORIES) ids[n] = insCat.run(n, c).lastInsertRowid;
    TASKS.forEach(([title, description, cat, priority, status, off, ago, pct], i) => {
      const done = status === 'done';
      const doneDay = ymd(done ? -(ago ?? 0) : 0);
      insTask.run({
        title, description, category_id: ids[cat], priority, status, due: ymd(off),
        progress: done ? 100 : status === 'doing' ? (pct ?? 50) : 0,
        created: `${ymd(Math.min(off, 0) - 2)} 08:${String(10 + i).padStart(2, '0')}:00`,
        completed: done ? `${doneDay} ${String(9 + (i % 9)).padStart(2, '0')}:30:00` : null,
      });
    });
  })();
}
module.exports = { seed, ymd };
