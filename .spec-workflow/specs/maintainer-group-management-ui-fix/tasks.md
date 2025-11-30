# Tasks Document

## Task Overview

本規格包含兩大部分：
1. **UI 修復** (Task 1)：修復 UserTable Action 欄位的佈局問題
2. **Playwright MCP 測試** (Tasks 2-6)：建立完整的 E2E 回歸測試套件

---

## Phase 1: UI 修復

- [x] 1. 修復 UserTable Action 欄位佈局
  - **File:** `src/features/maintainer-manager/components/UserTable.tsx`
  - **Description:** 使用自適應寬度方案修復 Action 欄位的佈局問題，確保 Switch、Edit、Archive 按鈕正確顯示且不重疊
  - **Changes:**
    - 移除 Action 欄位的固定寬度 `width: 200`
    - 調整 flex 容器間距從 `gap-3` 至 `gap-2`
    - 添加 `flex-nowrap` 和 `whitespace-nowrap` 防止換行
    - 為所有操作元件添加 `flex-shrink-0` 防止收縮
    - 在按鈕文字外包裝 `<span className="whitespace-nowrap">`
  - **Testing:** 在瀏覽器中手動測試驗證佈局正確
  - **_Leverage:** 現有的 Ant Design Table、Switch、Button 組件，Tailwind CSS utility classes
  - **_Requirements:** Requirement 1 (修復 UserTable Action 欄位佈局問題)
  - **_Prompt:**
    ```
    Implement the task for spec maintainer-group-management-ui-fix, first run spec-workflow-guide to get the workflow guide then implement the task:

    Role: Frontend Developer 專精於 React、Ant Design 和響應式佈局設計

    Task: 修復 src/features/maintainer-manager/components/UserTable.tsx 的 Action 欄位佈局問題，實現 Requirement 1 的所有驗收標準。根據 design.md 的「自適應寬度方案」，移除固定寬度並優化 flex 佈局。

    Context:
    - 閱讀 design.md 的 "Detailed Design > UI Fix: Action Column Width and Layout" 章節
    - 當前問題：Action 欄位使用固定 width: 200，導致三個操作元件（Switch、Edit、Archive）擠壓或重疊
    - 設計原則：優先使用相對定位和自適應內容寬度

    Implementation Steps:
    1. 定位到 UserTable.tsx 第 133-186 行的 Action 欄位定義
    2. 移除 `width: 200` 欄位屬性（讓 Table 根據內容自動計算寬度）
    3. 修改 render 函數中的 flex 容器：
       - 將 `gap-3` 改為 `gap-2`
       - 添加 `flex-nowrap` 和 `whitespace-nowrap`
    4. 為 Switch 組件的 className 添加 `flex-shrink-0`
    5. 為兩個 Button 組件添加 `flex-shrink-0`
    6. 將按鈕內的文字 "Edit" 和 "Archive" 包裝在 `<span className="whitespace-nowrap">` 中
    7. 保持其他程式碼不變（不要修改事件處理函數、條件邏輯等）

    Restrictions:
    - 不要使用固定寬度（如 width: 260）
    - 不要使用 fixed: 'right' 固定欄位
    - 不要修改其他欄位的定義
    - 不要修改 handleStatusToggle 和 handleArchive 函數
    - 不要添加 size="small" 到 Button（保持預設尺寸）
    - 遵循專案現有的程式碼風格和命名規範

    Success Criteria:
    - 移除 Action 欄位的 width 屬性
    - flex 容器使用 gap-2、flex-nowrap、whitespace-nowrap
    - 所有操作元件（Switch、Button）包含 flex-shrink-0
    - 按鈕文字使用 whitespace-nowrap 包裝
    - 在瀏覽器中測試：三個操作元件在同一行顯示且不重疊
    - 在瀏覽器中測試：調整視窗大小時佈局保持穩定
    - 現有的單元測試仍然通過（如需更新測試快照）

    Post-Implementation:
    1. 使用 Edit tool 標記 tasks.md 中的 Task 1 為 in-progress [-]
    2. 完成修改後，在本地瀏覽器測試驗證
    3. 使用 log-implementation tool 記錄實施詳情：
       - taskId: "1"
       - summary: "修復 UserTable Action 欄位佈局，使用自適應寬度替代固定寬度"
       - artifacts.components: 記錄 UserTable 組件的修改
       - filesModified: ["src/features/maintainer-manager/components/UserTable.tsx"]
       - statistics: 記錄代碼變更統計
    4. 使用 Edit tool 標記 tasks.md 中的 Task 1 為 completed [x]
    ```

