# Requirements Document

## Introduction

預訂歷史記錄 (Booking History) 功能提供一個完整的介面，讓使用者能夠查看、篩選和管理所有的預訂記錄。此功能的核心價值在於提供清晰的歷史資料檢視，支援多維度篩選，並提供詳細的預訂資訊存取，讓使用者能夠有效追蹤和管理預訂狀態。

此功能將展示所有預訂的關鍵資訊，包括預訂 ID、節點、映像檔、群組、帳號、時間範圍、重疊狀態以及執行狀態，並提供分頁與詳細檢視功能。

## Alignment with Product Vision

此功能與 product.md 中定義的產品願景高度一致：

- **預訂管理核心功能**：作為預訂管理系統的重要組成部分，提供完整的歷史記錄檢視能力
- **響應式設計**：基於 Ant Design 組件，確保在桌面和行動裝置上都能良好運作
- **模組化架構**：採用 feature-based 結構，置於 `booking` feature 中，遵循專案既有的組織模式
- **使用者體驗至上**：提供直覺的篩選和分頁功能，降低資訊檢索的認知負擔
- **可維護性**：重用專案既有的佈局和元件，保持程式碼一致性

## Requirements

### Requirement 1: 預訂歷史清單展示

**User Story:** 身為系統使用者，我想要查看所有預訂的歷史記錄列表，以便了解過去和現在的預訂狀態

#### Acceptance Criteria

1. WHEN 使用者進入預訂歷史頁面 THEN 系統 SHALL 顯示預訂記錄表格，包含以下欄位：
   - Booking ID（預訂編號）
   - Node（節點 IP 位址）
   - Image（映像檔名稱）
   - Group（群組名稱）
   - Account（帳號名稱）
   - Start Time（開始時間，格式：YYYY-MM-DD HH:mm:ss）
   - End Time（結束時間，格式：YYYY-MM-DD HH:mm:ss）
   - Overlap（重疊狀態標籤）
   - Status（執行狀態標籤）
   - Action（操作按鈕：Detail）

2. WHEN 表格資料載入中 THEN 系統 SHALL 顯示 Ant Design Skeleton 載入狀態

3. WHEN 資料載入失敗 THEN 系統 SHALL 顯示 Ant Design Empty 元件並提供錯誤訊息

4. WHEN 表格資料為空 THEN 系統 SHALL 顯示 Ant Design Empty 元件並提示「暫無預訂記錄」

### Requirement 2: 時間範圍篩選

**User Story:** 身為系統使用者，我想要根據時間範圍篩選預訂記錄，以便快速找到特定時段的預訂

#### Acceptance Criteria

1. WHEN 使用者點擊開始日期選擇器 THEN 系統 SHALL 顯示 Ant Design DatePicker 日曆介面

2. WHEN 使用者點擊結束日期選擇器 THEN 系統 SHALL 顯示 Ant Design DatePicker 日曆介面

3. WHEN 使用者選擇開始和結束日期後 THEN 系統 SHALL 自動篩選並顯示該時間範圍內的預訂記錄

4. IF 結束日期早於開始日期 THEN 系統 SHALL 顯示驗證錯誤訊息「結束日期不得早於開始日期」

5. WHEN 使用者清空日期選擇 THEN 系統 SHALL 顯示所有預訂記錄（移除時間篩選）

### Requirement 3: 多維度篩選

**User Story:** 身為系統使用者，我想要根據節點、群組和狀態篩選預訂記錄，以便快速定位特定條件的預訂

#### Acceptance Criteria

1. WHEN 使用者點擊節點下拉選單 THEN 系統 SHALL 顯示所有可用節點選項

2. WHEN 使用者選擇特定節點 THEN 系統 SHALL 篩選並顯示該節點的預訂記錄

3. WHEN 使用者點擊群組下拉選單 THEN 系統 SHALL 顯示所有可用群組選項

4. WHEN 使用者選擇特定群組 THEN 系統 SHALL 篩選並顯示該群組的預訂記錄

5. WHEN 使用者點擊狀態下拉選單 THEN 系統 SHALL 顯示所有可用狀態選項（pending、running、paused、terminated）

6. WHEN 使用者選擇特定狀態 THEN 系統 SHALL 篩選並顯示該狀態的預訂記錄

