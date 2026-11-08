# graduation

Static site (HTML/CSS/JS thuần), deploy lên GitHub Pages bằng GitHub Actions.

## Chạy local

```sh
python3 -m http.server 8080
```

Mở http://localhost:8080

## Deploy

1. Trên GitHub: **Settings → Pages → Build and deployment → Source** chọn **GitHub Actions**.
2. Push lên `main`, workflow `.github/workflows/deploy.yml` sẽ tự deploy.
3. Site: https://loinguyennn.github.io/graduation/
