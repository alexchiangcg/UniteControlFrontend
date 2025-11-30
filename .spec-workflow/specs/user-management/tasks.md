# Tasks Document - User Management

本文檔將 User Management 功能拆解為可執行的開發任務。每個任務遵循單一職責原則，包含明確的檔案路徑、依賴關係與完成標準。

## Task Status Legend
- `[ ]` = 待執行 (Pending)
- `[-]` = 進行中 (In Progress)
- `[x]` = 已完成 (Completed)

---

## Phase 1: 專案結構與類型定義

### Task 1.1: 建立 Feature 目錄結構

- [x] 1.1 建立 maintainer-manager feature 目錄結構
  - Files:
    - `src/features/maintainer-manager/components/` (新目錄)
    - `src/features/maintainer-manager/pages/` (新目錄)
    - `src/features/maintainer-manager/services/` (新目錄)
    - `src/features/maintainer-manager/types/` (新目錄)
    - `src/features/maintainer-manager/hooks/` (新目錄)
    - `src/features/maintainer-manager/index.ts` (新檔案)
  - Purpose: 建立 feature-based 模組化架構，遵循專案結構規範
  - _Leverage: 參考 `src/features/auth/` 的目錄結構_
  - _Requirements: 所有 requirements (架構基礎)_
  - _Prompt: **Role**: DevOps Engineer 專精於專案結構規劃與模組化設計 | **Task**: 建立 `src/features/maintainer-manager/` 目錄結構，包含 components、pages、services、types、hooks 子目錄與 index.ts 統一導出檔案，參考 `src/features/auth/` 的組織方式 | **Restrictions**: 必須遵循 structure.md 定義的命名規範，不可修改既有 features 目錄，確保目錄結構一致性 | **Success**: 所有目錄與檔案成功建立，目錄結構符合 feature-based 架構規範，index.ts 已準備好導出模組_

### Task 1.2: 定義 TypeScript 類型

- [x] 1.2 定義使用者相關的 TypeScript 類型
  - File: `src/features/maintainer-manager/types/user.types.ts`
  - Purpose: 建立完整的類型定義，確保類型安全
  - Content:
    - `User` interface（id, username, email, status, notes, createdAt, updatedAt）
    - `UserFormValues` interface（username, email, notes, password?）
    - `UsersResponse` interface（users, total, page, pageSize）
    - `ImportUsersResult` interface（successCount, failedCount, errors?）
    - `UserStatus` type（'active' | 'inactive' | 'archived'）
  - _Leverage: 參考 `src/features/auth/types/` 的類型定義模式_
  - _Requirements: Requirement 1 (使用者列表檢視), Requirement 4 (建立使用者), Requirement 5 (批次匯入)_
  - _Prompt: **Role**: TypeScript Developer 專精於類型系統與介面設計 | **Task**: 在 `src/features/maintainer-manager/types/user.types.ts` 建立完整的使用者相關類型定義，包含 User、UserFormValues、UsersResponse、ImportUsersResult 與 UserStatus，參考 design.md 的 Data Models 章節 | **Restrictions**: 必須使用 TypeScript 嚴格模式，所有欄位需明確定義類型，避免使用 any，確保與後端 API 契約一致 | **Success**: 所有類型定義完整且可編譯，欄位類型正確，符合 design.md 規範_

---

## Phase 2: API Services (RTK Query)

### Task 2.1: 建立 RTK Query API Service

