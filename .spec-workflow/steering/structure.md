# Project Structure

## Directory Organization

```
UniteControlFrontend/
├── src/                          # 主要原始碼目錄
│   ├── features/                 # 功能模組（Feature-based 架構）
│   │   ├── auth/                # 認證功能模組
│   │   │   ├── components/      # 認證相關組件（Login, Register 等）
│   │   │   ├── hooks/           # 認證相關自訂 hooks
│   │   │   ├── layouts/         # 認證頁面佈局（AuthLayout）
│   │   │   ├── services/        # API services（RTK Query）
│   │   │   ├── types/           # TypeScript 類型定義
│   │   │   ├── utils/           # 工具函數（validationRules）
│   │   │   └── index.ts         # 模組統一導出
│   │   │
│   │   └── booking/             # 預訂功能模組
│   │       ├── components/      # 預訂相關組件
│   │       ├── hooks/           # 預訂相關自訂 hooks
│   │       ├── layouts/         # 預訂頁面佈局
│   │       ├── services/        # API services
│   │       ├── types/           # TypeScript 類型定義
│   │       └── index.ts         # 模組統一導出
│   │
│   ├── shared/                  # 共用資源（跨功能模組）
│   │   ├── components/          # 共用組件（Sidebar 等）
│   │   ├── constants/           # 共用常數
│   │   ├── hooks/               # 共用自訂 hooks
│   │   ├── layouts/             # 共用佈局（SidebarLayout）
│   │   ├── pages/               # 通用頁面（NotFound）
│   │   ├── services/            # 共用 API services（baseQuery）
│   │   ├── slices/              # Redux slices（userSlice）
│   │   ├── types/               # 共用類型定義
│   │   └── utils/               # 共用工具函數（errorHandler）
│   │
│   ├── store/                   # Redux store 配置
│   │   └── store.ts             # Store 設定與 middleware 配置
│   │
│   ├── i18n/                    # 國際化配置
│   │   └── index.ts             # i18next 初始化
│   │
│   ├── styles/                  # 全域樣式
│   │
│   ├── assets/                  # 靜態資源
│   │   └── images/              # 圖片資源
│   │       └── background/      # 背景圖片
│   │
│   ├── App.tsx                  # 根組件
│   ├── main.tsx                 # 應用程式入口點
│   ├── routes.tsx               # 路由配置
│   ├── hooks.tsx                # 應用級別的 hooks
│   └── vite-env.d.ts            # Vite 環境變數類型定義
│
├── public/                      # 公開靜態資源（不經過打包）
├── nginx/                       # Nginx 配置檔案
│   └── nginx.conf               # Nginx 伺服器設定
├── .spec-workflow/              # 規格驅動開發工作流程
│   ├── steering/                # 專案指導文件
│   ├── specs/                   # 功能規格
│   └── templates/               # 模板檔案
├── docker-compose.yml           # Docker Compose 配置
├── Dockerfile                   # Docker 建構定義
├── vite.config.ts               # Vite 建構工具配置
├── tsconfig.json                # TypeScript 主要配置
├── tsconfig.app.json            # 應用程式 TypeScript 配置
├── tsconfig.node.json           # Node.js TypeScript 配置
├── tailwind.config.js           # Tailwind CSS 配置
├── postcss.config.js            # PostCSS 配置
├── eslint.config.js             # ESLint 配置
├── package.json                 # 專案依賴與腳本
└── pnpm-lock.yaml               # pnpm 鎖檔案
```

## Naming Conventions

### Files
- **React 組件**: `PascalCase.tsx` (例如: `Login.tsx`, `BookingCreate.tsx`)
- **Services**: `camelCase` + `Services.ts` (例如: `loginServices.ts`, `registerServices.ts`)
- **Utils/Helpers**: `camelCase.ts` (例如: `errorHandler.ts`, `validationRules.ts`)
- **Redux Slices**: `camelCase` + `Slice.ts` (例如: `userSlice.ts`)
- **Layouts**: `PascalCase` + `Layout.tsx` (例如: `AuthLayout.tsx`, `SidebarLayout.tsx`)
- **Pages**: `PascalCase.tsx` (例如: `NotFound.tsx`)
- **Index Files**: `index.ts` (每個功能模組的統一導出檔案)
- **Types**: `types.ts` 或 `[feature].types.ts`
- **Config Files**: `kebab-case` (例如: `vite.config.ts`, `docker-compose.yml`)