---

## Phase 2: Playwright MCP E2E 測試

- [x] 2. 使用 Playwright MCP 建立頁面導航和基本驗證測試
  - **Description:** 驗證能正確導航至 Group Management 頁面，並確認頁面標題和基本結構存在
  - **Testing Scope:**
    - 導航至頁面
    - 驗證頁面標題 "Group Management"
    - 驗證麵包屑導航
  - **Tools:** `mcp__playwright__browser_navigate`, `mcp__playwright__browser_snapshot`
  - **_Leverage:** Playwright MCP 工具，開發環境應用程式
  - **_Requirements:** Requirement 2.1 (驗證頁面標題正確顯示)
  - **_Prompt:**
    ```
    Implement the task for spec maintainer-group-management-ui-fix, first run spec-workflow-guide to get the workflow guide then implement the task:

    Role: QA Automation Engineer 專精於 E2E 測試和 Playwright

    Task: 使用 Playwright MCP 工具建立頁面導航和基本驗證測試，實現 Requirement 2.1 的驗收標準。

    Context:
    - 閱讀 design.md 的 "Playwright MCP Testing Strategy" 章節
    - 測試環境：本地開發環境 (localhost)
    - 目標頁面：Group Management 列表頁面

    Implementation Steps:
    1. 確認開發伺服器正在運行（通常是 http://localhost:5173）
    2. 使用 mcp__playwright__browser_navigate 導航至 Group Management 頁面
       - URL 路徑需要根據實際路由配置確定（可能是 /maintainer-manager/groups 或類似路徑）
    3. 使用 mcp__playwright__browser_wait_for 等待頁面載入完成
       - 等待文字 "Group Management" 出現
    4. 使用 mcp__playwright__browser_snapshot 獲取頁面結構
    5. 驗證以下元素存在：
       - 頁面標題 "Group Management"
       - 麵包屑導航 "Maintainer Manager / Group Management"
    6. 記錄測試結果和任何發現的問題

    MCP Tools Usage:
    - mcp__playwright__browser_navigate: 導航至目標頁面
    - mcp__playwright__browser_wait_for: 等待頁面元素出現
    - mcp__playwright__browser_snapshot: 獲取頁面可訪問性快照
    - mcp__playwright__browser_take_screenshot: 截圖作為證據

    Restrictions:
    - 只驗證基本頁面結構，不測試表格內容（留給後續任務）
    - 不要修改應用程式代碼
    - 確保測試可重複執行

    Success Criteria:
    - 成功導航至 Group Management 頁面
    - 頁面標題 "Group Management" 正確顯示
    - 麵包屑導航正確顯示
    - 記錄測試執行過程和結果

    Post-Implementation:
    1. 使用 Edit tool 標記 tasks.md 中的 Task 2 為 in-progress [-]
    2. 執行 Playwright MCP 測試並記錄結果
    3. 使用 log-implementation tool 記錄實施詳情：
       - taskId: "2"
       - summary: "完成頁面導航和基本驗證測試，驗證頁面標題和麵包屑"
       - artifacts.integrations: 記錄 Playwright MCP 測試與頁面的互動
       - filesCreated: 列出生成的截圖檔案
       - statistics: 記錄測試數量和結果
    4. 使用 Edit tool 標記 tasks.md 中的 Task 2 為 completed [x]
    ```