- [x] 2.1 建立 userManagementApi RTK Query service
  - File: `src/features/maintainer-manager/services/userManagementServices.ts`
  - Purpose: 封裝所有使用者管理相關的 API 呼叫，使用 RTK Query 管理快取與狀態
  - Endpoints:
    - `getUsers` (query) - GET /api/users
    - `createUser` (mutation) - POST /api/users
    - `updateUser` (mutation) - PUT /api/users/:id
    - `updateUserStatus` (mutation) - PATCH /api/users/:id/status (with optimistic update)
    - `archiveUser` (mutation) - DELETE /api/users/:id
    - `importUsers` (mutation) - POST /api/users/import
  - _Leverage: `src/shared/services/baseQueryWithErrorHandler.ts`, `src/features/auth/services/loginServices.ts` (參考模式)_
  - _Requirements: Requirement 1-9 (所有 API 相關需求)_
  - _Prompt: **Role**: Backend Developer 專精於 RTK Query 與 API 整合 | **Task**: 建立 `userManagementApi` RTK Query service，實作 6 個 endpoints（getUsers、createUser、updateUser、updateUserStatus with optimistic update、archiveUser、importUsers），使用 `baseQueryWithErrorHandler` 作為 baseQuery，參考 design.md Component 7 的詳細規格 | **Restrictions**: 必須使用 `baseQueryWithErrorHandler`，所有 mutation 需 invalidate 'Users' tag，updateUserStatus 需實作樂觀更新（optimistic update），不可繞過錯誤處理機制 | **Success**: 所有 6 個 endpoints 正確定義，樂觀更新邏輯運作正常（失敗時自動回滾），hooks 自動生成並可導出（useGetUsersQuery, useCreateUserMutation 等）_

### Task 2.2: 註冊 API Service 至 Redux Store

- [x] 2.2 將 userManagementApi 註冊至 Redux store
  - File: `src/store/store.ts` (修改既有檔案)
  - Purpose: 整合 RTK Query API 至全域 store，啟用快取與 middleware
  - Changes:
    - 導入 `userManagementApi`
    - 新增 `reducer: { [userManagementApi.reducerPath]: userManagementApi.reducer }`
    - 新增 middleware: `concat(userManagementApi.middleware)`
  - _Leverage: 現有 store 配置，參考其他 API 的註冊方式（如 loginApi）_
  - _Requirements: Requirement 1-9 (API 狀態管理基礎)_
  - _Prompt: **Role**: Redux Engineer 專精於 store 配置與 middleware 整合 | **Task**: 在 `src/store/store.ts` 註冊 `userManagementApi`，新增 reducer 與 middleware，參考現有 API 的註冊模式（例如 loginApi） | **Restrictions**: 不可修改既有 API 的配置，必須保持 store 結構一致性，確保 middleware 順序正確 | **Success**: userManagementApi 成功註冊至 store，reducer 與 middleware 正確配置，API hooks 可在元件中正常使用_

---

## Phase 3: UI 元件開發

### Task 3.1: 建立 UserStatusBadge 元件

- [x] 3.1 建立 UserStatusBadge 狀態顯示元件
  - File: `src/features/maintainer-manager/components/UserStatusBadge.tsx`
  - Purpose: 顯示使用者狀態的語義化 badge（Active/Inactive/Archived）
  - Props: `{ status: UserStatus }`
  - Styling: 使用 Tailwind utilities + design tokens
    - Active: `bg-success-light text-success`
    - Inactive: `bg-error-light text-error`
    - Archived: `bg-gray-200 text-gray-500`
  - _Leverage: Tailwind config design tokens（`tailwind.config.js`）_
  - _Requirements: Requirement 1 (列表檢視 - 狀態顯示)_
  - _Prompt: **Role**: Frontend Developer 專精於 React 元件開發與 Tailwind CSS | **Task**: 建立 `UserStatusBadge.tsx`，根據 status prop（'active' | 'inactive' | 'archived'）顯示對應顏色的 badge，使用 Tailwind utilities 與 design tokens（bg-success-light、text-success 等），參考 design.md Component 4 | **Restrictions**: 嚴禁使用 inline style（style={{}}），僅能使用 Tailwind utilities，必須對應專案 design tokens，所有註解使用台灣繁體中文 | **Success**: 元件正確渲染三種狀態的 badge，顏色與樣式符合設計規範，無 inline style，TypeScript 類型正確_

### Task 3.2: 建立 UserSearchBar 元件

