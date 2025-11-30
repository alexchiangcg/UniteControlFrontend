# Technology Stack

## Project Type
單頁應用程式 (SPA) - 基於 React 的現代化前端 Web 應用程式，採用 Docker 容器化部署架構。

## Core Technologies

### Primary Language(s)
- **Language**: TypeScript 5.6.2
- **Runtime**: Node.js v20.14.0 (透過 pnpm 9.4.0 進行套件管理)
- **Compiler**: TypeScript 編譯器配置為嚴格模式 (strict mode)，目標為 ES5，使用 ESNext 模組系統
- **Language-specific tools**:
  - pnpm 9.4.0 (快速、節省磁碟空間的套件管理器)
  - Vite 5.4.10 (現代化構建工具)

### Key Dependencies/Libraries

**核心框架與工具**
- **React 18.3.1**: 使用者介面庫，採用 react-jsx 轉換
- **React Router DOM 7.0.1**: 客戶端路由管理
- **Redux Toolkit 2.5.0**: 狀態管理和資料快取，配合 RTK Query 進行 API 呼叫
- **React Redux 9.2.0**: React 與 Redux 的綁定

**UI 組件與樣式**
- **Ant Design 5.22.2**: 企業級 UI 組件庫
- **@ant-design/icons 6.0.0**: Ant Design 圖示庫
- **Styled Components 6.1.13**: CSS-in-JS 解決方案
- **Tailwind CSS 3.4.15**: 實用優先的 CSS 框架
- **FullCalendar 6.1.15**: 日曆與行程管理組件

**國際化與時間處理**
- **i18next 25.2.1**: 國際化框架
- **react-i18next 15.5.2**: React 的 i18next 綁定
- **i18next-browser-languagedetector 8.1.0**: 瀏覽器語言偵測
- **i18next-http-backend 3.0.2**: HTTP 後端載入翻譯資源
- **Day.js 1.11.13**: 輕量級日期時間處理庫

**開發工具**
- **json-server 1.0.0-beta.3**: 模擬後端 API 開發工具

### Application Architecture
**Feature-Based 模組化架構**
- 採用 feature-based 資料夾結構，每個功能模組（如 auth、booking）獨立管理
- 使用 Redux Toolkit 實現集中式狀態管理，配合 RTK Query 進行 API 快取和資料同步
- 共用組件和工具放置於 `@shared` 模組
- 路徑別名系統 (`@features`, `@shared`, `@store`, `@styles`, `@i18n`, `@utils`) 簡化導入路徑

**架構層級**
1. **展示層**: React 組件 + Ant Design + Styled Components
2. **業務邏輯層**: Redux Toolkit slices + RTK Query services
3. **路由層**: React Router DOM 聲明式路由配置
4. **資料層**: RTK Query API services 處理 HTTP 請求和快取

### Data Storage
- **Primary storage**: 前端狀態儲存於 Redux Store（記憶體）
- **Caching**: RTK Query 自動快取 API 回應
- **Data formats**: JSON（與後端 API 溝通）
- **Persistence**: 使用 localStorage/sessionStorage 儲存認證 token 和使用者偏好設定

### External Integrations
- **APIs**: RESTful API（後端服務）
- **Protocols**: HTTP/HTTPS, JSON over REST
- **Authentication**: 基於 Token 的認證機制（JWT 或類似方案）
- **Mock Server**: json-server 用於開發階段模擬 API (port 3004)

### Monitoring & Dashboard Technologies
- **Dashboard Framework**: React 18.3.1 with TypeScript
- **Real-time Communication**: Redux Store 狀態更新驅動 UI 重新渲染
- **Visualization Libraries**: FullCalendar (日曆視圖), Ant Design Charts (未來可擴展)
- **State Management**: Redux Toolkit with RTK Query for API state and cache management

## Development Environment

### Build & Development Tools
- **Build System**: Vite 5.4.10（支援熱模組替換 HMR）
- **Package Management**: pnpm 9.4.0（鎖檔案：pnpm-lock.yaml）
- **Development workflow**:
  - `pnpm dev`: 開發模式（開發環境變數）
  - `pnpm build:dev`: 開發構建
  - `pnpm build:prod`: 生產構建
  - `pnpm server`: 啟動 json-server 模擬後端

### Code Quality Tools
- **Static Analysis**:
  - ESLint 9.13.0 配合 TypeScript ESLint 8.11.0
  - React Hooks 規則檢查 (eslint-plugin-react-hooks)
  - React Refresh 規則 (eslint-plugin-react-refresh)
- **Formatting**: Prettier 3.6.2
- **Type Checking**: TypeScript 嚴格模式（strictNullChecks、strict 等）
- **Testing Framework**: (未配置，可考慮 Vitest 或 Jest)
- **Documentation**: JSDoc/TSDoc 註解

### Version Control & Collaboration
- **VCS**: Git
- **Branching Strategy**: Feature branches with dev as main development branch
- **Code Review Process**: Pull Request based workflow
- **Current Branch**: dev (main development branch)

### Dashboard Development
- **Live Reload**: Vite HMR（熱模組替換）提供毫秒級更新
- **Port Management**:
  - 開發伺服器預設 port (Vite default: 5173)
  - JSON server: port 3004
  - Docker Nginx: port 8080
- **Multi-Instance Support**: Vite 支援同時執行多個開發伺服器（不同 port）

## Deployment & Distribution

### Container-Based Deployment
- **Target Platform(s)**: Docker 容器環境（Linux-based）
- **Architecture**:
  - 多階段構建：React app 構建階段 + Nginx 服務階段
  - Volume 共享：`react_build` volume 在建構容器和 Nginx 容器間共享
