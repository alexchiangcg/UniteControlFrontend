#!/bin/sh
# 將所有 JS 檔案中的佔位符替換為實際的環境變數值
# 這樣同一個 Docker Image 就能部署到不同客戶環境，只需傳入不同的 VITE_API_URL
find /usr/share/nginx/html -name '*.js' -exec \
  sed -i "s|__VITE_API_URL_PLACEHOLDER__|${VITE_API_URL}|g" {} +

# 啟動 nginx（前景模式，讓 Docker 能正確管理程序生命週期）
exec nginx -g 'daemon off;'
