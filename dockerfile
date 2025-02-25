# 1️⃣ 使用 Node.js 建立 React 應用
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@9.4.0

ENV PNPM_HOME=/app/.pnpm
ENV PATH=$PNPM_HOME:$PATH
# Set working directory
WORKDIR /app

# Increase Node.js memory limit
ENV NODE_OPTIONS="--max-old-space-size=8192"

# 複製 package.json 並安裝依賴
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# 複製程式碼並執行 build
COPY . .
RUN pnpm run build

# 2️⃣ 使用 Nginx 作為伺服器
FROM nginx:alpine

# 複製編譯好的 React 靜態檔案到 Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 📌 複製專案內的 nginx.conf 到 Nginx 容器
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose 80 port
EXPOSE 80

# 啟動 Nginx
CMD ["nginx", "-g", "daemon off;"]