- **Distribution Method**: Docker image (uniteslave-frontend-builder)
- **Installation Requirements**:
  - Docker Engine
  - Docker Compose
- **Update Mechanism**:
  - 重新構建 Docker image
  - `docker-compose up -d --build`

### Web Server
- **Server**: Nginx Alpine（輕量級）
- **Port Mapping**: 8080:80（外部:內部）
- **Restart Policy**: unless-stopped
- **Static Files**: 唯讀掛載 (`/usr/share/nginx/html:ro`)
- **Configuration**: 自訂 nginx.conf 掛載至容器

## Technical Requirements & Constraints

### Performance Requirements
- **Build Time**: Vite 快速構建，一般 < 30 秒
- **HMR Response**: < 100ms（熱模組替換）
- **Bundle Size**: 優化後 < 500KB (gzipped)
- **First Contentful Paint (FCP)**: < 1.5 秒
- **Time to Interactive (TTI)**: < 3 秒

### Compatibility Requirements
- **Browser Support**:
  - Modern browsers (Chrome, Firefox, Safari, Edge 最新兩個版本)
  - ES5 目標確保廣泛相容性
- **Platform Support**:
  - Desktop browsers (優先)
  - Mobile browsers (響應式設計)
- **Dependency Versions**:
  - Node.js >= 20.14.0
  - pnpm >= 9.4.0
- **Standards Compliance**:
  - ES2015+ (ESNext)
  - TypeScript Strict Mode
  - React 18 Concurrent Features

### Security & Compliance
- **Security Requirements**:
  - HTTPS 傳輸（生產環境）
  - Token 儲存於 httpOnly cookies 或安全的 storage
  - XSS 防護（React 自動跳脫）
  - CSRF 防護（Token-based auth）
- **Content Security Policy**: 配置於 Nginx
- **Secrets Management**: 環境變數分離（.env files，不提交至 Git）
- **Threat Model**:
  - 防止 XSS 攻擊
  - 防止 CSRF 攻擊
  - 安全的認證流程

### Scalability & Reliability
- **Expected Load**:
  - 小到中型應用（< 10,000 日活使用者）
  - 靜態資產由 Nginx 快取和提供
- **Availability Requirements**:
  - Docker restart policy 確保容器自動重啟
  - Nginx 作為反向代理提供穩定服務
- **Growth Projections**:
  - 模組化架構支援功能擴展
  - 可考慮 CDN 分發靜態資產
  - 未來可採用微前端架構

## Technical Decisions & Rationale

### Decision Log

1. **選擇 Vite 而非 Create React App (CRA)**
   - **理由**: Vite 提供更快的開發體驗（ESBuild）、更快的 HMR、更小的 bundle size
   - **權衡**: 較新的工具，但生態系統已經成熟

2. **採用 pnpm 而非 npm/yarn**
   - **理由**: 節省磁碟空間（符號連結）、更快的安裝速度、更嚴格的依賴管理
   - **權衡**: 團隊需熟悉 pnpm 指令

3. **使用 Redux Toolkit + RTK Query 而非原生 Redux 或其他狀態管理**
   - **理由**:
     - 簡化 Redux boilerplate
     - RTK Query 整合 API 快取和狀態管理
     - 官方推薦的 Redux 使用方式
   - **權衡**: 學習曲線，但文件完善

4. **Styled Components + Tailwind CSS 混合使用**
   - **理由**:
     - Styled Components 提供組件級樣式隔離
     - Tailwind 提供快速開發的 utility classes
     - 兩者互補，適用於不同場景
   - **權衡**: 可能導致樣式方案不統一，需制定規範

5. **Ant Design 作為主要 UI 庫**
   - **理由**:
     - 企業級組件庫，功能完善
     - 中文支援良好
     - 豐富的組件生態
   - **權衡**: Bundle size 較大，但透過 tree-shaking 可優化

6. **Docker 多階段構建架構**
   - **理由**:
     - 分離構建和執行環境
     - 減小最終 image 大小
     - Nginx 提供高效能靜態資產服務
   - **權衡**: 部署流程稍微複雜，但可自動化

7. **Feature-based 資料夾結構**
   - **理由**:
     - 高內聚、低耦合
     - 便於團隊協作（不同人負責不同 feature）
     - 易於維護和擴展
   - **權衡**: 需要明確定義 shared 模組的邊界

## Known Limitations

- **測試覆蓋率不足**: 當前沒有配置單元測試和 E2E 測試框架
  - **影響**: 重構和新增功能時缺乏安全網
  - **未來方案**: 引入 Vitest + React Testing Library + Playwright

- **API 文件化**: 缺少 Swagger/OpenAPI 規範
  - **影響**: 前後端介面對接需人工確認
  - **未來方案**: 建立 API 文件和 TypeScript 型別定義

- **效能監控**: 沒有整合前端效能監控工具
  - **影響**: 無法追蹤實際使用者的效能指標
  - **未來方案**: 考慮整合 Sentry、Google Analytics 或 Web Vitals

- **無障礙性 (A11y)**: 未系統性測試無障礙性
  - **影響**: 可能不符合 WCAG 標準
  - **未來方案**: 使用 axe-core 或類似工具進行稽核

- **i18n 翻譯完整性**: 翻譯資源可能不完整
  - **影響**: 部分介面可能顯示 key 而非翻譯文字
  - **未來方案**: 建立翻譯審查流程

- **State Persistence**: Redux state 不會持久化
  - **影響**: 重新整理頁面會遺失部分狀態
  - **未來方案**: 使用 redux-persist 保存重要狀態
