# Feature-Based 架構遷移評估與計劃

## 專案概況

| 項目 | 詳情 |
|------|------|
| **專案名稱** | UniteControlFrontend |
| **當前架構** | 混合型 (Layer-based + Feature-based) |
| **總文件數** | 26 個 TypeScript/JavaScript 文件 |
| **代碼量** | ~1.0 MB (src 目錄，包含資源檔) |
| **技術棧** | React 18.3.1 + TypeScript + Redux Toolkit + Ant Design |
| **構建工具** | Vite 5.4.10 |

## 當前目錄結構

```
src/
├── pages/          (6 頁面)
│   ├── auth/      (4 頁面) - Login, Register, ForgotPassword, ResetPassword
│   ├── booking/   (1 頁面) - BookingCreate
│   └── NotFound.tsx
├── components/     (2 元件) - Header、Sidebar
├── layouts/        (2 佈局) - AuthLayout、SidebarLayout
├── services/       (5 服務) - loginServices, registerServices, logoutServices, userListServices, baseQueryWithErrorHandler
├── store/          (Redux 配置)
├── slices/         (Redux 狀態)
├── utils/          (工具函數)
├── i18n/           (國際化)
├── styles/         (全局樣式)
└── assets/         (圖片資源)
```

### 架構特點

**Layer-based 特徵**：
- pages/ → 頁面層
- components/ → UI 層
- services/ → API 層
- store/ → 狀態層

**Feature-based 雛形**：
- pages/auth/ (認證功能 - 4 個頁面)
- pages/booking/ (預約功能 - 1 個頁面)

## 難度評估：🟢 中低難度（專案精簡後更容易）

### 需要遷移的檔案統計

```
📁 需要重組的檔案
├── pages/          6 個頁面
│   ├── auth/      4 個頁面 (Login, Register, ForgotPassword, ResetPassword)
│   ├── booking/   1 個頁面 (BookingCreate)
│   └── NotFound   1 個頁面
├── components/     2 個元件 (Header, Sidebar)
├── services/       5 個 API 服務
├── layouts/        2 個佈局 (AuthLayout, SidebarLayout)
└── utils/          工具函數
總計：約 15-20 個檔案需要重新組織
```

## 目標架構設計

### Feature-based 架構建議結構

```
src/
├── features/
│   ├── auth/                      # 認證功能
│   │   ├── components/           # Login, Register, ForgotPassword 等
│   │   ├── services/             # loginServices.ts, registerServices.ts
│   │   ├── hooks/                # useAuth, useLogin
│   │   ├── layouts/              # AuthLayout
│   │   ├── types/                # auth 相關類型定義
│   │   └── index.ts              # 統一導出
│   │
│   └── booking/                   # 預約功能
│       ├── components/           # BookingCreate (未來可擴展 BookingList, BookingDetail)
│       ├── services/             # bookingServices.ts
│       ├── hooks/                # useBooking
│       ├── types/                # booking types
│       └── index.ts
│
├── shared/                        # 共享資源
│   ├── components/               # Header, Sidebar (全局元件)
│   ├── layouts/                  # SidebarLayout (全局佈局)
│   ├── utils/                    # errorHandler, 工具函數
│   ├── services/                 # baseQueryWithErrorHandler
│   ├── hooks/                    # 共享 hooks
│   ├── types/                    # 共享類型定義
│   └── constants/                # 常量定義
│
├── store/                         # Redux 全局狀態
│   ├── store.ts
│   └── slices/                   # 可考慮按 feature 分組
│
├── i18n/                          # 國際化
├── styles/                        # 全局樣式
├── routes.tsx                     # 路由配置
└── App.tsx
```

## 難度分析

### ✅ 容易的部分（1-2 天）

#### 1. Auth 功能模組化

- **現有結構**：Login.tsx、Register.tsx、ForgotPassword.tsx、ResetPassword.tsx 已在 `pages/auth/`
- **需要做的**：
  - 移動 loginServices.ts、registerServices.ts、logoutServices.ts 到 `features/auth/services/`
  - 移動 AuthLayout 到 `features/auth/layouts/`
  - 創建 `features/auth/index.ts` 統一導出
  - Auth 功能完整，是最適合首先遷移的模組