- [x] 3.2 建立 UserSearchBar 搜尋與篩選列元件
  - File: `src/features/maintainer-manager/components/UserSearchBar.tsx`
  - Purpose: 提供搜尋框、狀態篩選器、Import Files 與 Create User 按鈕
  - Props:
    ```tsx
    interface UserSearchBarProps {
      onSearchChange: (keyword: string) => void;
      onStatusFilterChange: (status: string) => void;
      onImportClick: () => void;
      onCreateClick: () => void;
    }
    ```
  - Components:
    - `Input.Search` (Ant Design)
    - `Select` (Ant Design) - All Status, Active, Inactive, Archived
    - `Button` × 2 (Import Files, Create User)
  - _Leverage: Ant Design 5.22.2 元件，Tailwind utilities_
  - _Requirements: Requirement 2 (搜尋), Requirement 3 (篩選), Requirement 4 (建立), Requirement 5 (匯入)_
  - _Prompt: **Role**: Frontend Developer 專精於 React 與 Ant Design | **Task**: 建立 `UserSearchBar.tsx`，整合 Input.Search（搜尋框）、Select（狀態篩選）、兩個 Button（Import Files、Create User），使用 Ant Design 元件與 Tailwind 排版，參考 design.md Component 2 | **Restrictions**: 必須使用 Ant Design 元件，禁用 inline style，使用 Tailwind utilities 進行排版（flex、gap 等），所有文字需支援 i18next（未來擴充） | **Success**: 搜尋框、下拉選單、按鈕正確渲染，事件回調函數正確觸發，UI 符合設計規範_

### Task 3.3: 建立 UserTable 元件

- [x] 3.3 建立 UserTable 使用者列表表格元件
  - File: `src/features/maintainer-manager/components/UserTable.tsx`
  - Purpose: 顯示使用者列表、分頁、操作按鈕（Edit、Archive、Status Switch）
  - Props:
    ```tsx
    interface UserTableProps {
      searchKeyword: string;
      statusFilter: string;
    }
    ```
  - Features:
    - 使用 Ant Design `Table` 元件
    - Columns: User Name, Create Time, Updated Time, Notes, Status, Action
    - 整合 `useGetUsersQuery` hook
    - 整合 `useUpdateUserStatusMutation`, `useArchiveUserMutation`
    - 分頁控制（顯示 "Total XX items"）
    - 操作列：Status Switch、Edit Button、Archive Button
  - _Leverage: Ant Design Table, Switch, Button，`userManagementServices` hooks，`UserStatusBadge`_
  - _Requirements: Requirement 1 (列表), Requirement 6 (編輯), Requirement 7 (狀態切換), Requirement 8 (歸檔), Requirement 9 (分頁)_
  - _Prompt: **Role**: React Developer 專精於 Ant Design Table 與 RTK Query 整合 | **Task**: 建立 `UserTable.tsx`，使用 Ant Design Table 顯示使用者列表，整合 `useGetUsersQuery`（傳入 searchKeyword, statusFilter）、`useUpdateUserStatusMutation`、`useArchiveUserMutation`，實作 7 個欄位（User Name, Create Time, Updated Time, Notes, Status, Action），在 Action 欄位顯示 Switch（狀態切換）、Edit Button、Archive Button，參考 design.md Component 3 | **Restrictions**: 必須使用 Ant Design Table 元件，Status 欄位使用 `UserStatusBadge`，Archived 狀態需隱藏 Edit 和 Archive 按鈕，狀態切換需顯示確認對話框，所有操作需錯誤處理 | **Success**: 表格正確顯示使用者資料，分頁功能運作正常，Switch 切換狀態成功（含樂觀更新），Edit 與 Archive 按鈕觸發正確事件，loading 與 error 狀態正確處理_

### Task 3.4: 建立 UserFormModal 元件

