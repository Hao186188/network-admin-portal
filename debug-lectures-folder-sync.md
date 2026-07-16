# Debug Session: lectures-folder-sync

Status: OPEN

## Symptom
- Tạo folder trong trang `lectures` báo thành công nhưng danh sách trong thư viện bài giảng / folder explorer vẫn không nhận folder mới.
- Console hiện nhiều log kiểu điều hướng `folder: null`, fetch lặp lại, request aborted, state `items: 0`.

## Scope
- Trang lectures
- Folder explorer / library
- Luồng create folder + refresh/realtime + render list

## Initial Hypotheses
1. Request tạo folder đang thành công nhưng dữ liệu trả về/fetch sau đó không map đúng sang cấu trúc folder explorer.
2. Explorer đang đọc từ nguồn dữ liệu/hook khác với nơi create folder đang ghi vào, nên refresh xong vẫn rỗng.
3. Có effect điều hướng/fetch bị chạy lặp hoặc abort sai thời điểm, làm mất kết quả fetch mới nhất.
4. Điều kiện lọc folder/file trong explorer hoặc lectures page đang loại nhầm record mới tạo.
5. Trang chi tiết bài giảng có dữ liệu `video_url` nhưng UI không render nút truy cập theo đúng loại nội dung.

## Plan
1. Xác định chính xác component/hook đang sinh ra các log `folder: null`, `request aborted`, `already navigating`.
2. Thêm instrumentation tối thiểu để theo dõi create-folder -> fetch -> state update -> render.
3. So sánh dữ liệu pre-fix/post-fix để chốt nguyên nhân rồi mới sửa logic.