#### 2. Booking 功能模組化

- **現有結構**：BookingCreate.tsx 在 `pages/booking/`
- **需要做的**：
  - 創建對應的 services、types
  - 目前只有一個頁面，結構簡單，遷移容易

### 🟡 中等難度（2-3 天）

#### 1. 共享元件分離
- **挑戰**：需判斷 Header、Sidebar 是全局共享還是特定功能
- **決策**：
  - 如果所有功能都用 → 放 `shared/components/`
  - 如果只有部分功能用 → 放對應 `feature/components/`

#### 2. Services 層重組

- **baseQueryWithErrorHandler**：
  - 這是全局的 API 配置，應放 `shared/services/`
  - 需確保所有 feature services 都能正確引用

- **各功能 services**：
  - loginServices.ts → `features/auth/services/`
  - registerServices.ts → `features/auth/services/`
  - logoutServices.ts → `features/auth/services/`
  - userListServices.ts → 決定放 `shared/services/` 或創建新的 feature

#### 3. 路由配置調整
- **routes.tsx 需要更新**：
  - 更新所有 import 路徑
  - 考慮使用 React.lazy() 實現 code splitting

  ```typescript
  // Before
  import Login from './pages/auth/Login'

  // After
  import { Login } from './features/auth'
  // or with lazy loading
  const Login = lazy(() => import('./features/auth').then(m => ({ default: m.Login })))
  ```

### ⚠️ 較困難的部分（3-5 天）

#### 1. 依賴關係梳理
- **挑戰**：需要仔細檢查各模組間的依賴
- **風險**：可能出現循環依賴
- **解決方案**：
  - 使用 ESLint 插件檢測循環依賴
  - 遵循單向依賴原則：feature → shared（✅），shared ↛ feature（❌）

#### 2. Redux Store 重組
- **當前結構**：store/ 和 slices/ 分離
- **建議調整**：
  ```
  store/
  ├── store.ts                    # 全局 store 配置
  ├── rootReducer.ts              # 合併所有 reducers
  └── slices/
      ├── auth/                   # 可選：按 feature 分組
      ├── booking/
      └── global/                 # 全局狀態（主題、語言等）
  ```

#### 3. 類型定義重組
- **挑戰**：避免類型重複定義和循環引用
- **策略**：
  - 共享類型 → `shared/types/`
  - 功能特定類型 → `features/[feature]/types/`
  - API 回應類型 → `shared/types/api.ts`

  ```typescript
  // shared/types/api.ts
  export interface ApiResponse<T = any> {
    error_code?: string;
    error_message?: string;
    data?: T;
  }

  // features/auth/types/index.ts
  export interface LoginRequest {
    account: string;
    password: string;
  }

  export interface LoginResponse {
    user_id: string;
    token: string;
  }
  ```

## 遷移策略

### 方案一：漸進式遷移（推薦）⭐

**時間：1-2 週**（專案精簡後時間縮短）

#### Week 1: Auth 功能完整遷移 + Booking 遷移

1. Day 1-2: 創建 `features/auth/` 目錄結構
2. Day 2-3: 遷移所有 auth 相關檔案（4 頁面 + 3 services + 1 layout）
3. Day 3-4: 更新 routes.tsx 中的 auth 路由
4. Day 4: 測試登入、註冊、忘記密碼、重設密碼流程
5. Day 5: 創建 `features/booking/` 並遷移 BookingCreate
6. **驗證可行性**

#### Week 2: Shared 資源整理 + 清理

1. Day 1-2: 整理 `shared/` 目錄（components, layouts, services）
2. Day 2-3: 處理 NotFound 頁面和其他零散檔案
3. Day 3: 刪除舊的 `pages/`、部分 `services/` 目錄
4. Day 4: 全面測試所有功能
5. Day 5: 更新文檔和 Code Review

**優點**：
- ✅ 風險低，可隨時回退
- ✅ 新舊並存，不影響開發
- ✅ 可以逐步驗證架構合理性
- ✅ 團隊成員可以逐步適應新結構