- [x] 3.4 建立 UserFormModal 建立/編輯使用者表單元件
  - File: `src/features/maintainer-manager/components/UserFormModal.tsx`
  - Purpose: 提供建立與編輯使用者的表單對話框
  - Props:
    ```tsx
    interface UserFormModalProps {
      visible: boolean;
      mode: 'create' | 'edit';
      initialValues?: User;
      onClose: () => void;
      onSubmitSuccess: () => void;
    }
    ```
  - Components:
    - `Modal` (Ant Design)
    - `Form` (Ant Design) - username, email, notes, password (僅 create mode)
    - `Button` (Submit)
  - Features:
    - 整合 `useCreateUserMutation`, `useUpdateUserMutation`
    - 表單驗證（required, email format）
    - 提交成功後顯示 success message 並關閉 modal
  - _Leverage: Ant Design Modal, Form, Input, Button，`userManagementServices` hooks_
  - _Requirements: Requirement 4 (建立使用者), Requirement 6 (編輯使用者)_
  - _Prompt: **Role**: Full-stack Developer 專精於 React Form 處理與 API 整合 | **Task**: 建立 `UserFormModal.tsx`，使用 Ant Design Modal + Form 實作建立/編輯使用者表單，整合 `useCreateUserMutation` 與 `useUpdateUserMutation`，根據 mode prop 切換建立/編輯模式，表單欄位包含 username（required）、email（required + email validation）、notes（optional）、password（僅 create mode 顯示），參考 design.md Component 5 | **Restrictions**: 必須使用 Ant Design Form 驗證規則，禁用 inline style，提交成功需顯示 message.success，錯誤處理由 baseQueryWithErrorHandler 統一處理，表單提交後需呼叫 onSubmitSuccess 回調 | **Success**: 表單正確顯示並驗證欄位，建立/編輯模式切換正常，API 呼叫成功後 modal 關閉並顯示 success message，錯誤時顯示錯誤訊息_

### Task 3.5: 建立 ImportUsersModal 元件

- [x] 3.5 建立 ImportUsersModal 批次匯入使用者元件
  - File: `src/features/maintainer-manager/components/ImportUsersModal.tsx`
  - Purpose: 提供批次匯入使用者的檔案上傳對話框
  - Props:
    ```tsx
    interface ImportUsersModalProps {
      visible: boolean;
      onClose: () => void;
      onImportSuccess: () => void;
    }
    ```
  - Components:
    - `Modal` (Ant Design)
    - `Upload` (Ant Design) - accept .csv, .xlsx
    - `Button` (Select File, Upload)
  - Features:
    - 整合 `useImportUsersMutation`
    - 檔案格式驗證（僅接受 .csv, .xlsx）
    - 上傳成功顯示成功/失敗數量
  - _Leverage: Ant Design Modal, Upload, Button，`userManagementServices` hooks_
  - _Requirements: Requirement 5 (批次匯入使用者)_
  - _Prompt: **Role**: Frontend Developer 專精於檔案上傳與 React 元件開發 | **Task**: 建立 `ImportUsersModal.tsx`，使用 Ant Design Modal + Upload 實作批次匯入使用者功能，整合 `useImportUsersMutation`，限制檔案格式為 .csv 與 .xlsx，上傳成功後顯示匯入結果（成功數量、失敗數量），參考 design.md Component 6 | **Restrictions**: 必須在前端驗證檔案副檔名，使用 beforeUpload={() => false} 阻止自動上傳，上傳需使用 FormData，成功後顯示 message.success 並呼叫 onImportSuccess，錯誤時顯示詳細錯誤訊息 | **Success**: Upload 元件正確配置，僅接受 .csv/.xlsx 檔案，上傳成功後顯示匯入結果，錯誤時顯示錯誤訊息_

### Task 3.6: 建立 UserManagementPage 主頁面