- [x] 3. 使用 Playwright MCP 建立表格結構驗證測試
  - **Description:** 驗證表格表頭和資料列的結構完整性
  - **Testing Scope:**
    - 驗證表格表頭欄位（Group Name, Max Members, Create Time, Updated Time, Notes, Status, Action）
    - 驗證至少有一筆資料存在
  - **Tools:** `mcp__playwright__browser_snapshot`
  - **_Leverage:** Playwright MCP 工具，Task 2 的測試基礎
  - **_Requirements:** Requirement 2.2, 2.3 (驗證表格表頭和資料列)
  - **_Prompt:**
    ```
    Implement the task for spec maintainer-group-management-ui-fix, first run spec-workflow-guide to get the workflow guide then implement the task:

    Role: QA Automation Engineer 專精於表格測試和資料驗證

    Task: 使用 Playwright MCP 工具驗證表格結構完整性，實現 Requirements 2.2 和 2.3 的驗收標準。

    Context:
    - 延續 Task 2 的測試環境
    - 閱讀 design.md 的 "Test Suite Structure > 表格結構驗證" 章節
    - 需要驗證所有表頭欄位和資料列

    Implementation Steps:
    1. 繼續使用 Task 2 的瀏覽器會話，或重新導航至頁面
    2. 使用 mcp__playwright__browser_snapshot 獲取表格結構
    3. 驗證表頭包含以下欄位（按順序）：
       - Group Name
       - Max Members
       - Create Time
       - Updated Time
       - Notes
       - Status
       - Action
    4. 驗證表格至少有一筆資料列
    5. 驗證每一列包含所有欄位的資料
    6. 記錄表格結構和資料筆數

    MCP Tools Usage:
    - mcp__playwright__browser_snapshot: 獲取表格結構快照
    - mcp__playwright__browser_take_screenshot: 截圖表格

    Restrictions:
    - 不驗證資料內容的正確性（只驗證結構存在）
    - 不測試排序功能（留給後續任務）

    Success Criteria:
    - 所有表頭欄位正確顯示
    - 表格至少包含一筆資料列
    - 每一列的結構完整

    Post-Implementation:
    1. 使用 Edit tool 標記 tasks.md 中的 Task 3 為 in-progress [-]
    2. 執行測試並記錄結果
    3. 使用 log-implementation tool 記錄實施詳情
    4. 使用 Edit tool 標記 tasks.md 中的 Task 3 為 completed [x]
    ```

- [x] 4. 使用 Playwright MCP 建立 Action 欄位佈局驗證測試（核心測試）
  - **Description:** 驗證 Action 欄位的佈局修復是否成功，確認 Switch、Edit、Archive 按鈕正確顯示且不重疊
  - **Testing Scope:**
    - 驗證 Switch 開關存在且可見
    - 驗證 Edit 按鈕存在且可見
    - 驗證 Archive 按鈕存在且可見
    - 驗證三個元件在同一行顯示
    - 對 Action 欄位截圖
  - **Tools:** `mcp__playwright__browser_snapshot`, `mcp__playwright__browser_take_screenshot`
  - **_Leverage:** Playwright MCP 工具，Task 1 的 UI 修復成果
  - **_Requirements:** Requirement 2.4 (驗證 action 欄位包含所有按鈕), Requirement 3 (建立視覺回歸測試)
  - **_Prompt:**
    ```
    Implement the task for spec maintainer-group-management-ui-fix, first run spec-workflow-guide to get the workflow guide then implement the task:

    Role: QA Engineer 專精於 UI 測試和視覺驗證

    Task: 使用 Playwright MCP 工具驗證 Action 欄位佈局修復的成功，實現 Requirements 2.4 和 3.1-3.4 的驗收標準。這是本次規格的核心驗證測試。

    Context:
    - 延續 Task 3 的測試環境
    - 閱讀 design.md 的 "Action 欄位佈局測試（核心測試）" 章節
    - 此測試驗證 Task 1 的 UI 修復是否成功

    Implementation Steps:
    1. 使用 mcp__playwright__browser_snapshot 獲取表格第一列的結構
    2. 定位到第一列的 Action 欄位
    3. 驗證以下元件存在且可見：
       - Switch 開關（狀態切換）
       - Edit 按鈕（包含圖示和文字）
       - Archive 按鈕（包含圖示和文字）
    4. 驗證三個元件的佈局：
       - 所有元件在同一行顯示（不換行）
       - 元件之間有適當間距
       - 沒有視覺重疊
    5. 使用 mcp__playwright__browser_take_screenshot 對 Action 欄位截圖
       - 可以截取整個表格或僅 Action 欄位
       - 儲存截圖作為基準圖像
    6. 記錄測試結果，包括：
       - 所有元件的可見性
       - 佈局是否正確
       - 截圖檔案路徑

    MCP Tools Usage:
    - mcp__playwright__browser_snapshot: 獲取 Action 欄位結構
    - mcp__playwright__browser_take_screenshot: 截圖用於視覺驗證

    Restrictions:
    - 只驗證佈局和可見性，不測試功能（留給 Task 5）
    - 確保截圖清晰且包含完整的 Action 欄位

    Success Criteria:
    - Switch 開關正確顯示且可見
    - Edit 按鈕正確顯示且可見
    - Archive 按鈕正確顯示且可見
    - 三個元件在同一行顯示且不重疊
    - 成功生成 Action 欄位截圖
    - 記錄視覺驗證結果

    Post-Implementation:
    1. 使用 Edit tool 標記 tasks.md 中的 Task 4 為 in-progress [-]
    2. 執行測試並記錄結果
    3. 使用 log-implementation tool 記錄實施詳情：
       - 特別記錄截圖檔案位置
       - 記錄視覺驗證結果
    4. 使用 Edit tool 標記 tasks.md 中的 Task 4 為 completed [x]
    ```