**缺點**：
- ⚠️ 遷移期間會有新舊兩套結構並存
- ⚠️ 需要維護兩套 import 路徑

### 方案二：一次性遷移

**時間：1 週密集工作**

#### Day 1-2: 規劃與準備
- 詳細列出所有需要遷移的檔案
- 創建新的目錄結構
- 設置 path alias（tsconfig.json）

#### Day 3-5: 大規模遷移
- 遷移所有檔案到新結構
- 更新所有 import 路徑
- 更新 routes.tsx

#### Day 6-7: 測試與修復
- 完整功能測試
- 修復所有問題
- 更新文檔

**優點**：
- ✅ 快速完成，一步到位
- ✅ 不會有新舊結構並存的混亂期

**缺點**：
- ❌ 風險高，需要完整測試
- ❌ 可能會有遺漏導致線上問題
- ❌ 適合有充足測試覆蓋的專案

## 遷移檢查清單

### 階段一：準備工作
- [ ] 確保 Git 有最新的 commit
- [ ] 創建新分支 `feature/architecture-migration`
- [ ] 備份當前代碼
- [ ] 安裝循環依賴檢測工具
  ```bash
  npm install -D eslint-plugin-import
  ```
- [ ] 設置 TypeScript path aliases
  ```json
  // tsconfig.json
  {
    "compilerOptions": {
      "paths": {
        "@features/*": ["./src/features/*"],
        "@shared/*": ["./src/shared/*"],
        "@store/*": ["./src/store/*"]
      }
    }
  }
  ```

### 階段二：Auth 功能遷移（範例）
- [ ] 創建目錄結構
  ```bash
  mkdir -p src/features/auth/{components,services,hooks,layouts,types}
  ```
- [ ] 遷移組件
  - [ ] Login.tsx → features/auth/components/
  - [ ] Register.tsx → features/auth/components/
  - [ ] ForgotPassword.tsx → features/auth/components/
  - [ ] ResetPassword.tsx → features/auth/components/
- [ ] 遷移服務
  - [ ] loginServices.ts → features/auth/services/
  - [ ] registerServices.ts → features/auth/services/
- [ ] 遷移佈局
  - [ ] AuthLayout.tsx → features/auth/layouts/
- [ ] 創建類型定義
  - [ ] 創建 features/auth/types/index.ts
- [ ] 創建統一導出
  - [ ] 創建 features/auth/index.ts
  ```typescript
  export { default as Login } from './components/Login';
  export { default as Register } from './components/Register';
  export { default as ForgotPassword } from './components/ForgotPassword';
  export { default as ResetPassword } from './components/ResetPassword';
  export { default as AuthLayout } from './layouts/AuthLayout';
  export * from './services/loginServices';
  export * from './services/registerServices';
  export * from './types';
  ```
- [ ] 更新 routes.tsx
  ```typescript
  import { Login, Register, ForgotPassword, ResetPassword } from '@features/auth';
  ```
- [ ] 測試所有 auth 功能
  - [ ] 登入流程
  - [ ] 註冊流程
  - [ ] 忘記密碼流程
  - [ ] 重設密碼流程

### 階段三：Shared 資源整理
- [ ] 創建 shared 目錄結構
  ```bash
  mkdir -p src/shared/{components,layouts,services,utils,hooks,types,constants}
  ```
- [ ] 遷移共享元件
  - [ ] Header.tsx → shared/components/
  - [ ] Sidebar.tsx → shared/components/
- [ ] 遷移共享佈局
  - [ ] SidebarLayout.tsx → shared/layouts/
- [ ] 遷移共享服務
  - [ ] baseQueryWithErrorHandler.ts → shared/services/
- [ ] 遷移工具函數
  - [ ] errorHandler.ts → shared/utils/
- [ ] 創建共享類型
  - [ ] 創建 shared/types/api.ts
  - [ ] 創建 shared/types/common.ts

### 階段四：其他功能遷移
- [ ] Booking 功能
- [ ] Dashboard 功能
- [ ] Home 功能
- [ ] 其他頁面