- [x] 3.6 建立 UserManagementPage 主頁面元件
  - File: `src/features/maintainer-manager/pages/UserManagement.tsx`
  - Purpose: 整合所有子元件，提供完整的使用者管理介面
  - Components:
    - `SidebarLayout` (from `@shared/layouts/SidebarLayout`)
    - `Breadcrumb` (Ant Design) - Maintainer Manager / User Management
    - `Tabs` (Ant Design) - General Settings, Capability Settings
    - `UserSearchBar`
    - `UserTable`
    - `UserFormModal`
    - `ImportUsersModal`
  - State Management:
    - `activeTab`: 'general' | 'capability'
    - `searchKeyword`: string
    - `statusFilter`: string
    - `isFormModalVisible`: boolean
    - `formMode`: 'create' | 'edit'
    - `selectedUser`: User | undefined
    - `isImportModalVisible`: boolean
  - _Leverage: `SidebarLayout`, `Breadcrumb`, `Tabs`, 所有已建立的子元件_
  - _Requirements: 所有 Requirements (1-10)_
  - _Prompt: **Role**: Senior React Developer 專精於頁面整合與狀態管理 | **Task**: 建立 `UserManagement.tsx` 主頁面，整合 SidebarLayout（activeId="users"）、Breadcrumb、Tabs（General Settings / Capability Settings）、UserSearchBar、UserTable、UserFormModal、ImportUsersModal，管理頁面級狀態（搜尋、篩選、modal 顯示），參考 design.md Component 1，遵循 structure.md 的 React 元件組織規範 | **Restrictions**: 必須使用 SidebarLayout 包裝整個頁面，Breadcrumb 顯示正確路徑，Tabs 切換保留搜尋與篩選條件，所有 modal 的開關邏輯需正確，禁用 inline style，所有註解使用台灣繁體中文 | **Success**: 頁面正確渲染所有子元件，Tab 切換正常，搜尋與篩選功能運作，Create User 與 Import Files 按鈕正確開啟 modal，Edit 按鈕正確傳遞使用者資料至 modal_

### Task 3.7: 建立 useUserFilters 自訂 Hook

- [x] 3.7 建立 useUserFilters 自訂 hook（可選，簡化邏輯）
  - File: `src/features/maintainer-manager/hooks/useUserFilters.ts`
  - Purpose: 封裝搜尋與篩選邏輯，包含 debounce 處理
  - Returns:
    ```tsx
    {
      searchKeyword: string;
      statusFilter: string;
      setSearchKeyword: (keyword: string) => void;
      setStatusFilter: (status: string) => void;
    }
    ```
  - Features:
    - 搜尋框輸入 debounce（300ms）
  - _Leverage: React useState, useMemo, lodash debounce 或自訂實作_
  - _Requirements: Requirement 2 (搜尋), Requirement 3 (篩選)_
  - _Prompt: **Role**: React Developer 專精於 custom hooks 與效能優化 | **Task**: 建立 `useUserFilters.ts` custom hook，封裝搜尋與篩選狀態管理，實作搜尋框輸入的 debounce 處理（300ms），參考 design.md Component 8 | **Restrictions**: 必須使用 React hooks（useState, useMemo），debounce 實作需正確（可使用 lodash 或自訂），確保 hook 可重用，避免記憶體洩漏 | **Success**: Hook 正確管理搜尋與篩選狀態，debounce 運作正常（300ms 延遲），可在 UserManagementPage 中正常使用_

---

## Phase 4: 路由整合

### Task 4.1: 新增路由定義

- [x] 4.1 新增 User Management 路由至 routes.tsx
  - File: `src/routes.tsx` (修改既有檔案)
  - Purpose: 將 User Management 頁面整合至路由系統
  - Changes:
    - 導入 `UserManagement` 頁面
    - 新增路由：`{ path: '/maintainer/users', element: <UserManagement /> }`
  - _Leverage: 現有路由配置（React Router DOM 7.0.1）_
  - _Requirements: Requirement 1 (頁面存取)_
  - _Prompt: **Role**: Frontend Developer 專精於 React Router 配置 | **Task**: 在 `src/routes.tsx` 新增 User Management 頁面路由，path 為 `/maintainer/users`，element 為 `<UserManagement />`，參考現有路由配置模式 | **Restrictions**: 不可修改既有路由，確保路由順序正確，需考慮權限保護（如有），遵循現有路由結構 | **Success**: 路由成功新增，導航至 `/maintainer/users` 可正確顯示 User Management 頁面_

### Task 4.2: 更新 Sidebar 選單項目

