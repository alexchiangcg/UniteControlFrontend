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

#### 2. 本地開發

```bash
pnpm dev
```

開發伺服器預設在 `http://localhost:5173` 啟動。

#### 3. 建置

```bash
# 開發環境建置
pnpm build:dev

# 正式環境建置
pnpm build:prod
```

#### 4. 測試

```bash
# 執行測試
pnpm test

# 開啟測試 UI 介面
pnpm test:ui

# 產生測試覆蓋率報告
pnpm test:coverage
```

#### 5. 程式碼檢查

```bash
pnpm lint
```

#### 6. Docker 部署

##### 建置 Image

```bash
docker build -t unite-control-frontend .
```

##### 啟動容器

透過環境變數 `VITE_API_URL` 指定該客戶的 API 位址：

```bash
docker run -d \
  -p 8080:80 \
  -e VITE_API_URL=http://客戶的API位址:8111/ \
  --name unite-control-frontend \
  --restart unless-stopped \
  unite-control-frontend
```

或使用 docker-compose（先編輯 `docker-compose.yml` 中的 `VITE_API_URL`）：

```bash
docker-compose up -d
```

##### 環境變數

| 變數名稱 | 必填 | 說明 | 範例 |
|-----------|------|------|------|
| `VITE_API_URL` | 是 | 後端 API 位址 | `http://192.168.1.100:8111/` |

> **運作原理**：同一個 Docker Image 可部署到不同客戶環境。Build 時前端程式碼包含佔位符，容器啟動時 entrypoint 腳本自動將佔位符替換為 `VITE_API_URL` 環境變數的值，再啟動 nginx。

##### Kubernetes 部署

使用 ConfigMap 注入環境變數，不同客戶各自一份 ConfigMap，Image 不需重新建置：

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: unite-control-frontend-config
data:
  VITE_API_URL: "http://客戶的API位址:8111/"
```

```yaml
# deployment.yaml（片段）
spec:
  containers:
    - name: unite-control-frontend
      image: unite-control-frontend
      envFrom:
        - configMapRef:
            name: unite-control-frontend-config
```

#### 7. 訪問網頁

瀏覽 `http://localhost:8080`

### 停止

```bash
docker-compose down
```

### 專案架構

```
src/
├── features/          # 功能模組
│   ├── auth/          # 登入與驗證
│   ├── booking/       # 預約管理
│   ├── maintainer-manager/  # 維護人員管理
│   └── users/         # 使用者管理
├── shared/            # 共用元件、服務、工具
├── store/             # Redux 狀態管理
├── styles/            # 全域樣式
├── i18n/              # 多語系設定
├── utils/             # 工具函式
└── test/              # 測試設定與工具
```

- `public/`: 靜態資源目錄，如圖片。
- `nginx/`: Nginx 設定檔。
- `vite.config.ts`: Vite 的配置檔案。

### 主要技術

- **React 18** + **TypeScript**: 前端框架與型別檢查。
- **Vite**: 開發與建置工具。
- **Ant Design 5**: UI 元件庫。
- **Redux Toolkit**: 狀態管理與 API 請求（RTK Query）。
- **React Router 7**: 路由管理。
- **Tailwind CSS 3**: 樣式框架。
- **i18next**: 多語系支援。
- **Vitest**: 單元測試框架。
- **Docker + Nginx**: 容器化部署。

### 參考資料

- [React 官方網站](https://reactjs.org/)
- [TypeScript 官方網站](https://www.typescriptlang.org/)
- [Vite 官方網站](https://vitejs.dev/)
- [Docker 官方網站](https://www.docker.com/)