### Code
- **React 組件**: `PascalCase` (例如: `LoginPage`, `AuthLayout`)
- **Functions/Methods**: `camelCase` (例如: `onFinish`, `handleSubmit`, `getErrorMessage`)
- **Hooks**: `use` + `PascalCase` (例如: `useLoginUserMutation`, `useAppDispatch`)
- **Constants**: `UPPER_SNAKE_CASE` (例如: `API_BASE_URL`, `TOKEN_KEY`)
- **Variables**: `camelCase` (例如: `isLoading`, `navigate`, `formValues`)
- **Interfaces/Types**: `PascalCase` (例如: `LoginFormValues`, `ApiResponse`)
- **CSS Classes**: `kebab-case` 或 Tailwind utility classes

### TypeScript Specifics
- **Interface**: 優先使用 `interface` 定義物件形狀
- **Type**: 用於聯合類型、交集類型或複雜類型操作
- **Enum**: `PascalCase` (如使用)
- **Generic**: 單字母大寫 `T`, `K`, `V` 或描述性 `PascalCase`

## Import Patterns

### Import Order
本專案遵循以下導入順序（建議）：

1. **React 相關**
   ```typescript
   import React from "react";
   import { useState, useEffect } from "react";
   ```

2. **第三方庫（External dependencies）**
   ```typescript
   import { useNavigate, Link } from "react-router-dom";
   import { Card, Form, Input, Button, message } from "antd";
   ```

3. **內部模組（使用路徑別名）**
   ```typescript
   import { useLoginUserMutation } from "../services/loginServices";
   import AuthLayout from "../layouts/AuthLayout";
   ```

4. **相對路徑導入**
   ```typescript
   import { validationRules } from "../utils/validationRules";
   import type { LoginFormValues } from "../types";
   ```

5. **樣式導入**（如有）
   ```typescript
   import "./Login.css";
   ```

### Module/Package Organization

**路徑別名 (Path Aliases)** - 定義於 `vite.config.ts`:
```typescript
'@features': './src/features'    // 功能模組
'@shared': './src/shared'        // 共用資源
'@store': './src/store'          // Redux store
'@styles': './src/styles'        // 全域樣式
'@i18n': './src/i18n'            // 國際化
'@utils': './src/utils'          // 工具函數
```

**使用範例**:
```typescript
// ✅ 好的做法 - 使用路徑別名
import { Login, Register } from '@features/auth';
import { errorHandler } from '@shared/utils/errorHandler';
import { store } from '@store/store';

// ❌ 避免 - 冗長的相對路徑
import { Login } from '../../../../features/auth/components/Login';
```

**功能模組導出模式** - 每個 feature 使用 `index.ts` 統一導出:
```typescript
// src/features/auth/index.ts
export { default as Login } from './components/Login';
export { loginApi, useLoginUserMutation } from './services/loginServices';
export { validationRules } from './utils/validationRules';
```

## Code Structure Patterns

### File Organization Template

每個 React 組件檔案遵循以下結構：

```typescript
// 1. 檔案路徑註解（可選，但建議）
// src/features/auth/components/Login.tsx

// 2. Imports（按上述順序）
import React from "react";
import { 第三方庫 } from "third-party";
import { 內部模組 } from "@features/...";

// 3. Type/Interface 定義
interface LoginFormValues {
  account: string;
  password: string;
}

// 4. 組件常數（destructuring、常數定義）
const { Title, Text } = Typography;

// 5. 主要組件實現
const LoginPage: React.FC = () => {
  // 5.1 Hooks（useState, useNavigate, RTK Query 等）
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  // 5.2 事件處理函數
  const onFinish = async (values: LoginFormValues) => {
    // 實現邏輯
  };

  // 5.3 JSX 返回
  return (
    <AuthLayout>
      {/* 組件內容 */}
    </AuthLayout>
  );
};

// 6. 預設導出
export default LoginPage;
```

### Function/Method Organization

函數內部組織原則：
```typescript
const handleSubmit = async (values: FormValues) => {
  // 1. 輸入驗證（如需要）
  if (!values.account) return;

  // 2. 變數解構與初始化
  const { account, password } = values;

  // 3. 核心邏輯實現
  try {
    const response = await loginUser({ account, password }).unwrap();

    // 4. 成功處理
    if (response?.token) {
      localStorage.setItem("token", response.token);
      message.success("Login successful");
      navigate("/dashboard");
    }
  } catch (error) {
    // 5. 錯誤處理
    console.error("Login error:", error);
  }
};
```