7. WHEN 使用者同時選擇多個篩選條件 THEN 系統 SHALL 顯示滿足所有條件（AND 邏輯）的預訂記錄

### Requirement 4: 關鍵字搜尋

**User Story:** 身為系統使用者，我想要透過關鍵字搜尋預訂記錄，以便快速找到特定的預訂資訊

#### Acceptance Criteria

1. WHEN 使用者在搜尋框輸入關鍵字 THEN 系統 SHALL 即時搜尋以下欄位：Booking ID、Node、Image、Group、Account

2. WHEN 搜尋結果為空 THEN 系統 SHALL 顯示「無符合的預訂記錄」訊息

3. WHEN 使用者清空搜尋框 THEN 系統 SHALL 恢復顯示所有預訂記錄（受其他篩選條件影響）

### Requirement 5: 重置篩選條件

**User Story:** 身為系統使用者，我想要一鍵重置所有篩選條件，以便快速回到完整列表檢視

#### Acceptance Criteria

1. WHEN 使用者點擊「Reset」按鈕 THEN 系統 SHALL 清空所有篩選條件（日期範圍、節點、群組、狀態、關鍵字）

2. WHEN 重置完成後 THEN 系統 SHALL 顯示所有預訂記錄的第一頁

### Requirement 6: 分頁功能

**User Story:** 身為系統使用者，我想要在預訂記錄間進行分頁瀏覽，以便管理大量資料的檢視

#### Acceptance Criteria

1. WHEN 預訂記錄總數超過單頁顯示數量 THEN 系統 SHALL 在表格下方顯示 Ant Design Pagination 元件

2. WHEN 使用者點擊分頁按鈕（上一頁、下一頁、特定頁碼） THEN 系統 SHALL 切換到對應頁面並顯示該頁資料

3. WHEN 使用者更改每頁顯示數量 THEN 系統 SHALL 重新計算分頁並顯示對應數量的記錄

4. WHEN 使用者使用快速跳轉功能 THEN 系統 SHALL 跳轉至指定頁碼

5. WHEN 分頁元件載入時 THEN 系統 SHALL 顯示總記錄數（例如：「Total 85 items」）

### Requirement 7: 狀態標籤視覺化

**User Story:** 身為系統使用者,我想要透過不同顏色的標籤快速識別預訂的執行狀態和重疊情況，以便直觀了解預訂狀態

#### Acceptance Criteria

1. WHEN 預訂狀態為 "pending" THEN 系統 SHALL 顯示對應的 Ant Design Tag 元件（待定狀態樣式）

2. WHEN 預訂狀態為 "running" THEN 系統 SHALL 顯示對應的 Ant Design Tag 元件（執行中狀態樣式）

3. WHEN 預訂狀態為 "paused" THEN 系統 SHALL 顯示對應的 Ant Design Tag 元件（暫停狀態樣式）

4. WHEN 預訂狀態為 "terminated" THEN 系統 SHALL 顯示對應的 Ant Design Tag 元件（終止狀態樣式）

5. WHEN 預訂有時間重疊 THEN 系統 SHALL 在 Overlap 欄位顯示「Yes」標籤

6. WHEN 預訂無時間重疊 THEN 系統 SHALL 在 Overlap 欄位顯示「No」標籤

### Requirement 8: 詳細資訊查看

**User Story:** 身為系統使用者，我想要點擊查看預訂的詳細資訊，以便了解完整的預訂內容和執行日誌

#### Acceptance Criteria

1. WHEN 使用者點擊 Action 欄位的「Detail」按鈕 THEN 系統 SHALL 導航至預訂詳細頁面或開啟詳細資訊 Modal

2. WHEN 詳細資訊載入中 THEN 系統 SHALL 顯示 Ant Design Spin 載入指示器

3. WHEN 詳細資訊載入失敗 THEN 系統 SHALL 顯示錯誤訊息並提供重試選項

### Requirement 9: 側邊欄導航整合

**User Story:** 身為系統使用者，我想要透過側邊欄快速導航至預訂歷史頁面，以便在不同功能間切換

#### Acceptance Criteria

1. WHEN 使用者登入系統後 THEN 系統 SHALL 在側邊欄顯示「Booking History」導航項目