### 階段五：清理與測試
- [ ] 刪除舊的目錄結構
  - [ ] 刪除 src/pages/
  - [ ] 刪除 src/services/
  - [ ] 刪除 src/layouts/
- [ ] 更新所有 import 路徑
- [ ] 執行完整測試
  - [ ] 所有頁面可正常訪問
  - [ ] 所有 API 調用正常
  - [ ] 所有功能運作正常
- [ ] 執行 Lint 檢查
  ```bash
  npm run lint
  ```
- [ ] 執行 Build 測試
  ```bash
  npm run build
  ```
- [ ] 更新文檔
  - [ ] 更新 README.md
  - [ ] 更新架構說明文檔

## 預期效益

### 短期效益（遷移完成後）
✅ **程式碼更容易定位**
- 按功能找檔案，而不是按技術層找
- 例如：要改登入功能，直接去 `features/auth/`

✅ **功能模組獨立，職責清晰**
- 每個 feature 是一個完整的功能單元
- 包含自己的 UI、邏輯、狀態管理

✅ **減少 import 路徑混亂**
- 使用 path aliases
- 統一的導出方式

### 中期效益（1-3 個月後）
✅ **新功能開發更快**
- 有固定的結構模板
- 複製現有 feature 快速開始

✅ **程式碼重用性提高**
- 共享邏輯集中在 shared/
- 功能特定邏輯隔離在各 feature/

✅ **更容易進行單元測試**
- 功能隔離便於測試
- 可以針對單一 feature 進行測試

### 長期效益（3-6 個月後）
✅ **團隊協作更順暢**
- 可以按功能分配開發任務
- 減少程式碼衝突

✅ **維護成本降低**
- 修改功能時影響範圍明確
- 不會意外影響其他功能

✅ **擴展性更好**
- 新增功能只需新增 feature/
- 不會讓現有結構更混亂

## 風險評估與應對

### 🔴 高風險

#### 風險 1：Import 路徑大量變更可能遺漏
**影響**：導致編譯錯誤或運行時錯誤

**應對措施**：
1. 使用 IDE 的全局搜尋功能檢查
2. 使用 TypeScript 編譯器檢查（`tsc --noEmit`）
3. 漸進式遷移，每次只改一個 feature
4. 每次遷移後立即測試

#### 風險 2：類型定義重複或循環依賴
**影響**：編譯錯誤、類型檢查失效

**應對措施**：
1. 安裝 `eslint-plugin-import` 檢測循環依賴
2. 遵循依賴原則：feature → shared（單向）
3. 共享類型統一放在 `shared/types/`
4. 使用 TypeScript 的 `type` 而非 `interface`（需要時）

### 🟡 中風險

#### 風險 3：Redux store 重組可能影響現有功能
**影響**：狀態管理混亂，功能異常

**應對措施**：
1. 保持 store 結構基本不變
2. 只調整 slices 的組織方式
3. 確保所有 selector 正常工作
4. 完整測試所有使用到狀態的功能

#### 風險 4：路由配置變更需要完整測試
**影響**：部分路由無法訪問

**應對措施**：
1. 建立路由測試清單
2. 手動測試所有路由
3. 考慮添加自動化測試
4. 確保 404 頁面正常工作

### 🟢 低風險

#### 風險 5：單一功能模組遷移（如 auth）
**影響**：僅影響該功能

**應對措施**：
1. 優先遷移獨立性高的功能
2. 每次遷移後立即測試
3. 有問題可快速回退

#### 風險 6：共享元件移動
**影響**：多處引用需要更新

**應對措施**：
1. 使用 IDE 的重構功能
2. 全局搜尋檢查
3. 利用 path aliases 簡化 import

## 工具推薦

### 開發工具
1. **VSCode 擴展**
   - Path Intellisense - 自動完成路徑
   - Auto Import - 自動 import
   - Move TS - 移動檔案自動更新 import

2. **命令行工具**
   ```bash
   # 安裝依賴分析工具
   npm install -D madge

   # 檢查循環依賴
   npx madge --circular --extensions ts,tsx src/

   # 生成依賴圖
   npx madge --image graph.svg src/
   ```

