# React + TypeScript + Vite

這是一個使用 **React**、**TypeScript** 和 **Vite** 建立的前端專案，並且已經配置好 Docker 部署。

### 需求

- **Node.js**: v20.14.0
- **pnpm**: 9.4.0

### 開發與執行

#### 1. 安裝依賴


```bash
pnpm install
```

#### 2. 使用 Docker 來啟動網頁


```bash
docker-compose up -d --build
```

包含 React ，Nginx。

#### 3. 訪問網頁

運行 `http://localhost:8080` 

### 停止

停止網頁並移除容器：

```bash
docker-compose down
```

### 專案架構

- `src/`: 目錄包含所有 React component、page 與商業邏輯。
- `public/`: 靜態資源目錄，如圖片。
- `vite.config.ts`: Vite 的配置檔案。

### 主要技術

- **React**: 用於構建使用者界面的 JavaScript 庫。
- **TypeScript**: 提供靜態類型檢查的 JavaScript 擴展。
- **Vite**: 用於快速開發和構建的現代化前端工具。
- **Docker**: 容器化部署應用，實現便捷的環境配置與移植。

### 參考資料

- [React 官方網站](https://reactjs.org/)
- [TypeScript 官方網站](https://www.typescriptlang.org/)
- [Vite 官方網站](https://vitejs.dev/)
- [Docker 官方網站](https://www.docker.com/)