- [x] 5. 使用 Playwright MCP 建立互動功能測試
  - **Description:** 測試 Switch、Edit、Archive 按鈕的互動功能是否正常運作
  - **Testing Scope:**
    - 測試 Switch 切換並驗證確認對話框
    - 測試 Edit 按鈕點擊
    - 測試 Archive 按鈕點擊並驗證確認對話框
  - **Tools:** `mcp__playwright__browser_click`, `mcp__playwright__browser_wait_for`, `mcp__playwright__browser_handle_dialog`
  - **_Leverage:** Playwright MCP 工具，Task 4 的測試基礎
  - **_Requirements:** Requirement 2.5, 2.6, 2.7 (驗證操作功能)
  - **_Prompt:**
    ```
    Implement the task for spec maintainer-group-management-ui-fix, first run spec-workflow-guide to get the workflow guide then implement the task:

    Role: QA Automation Engineer 專精於功能測試和使用者互動模擬

    Task: 使用 Playwright MCP 工具測試 Action 欄位的互動功能，實現 Requirements 2.5-2.7 的驗收標準。

    Context:
    - 延續 Task 4 的測試環境
    - 閱讀 design.md 的 "互動功能測試" 章節
    - 需要模擬使用者點擊操作並驗證回應

    Implementation Steps:
    1. **測試 Switch 開關切換：**
       - 使用 mcp__playwright__browser_click 點擊第一列的 Switch
       - 使用 mcp__playwright__browser_wait_for 等待確認對話框出現
       - 驗證對話框標題 "確認變更狀態"
       - 使用 mcp__playwright__browser_handle_dialog 處理對話框（可選擇確認或取消）

    2. **測試 Edit 按鈕：**
       - 使用 mcp__playwright__browser_click 點擊 Edit 按鈕
       - 驗證編輯表單或頁面是否出現
       - 如果導航到新頁面，使用 mcp__playwright__browser_navigate_back 返回

    3. **測試 Archive 按鈕：**
       - 使用 mcp__playwright__browser_click 點擊 Archive 按鈕
       - 使用 mcp__playwright__browser_wait_for 等待確認對話框出現
       - 驗證對話框標題 "確認歸檔"
       - 驗證對話框內容包含使用者名稱
       - 使用 mcp__playwright__browser_handle_dialog 取消操作（避免實際刪除資料）

    4. 記錄所有互動測試的結果

    MCP Tools Usage:
    - mcp__playwright__browser_click: 點擊操作元件
    - mcp__playwright__browser_wait_for: 等待對話框或頁面元素
    - mcp__playwright__browser_handle_dialog: 處理確認對話框
    - mcp__playwright__browser_navigate_back: 返回列表頁面

    Restrictions:
    - 不要實際執行刪除操作（在確認對話框點擊取消）
    - 確保每次測試後返回初始狀態

    Success Criteria:
    - Switch 切換觸發確認對話框
    - Edit 按鈕點擊觸發正確操作（表單或頁面導航）
    - Archive 按鈕觸發確認對話框
    - 所有對話框內容正確
    - 測試不影響實際資料

    Post-Implementation:
    1. 使用 Edit tool 標記 tasks.md 中的 Task 5 為 in-progress [-]
    2. 執行測試並記錄結果
    3. 使用 log-implementation tool 記錄實施詳情
    4. 使用 Edit tool 標記 tasks.md 中的 Task 5 為 completed [x]
    ```