- [x] 4.2 更新 Sidebar 選單，新增 Users 子項目
  - File: `src/shared/layouts/SidebarLayout.tsx` (修改既有檔案)
  - Purpose: 在 Maintainer Manager 選單中新增 Users 項目
  - Changes:
    - 在 `sampleSidebarItems` 的 `maintainer` 項目的 `children` 中新增：
      ```tsx
      { id: "users", label: "Users", href: "/maintainer/users" }
      ```
  - _Leverage: 現有 Sidebar 配置_
  - _Requirements: Requirement 1 (導航存取)_
  - _Prompt: **Role**: Frontend Developer 專精於 UI 導航與 Ant Design | **Task**: 在 `src/shared/layouts/SidebarLayout.tsx` 的 `sampleSidebarItems` 中，找到 `maintainer` 項目，在其 `children` 陣列中新增 `{ id: "users", label: "Users", href: "/maintainer/users" }` | **Restrictions**: 不可修改其他選單項目，確保新項目順序正確（Node、Users、Group），label 使用正確的命名（Users） | **Success**: Sidebar 中的 Maintainer Manager 展開後顯示 Users 子項目，點擊可正確導航至 /maintainer/users_

---

## Phase 5: 模組導出與整合

### Task 5.1: 配置 Feature 模組導出

- [x] 5.1 配置 maintainer-manager feature 的統一導出
  - File: `src/features/maintainer-manager/index.ts`
  - Purpose: 統一導出 feature 的公開 API，便於其他模組導入
  - Exports:
    ```tsx
    export { default as UserManagement } from './pages/UserManagement';
    export * from './services/userManagementServices';
    export * from './types/user.types';
    ```
  - _Leverage: 參考 `src/features/auth/index.ts` 的導出模式_
  - _Requirements: 所有 Requirements (模組化架構)_
  - _Prompt: **Role**: TypeScript Developer 專精於模組化設計與導出管理 | **Task**: 在 `src/features/maintainer-manager/index.ts` 統一導出頁面元件（UserManagement）、API services（所有 hooks）、類型定義（User, UserFormValues 等），參考 `src/features/auth/index.ts` 的模式 | **Restrictions**: 僅導出公開 API，內部元件不應導出，確保導出命名清晰，遵循 named export 與 default export 規範 | **Success**: index.ts 正確導出所有公開模組，其他 feature 可透過 `@features/maintainer-manager` 導入_

---

## Phase 6: 測試

### Task 6.1: 建立元件單元測試

- [x] 6.1 建立 UserStatusBadge 單元測試
  - File: `src/features/maintainer-manager/components/__tests__/UserStatusBadge.test.tsx`
  - Purpose: 測試 UserStatusBadge 元件的正確性
  - Test Cases:
    - 測試 active 狀態渲染正確顏色與文字
    - 測試 inactive 狀態渲染正確顏色與文字
    - 測試 archived 狀態渲染正確顏色與文字
  - _Leverage: Vitest, React Testing Library_
  - _Requirements: Requirement 1 (狀態顯示)_
  - _Prompt: **Role**: QA Engineer 專精於 React 元件測試與 Vitest | **Task**: 建立 `UserStatusBadge.test.tsx`，使用 Vitest + React Testing Library 測試三種狀態（active, inactive, archived）的渲染結果，驗證文字內容與 CSS class 是否正確 | **Restrictions**: 必須使用 React Testing Library 的最佳實踐，測試 UI 結果而非實作細節，覆蓋所有狀態分支，確保測試獨立且可重複執行 | **Success**: 所有測試通過，覆蓋率達 100%，測試穩定且快速_

- [x] 6.2 建立 UserTable 單元測試
  - File: `src/features/maintainer-manager/components/__tests__/UserTable.test.tsx`
  - Purpose: 測試 UserTable 元件的資料顯示與互動
  - Test Cases:
    - 測試表格正確顯示使用者資料
    - 測試 loading 狀態顯示
    - 測試 Status Switch 觸發 mutation
    - 測試 Edit 按鈕觸發回調
    - 測試 Archive 按鈕觸發 mutation
  - _Leverage: Vitest, React Testing Library, MSW (Mock Service Worker)_
  - _Requirements: Requirement 1, 6, 7, 8 (列表、編輯、狀態切換、歸檔)_
  - _Prompt: **Role**: QA Engineer 專精於整合測試與 RTK Query mock | **Task**: 建立 `UserTable.test.tsx`，使用 Vitest + React Testing Library + MSW mock API 回應，測試表格資料顯示、loading 狀態、Switch 切換、Edit 按鈕、Archive 按鈕的互動邏輯 | **Restrictions**: 必須 mock RTK Query hooks，使用 MSW mock API 回應，測試使用者互動而非內部實作，確保測試不依賴真實 API | **Success**: 所有測試通過，覆蓋核心互動邏輯，測試穩定且快速_