### Service Layer Organization (RTK Query)

```typescript
// 1. Imports
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithErrorHandler from "@shared/services/baseQueryWithErrorHandler";

// 2. Type definitions
interface LoginRequest { account: string; password: string; }
interface LoginResponse { token: string; user: User; }

// 3. API 定義
export const loginApi = createApi({
  reducerPath: "loginApi",
  baseQuery: baseQueryWithErrorHandler,
  endpoints: (builder) => ({
    loginUser: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

// 4. Export hooks
export const { useLoginUserMutation } = loginApi;
```

## Code Organization Principles

### 1. Single Responsibility Principle
每個檔案應該有一個明確的目的：
- **組件檔案**: 只包含一個主要組件及其相關類型
- **Service 檔案**: 只定義一個 API slice（RTK Query）
- **Utils 檔案**: 包含相關的工具函數，但保持功能聚焦

### 2. Feature-Based Modularity
- 每個功能模組（`features/auth`, `features/booking`）是自包含的
- 模組內部組織清晰：`components`, `services`, `hooks`, `utils`, `types`
- 透過 `index.ts` 提供乾淨的公開 API

### 3. Shared Resource Management
- 跨功能的共用程式碼放在 `shared/` 目錄
- 避免功能模組之間直接相互依賴
- 共用組件（如 `Sidebar`）、工具（如 `errorHandler`）、服務（如 `baseQueryWithErrorHandler`）

### 4. Testability
- 組件邏輯與業務邏輯分離
- Services 使用 RTK Query，易於 mock
- Utils 函數保持純函數特性

### 5. Consistency
- 所有功能模組遵循相同的資料夾結構
- 命名慣例一致
- Import 順序統一

## Module Boundaries

### Core Boundaries

1. **Features vs Shared**
   - **Features**: 業務功能模組，自包含，不互相依賴
   - **Shared**: 跨功能的共用程式碼
   - **規則**: Features 可以導入 Shared，但 Shared 不應導入 Features

2. **Public API vs Internal Implementation**
   - **Public**: 透過 `index.ts` 導出的內容
   - **Internal**: 模組內部的實現細節
   - **規則**: 外部只應透過 `index.ts` 導入，不直接導入內部檔案

3. **Business Logic vs UI**
   - **Business Logic**: Services (RTK Query), Utils, Slices
   - **UI**: Components, Layouts
   - **規則**: UI 組件透過 hooks 呼叫業務邏輯，保持職責分離

4. **Configuration vs Application Code**
   - **Configuration**: `vite.config.ts`, `tailwind.config.js`, `tsconfig.json`
   - **Application**: `src/` 目錄下的程式碼
   - **規則**: 配置檔案位於根目錄，應用程式碼在 `src/`

### Dependency Direction

```
┌─────────────────────────────────────────┐
│              Application Entry          │
│            (main.tsx, App.tsx)          │
└──────────────────┬──────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
    ┌────▼────┐         ┌───▼────┐
    │ Features│         │ Shared │
    │  Auth   │─────────►        │
    │ Booking │         │        │
    └─────────┘         └───┬────┘
                            │
                       ┌────▼────┐
                       │  Store  │
                       └─────────┘
```

**規則**:
- Features 可以使用 Shared
- Shared 不應依賴 Features
- Store 由 Features 和 Shared 的 services/slices 組成
- 所有模組都可以使用 Store 的 types

## Code Size Guidelines

### File Size
- **Components**: 建議 < 300 行
  - 超過時考慮拆分為子組件或提取邏輯到 hooks
- **Services**: 建議 < 200 行
  - 每個 service 檔案對應一個 API slice
- **Utils**: 建議 < 150 行
  - 相關功能可分組，但避免過大

### Function/Method Size
- **Component Functions**: < 50 行
  - 複雜邏輯提取為獨立函數或 custom hooks
- **Event Handlers**: < 30 行
  - 複雜處理邏輯移至獨立函數
- **Utility Functions**: < 20 行（理想狀態）
  - 保持函數單一職責

### Component Complexity
- **Props**: 建議 < 10 個 props
  - 超過時考慮使用配置物件或拆分組件
- **Hooks per Component**: 建議 < 8 個
  - 超過時考慮提取為 custom hook
- **Nesting Depth**: 最大 4 層
  - JSX 嵌套超過 4 層時拆分子組件