- [x] 6. 使用 Playwright MCP 完成測試並生成報告
  - **Description:** 執行完整的測試套件，生成測試報告和文件
  - **Testing Scope:**
    - 執行所有測試場景
    - 生成測試報告
    - 記錄測試覆蓋率
    - 提供測試文件
  - **Tools:** All Playwright MCP tools, `mcp__playwright__browser_close`
  - **_Leverage:** Tasks 2-5 的所有測試
  - **_Requirements:** Requirement 2.8 (驗證分頁功能), Requirement 4 (整合測試至工作流程)
  - **_Prompt:**
    ```
    Implement the task for spec maintainer-group-management-ui-fix, first run spec-workflow-guide to get the workflow guide then implement the task:

    Role: Senior QA Engineer 專精於測試報告和文件撰寫

    Task: 完成完整的 Playwright MCP 測試套件並生成測試報告，實現 Requirements 2.8 和 4 的驗收標準。

    Context:
    - 整合 Tasks 2-5 的所有測試
    - 閱讀 design.md 的 "Testing Strategy" 章節
    - 需要產出完整的測試文件

    Implementation Steps:
    1. **執行分頁功能測試（補充測試）：**
       - 驗證分頁器存在
       - 測試頁碼切換
       - 測試每頁顯示數量調整
       - 驗證總筆數顯示正確

    2. **整合所有測試結果：**
       - 彙整 Tasks 2-5 的測試結果
       - 統計通過/失敗的測試案例
       - 收集所有截圖和日誌

    3. **生成測試報告：**
       - 建立測試報告文件（可以是 Markdown 格式）
       - 包含測試摘要、詳細結果、截圖
       - 記錄任何發現的問題或建議

    4. **建立測試文件：**
       - 說明如何使用 Playwright MCP 工具執行這些測試
       - 提供測試場景清單
       - 記錄測試環境需求

    5. 使用 mcp__playwright__browser_close 關閉瀏覽器

    MCP Tools Usage:
    - mcp__playwright__browser_snapshot: 最終驗證
    - mcp__playwright__browser_take_screenshot: 最終截圖
    - mcp__playwright__browser_close: 清理測試環境

    Restrictions:
    - 確保所有測試可重現
    - 文件清晰且易於理解

    Success Criteria:
    - 分頁功能測試完成
    - 所有測試結果已彙整
    - 生成完整的測試報告
    - 建立測試執行文件
    - 所有截圖已保存並分類

    Post-Implementation:
    1. 使用 Edit tool 標記 tasks.md 中的 Task 6 為 in-progress [-]
    2. 執行完整測試並生成報告
    3. 使用 log-implementation tool 記錄實施詳情：
       - taskId: "6"
       - summary: "完成 Playwright MCP 測試套件並生成測試報告"
       - 記錄測試報告檔案位置
       - 記錄測試覆蓋的所有場景
    4. 使用 Edit tool 標記 tasks.md 中的 Task 6 為 completed [x]
    ```

---

## Task Execution Notes

### Dependencies
- Task 2-6 依賴 Task 1 完成（需要修復後的 UI 才能進行測試）
- Tasks 2-6 可以按順序執行，每個任務建立在前一個任務的基礎上

### Testing Environment
- **開發伺服器：** 需要運行本地開發伺服器（通常是 `pnpm dev`）
- **測試資料：** 確保有測試資料可用（可能需要 MSW mock 或實際 API）
- **Playwright MCP：** 確保 Playwright MCP Server 已配置並可用

### Success Criteria Summary
所有任務完成後，應達成以下目標：
- ✅ UserTable Action 欄位佈局問題已修復
- ✅ 所有操作按鈕正確顯示且不重疊
- ✅ 完整的 Playwright MCP 測試套件已建立
- ✅ 所有測試通過並生成報告
- ✅ 測試文件完整且可重現