- [x] 6.3 建立 UserFormModal 單元測試
  - File: `src/features/maintainer-manager/components/__tests__/UserFormModal.test.tsx`
  - Purpose: 測試表單驗證與提交邏輯
  - Test Cases:
    - 測試表單欄位驗證（required, email format）
    - 測試 create mode 提交成功
    - 測試 edit mode 提交成功
    - 測試 API 錯誤處理
  - _Leverage: Vitest, React Testing Library, MSW_
  - _Requirements: Requirement 4, 6 (建立、編輯使用者)_
  - _Prompt: **Role**: QA Engineer 專精於表單測試與驗證邏輯 | **Task**: 建立 `UserFormModal.test.tsx`，使用 Vitest + React Testing Library 測試表單驗證（username required, email format）、create/edit mode 切換、提交成功與失敗場景 | **Restrictions**: 必須 mock API mutations，測試表單驗證錯誤訊息顯示，測試成功後 modal 關閉，確保測試覆蓋邊界條件 | **Success**: 所有測試通過，表單驗證邏輯正確，成功與錯誤場景皆有覆蓋_

### Task 6.2: 建立 E2E 測試（視覺回歸）

- [x] 6.4 使用 Playwright MCP 建立 E2E 測試與視覺回歸測試
  - File: `src/features/maintainer-manager/tests/visual/UserManagement.spec.ts`
  - Purpose: 使用 **Playwright MCP** 測試完整的使用者旅程與視覺回歸
  - Test Cases:
    - 測試頁面載入與列表顯示
    - 測試搜尋與篩選功能
    - 測試建立使用者流程
    - 測試編輯使用者流程
    - 測試狀態切換流程
    - 視覺回歸：使用 Playwright MCP 的 `browser_take_screenshot` 進行截圖比對與 Figma 設計一致性
  - Viewport: 使用 Figma Frame 尺寸（透過 Figma MCP 取得）
  - _Leverage: **Playwright MCP** (mcp__playwright__*), Figma MCP (mcp__figma-dev-mode__get_screenshot)_
  - _Requirements: 所有 Requirements (完整使用者旅程)_
  - _Prompt: **Role**: QA Automation Engineer 專精於 Playwright MCP 與視覺回歸測試 | **Task**: Implement the task for spec user-management, first run spec-workflow-guide to get the workflow guide then implement the task: 使用 **Playwright MCP tools**（`mcp__playwright__browser_navigate`, `mcp__playwright__browser_click`, `mcp__playwright__browser_type`, `mcp__playwright__browser_snapshot`, `mcp__playwright__browser_take_screenshot` 等）建立 `UserManagement.spec.ts` E2E 測試，測試完整的使用者旅程（頁面載入、搜尋、篩選、建立、編輯、狀態切換），並使用 `browser_take_screenshot` 進行視覺回歸測試（截圖比對），viewport 使用 `browser_resize` 設定為 Figma Frame 的尺寸 | **Restrictions**: **必須使用 Playwright MCP tools 而非一般的 Playwright**，所有瀏覽器操作需透過 MCP tools（browser_navigate, browser_click, browser_type, browser_snapshot, browser_take_screenshot 等），測試需在隔離環境執行（清理測試資料），視覺回歸需使用 `browser_take_screenshot` 建立 baseline 截圖，測試需穩定且可在 CI/CD 執行 | **_Instructions_**: 在開始實作前，先在 tasks.md 中將此任務狀態從 `[ ]` 改為 `[-]`。完成後，使用 log-implementation tool 記錄實作詳情（包含 artifacts：apiEndpoints, components, functions, integrations 等），然後將任務狀態改為 `[x]`。 | **Success**: 使用 Playwright MCP tools 成功執行 E2E 測試，覆蓋所有關鍵使用者旅程，使用 `browser_take_screenshot` 建立視覺回歸 baseline 並可比對差異，測試穩定且可重複執行_

---

## Task Execution Notes

