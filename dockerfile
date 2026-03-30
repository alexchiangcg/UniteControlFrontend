# 第一階段：建置前端靜態檔案
FROM node:20-alpine AS builder

RUN npm install -g pnpm@9.4.0

ENV PNPM_HOME=/app/.pnpm
ENV PATH=$PNPM_HOME:$PATH
WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=8192"

# 先複製套件設定檔，利用 Docker 快取加速重複建置
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 複製所有原始碼並執行建置
COPY . .
RUN pnpm run build

# 第二階段：使用 nginx 提供靜態檔案服務
FROM nginx:alpine
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
COPY --from=builder /app/dist /usr/share/nginx/html

# 容器啟動時先執行 entrypoint 替換環境變數，再啟動 nginx
ENTRYPOINT ["/docker-entrypoint.sh"]
