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