3. **ESLint 配置**
   ```javascript
   // .eslintrc.js
   module.exports = {
     plugins: ['import'],
     rules: {
       'import/no-cycle': 'error',
       'import/no-self-import': 'error',
     }
   };
   ```

### 測試工具
1. **Jest + React Testing Library**
   - 為每個 feature 添加單元測試

2. **Playwright / Cypress**
   - E2E 測試確保功能正常

## 遷移時間線（漸進式方案）

```
Week 1: 2024-XX-XX ~ 2024-XX-XX
├─ Day 1-2: 準備工作 + Auth 目錄結構建立
├─ Day 3-4: Auth 功能完整遷移
└─ Day 5: 測試 + 驗證

Week 2: 2024-XX-XX ~ 2024-XX-XX
├─ Day 1-2: Booking 功能遷移
├─ Day 3: Shared 資源整理
└─ Day 4-5: Dashboard + Home 遷移

Week 3: 2024-XX-XX ~ 2024-XX-XX
├─ Day 1-2: 其他功能遷移
├─ Day 3: 清理舊結構
├─ Day 4: 完整測試
└─ Day 5: 文檔更新 + Code Review
```

## 結論與建議

### 核心建議

✅ **值得遷移，建議採用漸進式方案**

### 理由

1. **專案規模精簡**（~26 個檔案，較原本減少）
   - 檔案數量減少，遷移更容易控制
   - 結構更清晰，便於重組

2. **已有 Feature-based 雛形**
   - pages/auth/（4 個頁面）已按功能完整分組
   - pages/booking/（1 個頁面）結構簡單
   - 不是從零開始，有基礎可以延續

3. **Auth 功能模組完整**
   - 4 個頁面 + 3 個 services + 1 個 layout
   - 是理想的首個遷移範例
   - 成功後可複製模式到其他功能

4. **處於成長階段**
   - 現在改比未來功能更多時改要容易
   - 投資回報率高

5. **風險可控**
   - 漸進式遷移可隨時回退
   - TypeScript 提供類型安全保障
   - Vite 的快速 HMR 便於測試

### 下一步行動

1. **團隊共識**
   - 與團隊討論此方案
   - 確定遷移時間表
   - 分配責任

2. **試點遷移**
   - 先遷移 Auth 功能作為範例
   - 驗證架構可行性
   - 總結經驗教訓

3. **全面推廣**
   - 制定詳細遷移計劃
   - 按照時間線執行
   - 持續測試與調整

4. **文檔完善**
   - 更新開發指南
   - 編寫 feature 開發模板
   - 建立最佳實踐文檔

---

## 附錄

### A. Path Aliases 設置

**tsconfig.json**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@features/*": ["./src/features/*"],
      "@shared/*": ["./src/shared/*"],
      "@store/*": ["./src/store/*"],
      "@styles/*": ["./src/styles/*"],
      "@i18n/*": ["./src/i18n/*"]
    }
  }
}
```

**vite.config.ts**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@store': path.resolve(__dirname, './src/store'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@i18n': path.resolve(__dirname, './src/i18n'),
    },
  },
});
```

### B. Feature 模板結構

```
features/[feature-name]/
├── components/           # UI 元件
│   ├── [FeatureName]Page.tsx
│   ├── [Component1].tsx
│   └── [Component2].tsx
├── services/            # API 服務
│   └── [feature]Services.ts
├── hooks/               # 自定義 hooks
│   └── use[Feature].ts
├── layouts/             # 佈局（如果需要）
│   └── [Feature]Layout.tsx
├── types/               # 類型定義
│   └── index.ts
├── utils/               # 工具函數（如果需要）
│   └── [feature]Utils.ts
└── index.ts             # 統一導出
```

### C. 參考資源

- [Feature-Sliced Design](https://feature-sliced.design/) - 功能切片設計方法論
- [Bulletproof React](https://github.com/alan2207/bulletproof-react) - React 最佳實踐
- [Redux Toolkit Best Practices](https://redux-toolkit.js.org/usage/usage-guide) - Redux 最佳實踐

---

**文檔版本**: 1.0
**建立日期**: 2025-11-12
**最後更新**: 2025-11-12
**維護者**: Development Team
