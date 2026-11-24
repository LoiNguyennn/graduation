# graduation

Static site (HTML/CSS/JS thuần), deploy lên GitHub Pages trực tiếp từ nhánh `main`.

## Chạy local

```sh
python3 -m http.server 8080
```

Mở http://localhost:8080

## Deploy

1. Trên GitHub: **Settings → Pages → Build and deployment → Source** chọn **Deploy from a branch**, branch `main`, folder `/ (root)`.
2. Push lên `main`, GitHub tự deploy.
3. Site: https://loinguyennn.github.io/graduation/

## Xác nhận tham dự (Google Sheet)

Nút "Xác nhận sẽ đến" gửi tên người nhận (`?to=Tên`, hoặc tên họ tự nhập nếu link không có) về một Google Sheet.

1. Tạo một Google Sheet mới, vào **Extensions → Apps Script**.
2. Xóa nội dung mặc định, dán toàn bộ [apps-script/Code.gs](apps-script/Code.gs), bấm Save.
3. **Deploy → New deployment** → loại **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Deploy, cấp quyền khi được hỏi, copy **Web app URL** (dạng `https://script.google.com/macros/s/.../exec`).
5. Dán URL vào `rsvpUrl` trong `CONFIG` ở [script.js](script.js), rồi push.

Kết quả nằm ở tab **RSVP** của Sheet: mỗi tên một dòng, kèm thời gian xác nhận đầu/cuối và số lần bấm.
Sửa `Code.gs` sau này thì phải **Deploy → Manage deployments → Edit → New version**, URL giữ nguyên.