### Conditional Rendering
- **Ternary Operators**: 簡單條件（單層）
- **&&/|| Operators**: 簡單存在性檢查
- **Early Returns**: 複雜條件邏輯
- **提取為函數**: 複雜條件判斷邏輯

## React-Specific Patterns

### Component Patterns
1. **Functional Components**: 全部使用函數式組件 + Hooks
2. **TypeScript Typing**: 使用 `React.FC` 或明確定義 props interface
3. **Props Interface**: 每個組件定義清晰的 props interface
4. **Default Export**: 組件使用 default export，工具使用 named export

### Hooks Usage
1. **React Hooks 順序**: 遵循 React Hooks 規則
2. **Custom Hooks**: 複雜邏輯提取為 `use[Name]` custom hooks
3. **RTK Query Hooks**: 使用自動生成的 hooks（如 `useLoginUserMutation`）

### State Management
1. **Local State**: 組件內部使用 `useState`
2. **Global State**: 使用 Redux Toolkit slices
3. **Server State**: 使用 RTK Query（自動快取和同步）
4. **Form State**: 使用 Ant Design Form 管理

## Documentation Standards

### Required Documentation

1. **Public API Components**
   - JSDoc 註解說明組件用途
   - Props 描述（透過 TypeScript interface）
   - 使用範例（如複雜組件）

2. **Complex Business Logic**
   - 演算法邏輯的註解說明
   - 關鍵決策點的註解
   - 非明顯的程式碼需要說明

3. **Utility Functions**
   - JSDoc 說明函數用途
   - 參數和返回值描述
   - 使用範例（如複雜函數）

4. **Feature Modules**
   - `index.ts` 檔案頂部說明模組用途
   - README.md（如果模組很複雜）

### Comment Style

```typescript
/**
 * 驗證使用者登入資訊並返回 token
 *
 * @param credentials - 包含 account 和 password 的物件
 * @returns Promise<LoginResponse> - 包含 token 和使用者資訊
 * @throws {Error} - 當登入失敗時拋出錯誤
 */
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  // 實現邏輯
};
```

### Inline Comments
- **避免無意義註解**: 程式碼應該自我說明
- **說明「為什麼」而非「是什麼」**: 註解應說明決策原因
- **TODO 註解**: 使用 `// TODO:` 標記待辦事項
- **FIXME 註解**: 使用 `// FIXME:` 標記需要修復的問題

### README Files
- **專案根目錄**: 專案整體說明、安裝步驟、使用方法
- **Feature 模組**: 如功能複雜，可在 feature 目錄下建立 README
- **.spec-workflow/**: 規格驅動開發工作流程文件

## Error Handling Patterns

### API Error Handling
本專案使用集中式錯誤處理：
- `baseQueryWithErrorHandler.ts` 統一處理 API 錯誤
- 自動顯示錯誤訊息（透過 Ant Design message）
- 組件層級可選擇性捕獲錯誤進行額外處理

### Form Validation
- 使用 Ant Design Form 的 `rules` 屬性
- 提取為 `validationRules` 工具函數（可重用）
- 顯示即時驗證反饋

### Try-Catch Pattern
```typescript
try {
  const response = await apiCall().unwrap();
  // 成功處理
} catch (error) {
  // 錯誤已由 baseQueryWithErrorHandler 處理
  console.error("Additional context:", error);
}
```

## Build and Deployment Structure

### Development
- **Entry Point**: `src/main.tsx`
- **Dev Server**: Vite dev server (port 5173 預設)
- **Environment**: `.env.development`

### Production Build
- **Build Output**: `dist/` 目錄
- **Static Assets**: 打包優化、tree-shaking、code-splitting
- **Environment**: `.env.production`

### Docker Deployment
```
1. Build Stage (react-app service)
   - Node.js 環境
   - pnpm install
   - pnpm build:prod
   - 輸出到 /app/dist

2. Serve Stage (nginx service)
   - Nginx Alpine
   - 掛載 react_build volume
   - 提供靜態資產
   - Port 8080 對外服務
```

## Future Structure Considerations

### Potential Enhancements
1. **Testing Directory**: 加入 `__tests__` 或 `tests/` 目錄
2. **Storybook**: 加入組件文件和視覺測試
3. **Micro-frontends**: 功能模組可獨立部署
4. **API Types Generation**: 從後端 API schema 自動生成 TypeScript 類型
5. **Component Library**: 將 `shared/components` 提取為獨立套件
