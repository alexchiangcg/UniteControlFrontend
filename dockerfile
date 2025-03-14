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

# 複製專案所有程式碼並執行 build
COPY . .
RUN pnpm run build

# 在 build 階段結束後清理開發依賴，減少映像檔大小
RUN rm -rf node_modules && \
    rm -rf $PNPM_HOME && \
    npm rm -g pnpm