2. WHEN 使用者點擊「Booking History」導航項目 THEN 系統 SHALL 導航至預訂歷史頁面（路由：`/booking/history`）

3. WHEN 使用者位於預訂歷史頁面時 THEN 系統 SHALL 高亮顯示側邊欄對應的導航項目

## Non-Functional Requirements

### Code Architecture and Modularity
- **Single Responsibility Principle**: 頁面元件只負責佈局和資料整合，篩選邏輯、表格渲染、分頁控制應拆分為獨立元件
- **Modular Design**:
  - 頁面檔案：`src/features/booking/pages/BookingHistory.tsx`
  - 篩選列元件：建議重用專案既有的 `FilterBar` 或建立 `BookingHistoryFilterBar.tsx`
  - 表格元件：建議重用專案既有的 `DataTable` 或建立 `BookingHistoryTable.tsx`
  - 佈局元件：重用專案既有的 `SidebarLayout`
- **Dependency Management**: 使用 RTK Query 管理 API 呼叫和快取，避免元件內部直接處理 HTTP 請求
- **Clear Interfaces**: 定義清晰的 TypeScript 介面（`BookingRecord`, `BookingFilterParams`, `BookingHistoryResponse`）

### Performance
- **首次載入時間**: 頁面首次載入時間應小於 2 秒（含 API 請求）
- **篩選回應時間**: 使用者觸發篩選後，結果應在 500ms 內顯示
- **分頁切換效能**: 分頁切換應在 300ms 內完成（若資料已快取）
- **資料快取**: 使用 RTK Query 自動快取已載入的分頁資料，減少重複請求
- **Lazy Loading**: 表格使用虛擬滾動（若記錄數超過 100 筆）或分頁載入

### Security
- **認證驗證**: 使用者必須完成登入認證才能存取預訂歷史頁面，未認證使用者應重導向至登入頁
- **API Token**: 所有 API 請求必須包含有效的認證 token（RTK Query 自動處理）
- **資料授權**: 後端 API 應驗證使用者是否有權限查看特定預訂記錄
- **XSS 防護**: 所有使用者輸入（搜尋關鍵字）應經過適當的跳脫處理（React 預設提供）
- **輸入驗證**: 日期範圍、搜尋關鍵字應進行前端驗證，防止惡意輸入

### Reliability
- **錯誤處理**: 所有 API 呼叫應包含錯誤處理邏輯，顯示友善的錯誤訊息
- **重試機制**: 網路請求失敗時提供重試選項（RTK Query 可配置自動重試）
- **資料一致性**: 篩選和分頁操作應確保資料一致性，避免頁面切換時出現資料錯亂
- **Fallback UI**: 資料載入失敗時顯示 Ant Design Empty 元件並提供重新載入按鈕

### Usability
- **響應式設計**: 支援桌面（≥1024px）和行動裝置（≥375px）瀏覽
- **無障礙性**:
  - 所有互動元件應支援鍵盤操作
  - 提供適當的 ARIA 標籤
  - 顏色對比度符合 WCAG AA 標準
- **Loading 狀態**: 所有非同步操作應提供清晰的載入指示器
- **空狀態設計**: 資料為空或搜尋無結果時顯示有意義的提示和引導
- **操作回饋**: 篩選、重置、分頁等操作應提供即時的視覺回饋
- **國際化支援**: 所有文字內容應使用 i18next 進行國際化處理，支援繁體中文和英文

### Visual Regression Testing Requirements
- **測試範圍**：
  - 一般狀態：顯示完整預訂記錄列表（至少 5 筆記錄，包含不同狀態）
  - 空狀態：無預訂記錄時的 Empty 元件呈現
  - 載入狀態：Skeleton 載入動畫呈現
  - 篩選狀態：應用篩選條件後的結果呈現
  - 分頁狀態：分頁元件在不同頁碼的呈現
- **Viewport 設定**：1512x1003（依照 Figma Frame 尺寸）
- **關鍵視覺元素**：
  - 表格標題列與資料列的對齊與間距
  - 狀態標籤（Status、Overlap）的顏色與樣式
  - 篩選列的佈局與元件對齊
  - 分頁控制器的位置與樣式
  - Detail 按鈕的樣式與 icon 呈現