### 執行順序
1. **Phase 1** 必須最先完成（建立目錄與類型定義）
2. **Phase 2** 依賴 Phase 1（API services 需要類型定義）
3. **Phase 3** 依賴 Phase 2（UI 元件需要 API hooks）
4. **Phase 4** 依賴 Phase 3（路由需要頁面元件）
5. **Phase 5** 可與 Phase 4 並行
6. **Phase 6** 應在所有功能完成後執行

### Implementation Workflow (重要)

每個任務在實作時，請遵循以下流程：

1. **開始任務前**：
   - 編輯 `tasks.md`，將該任務的狀態從 `[ ]` 改為 `[-]`

2. **實作過程**：
   - 閱讀任務的 `_Prompt` 欄位，理解角色、任務、限制與成功標準
   - 參考 `_Leverage` 欄位列出的既有程式碼與工具
   - 確保符合 `_Requirements` 欄位列出的需求

3. **完成任務後**：
   - 使用 `log-implementation` tool 記錄實作詳情：
     - `taskId`: 任務編號（例如："1.1", "3.2"）
     - `summary`: 實作摘要（1-2 句話）
     - `filesModified`: 修改的檔案清單
     - `filesCreated`: 建立的檔案清單
     - `statistics`: 程式碼統計（linesAdded, linesRemoved）
     - **`artifacts`**: **必填**，包含結構化的實作資料：
       - `apiEndpoints`: 建立/修改的 API endpoints（method, path, purpose, location）
       - `components`: 建立的 UI 元件（name, type, purpose, location, props）
       - `functions`: 建立的工具函數（name, signature, location）
       - `classes`: 建立的類別（name, methods, location）
       - `integrations`: 前後端整合模式（description, frontendComponent, backendEndpoint, dataFlow）
   - 編輯 `tasks.md`，將該任務的狀態從 `[-]` 改為 `[x]`

4. **檢查點**：
   - 確保符合 **Success** 欄位定義的完成標準
   - 執行相關測試（如有）
   - 確認無 TypeScript 編譯錯誤
   - 確認無 ESLint 警告

### 技術規範提醒
- **禁用 inline style**：所有樣式必須使用 Tailwind utilities 或 Ant Design 元件樣式
- **Design Tokens**：顏色、字體、間距必須來自 `tailwind.config.js` 定義的 tokens
- **TypeScript 嚴格模式**：所有程式碼必須通過 TypeScript 編譯，無 any 類型
- **註解語言**：所有註解必須使用台灣繁體中文
- **命名規範**：遵循 `structure.md` 定義的命名慣例
- **錯誤處理**：使用 `baseQueryWithErrorHandler` 統一處理 API 錯誤

### 依賴關係圖

```
Phase 1 (目錄 + 類型)
    ↓
Phase 2 (API Services)
    ↓
Phase 3 (UI 元件)
    ├─→ Task 3.1 (UserStatusBadge) ─→ Task 3.3 (UserTable)
    ├─→ Task 3.2 (UserSearchBar) ───→ Task 3.6 (UserManagementPage)
    ├─→ Task 3.3 (UserTable) ───────→ Task 3.6 (UserManagementPage)
    ├─→ Task 3.4 (UserFormModal) ───→ Task 3.6 (UserManagementPage)
    ├─→ Task 3.5 (ImportUsersModal) ─→ Task 3.6 (UserManagementPage)
    └─→ Task 3.7 (useUserFilters) ──→ Task 3.6 (UserManagementPage)
    ↓
Phase 4 (路由整合)
    ↓
Phase 5 (模組導出)
    ↓
Phase 6 (測試)
```

---

## 總結

此 Tasks Document 將 User Management 功能拆解為 **20 個可執行的開發任務**，涵蓋：
- ✅ 專案結構建立
- ✅ TypeScript 類型定義
- ✅ RTK Query API Services（6 個 endpoints）
- ✅ 7 個 UI 元件
- ✅ 路由整合
- ✅ 單元測試 + E2E 測試 + 視覺回歸測試

每個任務包含明確的檔案路徑、依賴關係、實作提示與完成標準，確保開發流程順暢且符合專案架構規範。
