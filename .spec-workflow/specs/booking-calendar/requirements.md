# Requirements Document - Booking Calendar

## Introduction

Booking Calendar 是一個基於甘特圖的資源預約視覺化系統，讓使用者能夠直觀地查看、篩選和管理預約排程。此功能使用 `gantt-task-react` 套件實作甘特圖，提供時間軸檢視與資源使用狀況。

**核心價值：**
- 視覺化呈現預約衝突與資源使用率
- 即時篩選與排序預約資料
- 快速建立新預約（整合既有 Booking Create 功能）

## Alignment with Product Vision

此功能符合 Unite Slave 資源管理平台的核心目標：
- **可視化管理**：透過甘特圖直觀呈現預約時間與資源分配
- **衝突偵測**：Allowed Overlap 選項顯示重疊預約
- **資料篩選**：Time Range 與 Sort by 提供靈活查詢
- **整合性**：與既有 Booking Create 功能無縫串接

## Requirements

### Requirement 1: 甘特圖日曆顯示

**User Story:** As a user, I want to view all bookings in a Gantt chart timeline, so that I can understand resource allocation at a glance.

#### Acceptance Criteria

1. WHEN user navigates to `/booking/calendar` THEN system SHALL display a Gantt chart with all bookings
2. WHEN user loads the page THEN system SHALL show time axis from 02:00 AM to 01:00 PM (configurable)
3. WHEN bookings exist THEN system SHALL render each booking as a horizontal bar with:
   - Resource identifier (e.g., "Robert08000")
   - Time duration (start to end)
   - Visual distinction for overlapping bookings
4. WHEN no bookings exist THEN system SHALL display an empty state message

### Requirement 2: 時間範圍篩選 (Time Range Filter)

**User Story:** As a user, I want to filter bookings by time range, so that I can focus on specific periods.

#### Acceptance Criteria

1. WHEN user opens Time Range dropdown THEN system SHALL display available time range options:
   - Today
   - This Week
   - This Month
   - Custom Range
2. WHEN user selects a time range THEN system SHALL filter Gantt chart to show only bookings within that period
3. WHEN custom range is selected THEN system SHALL display date pickers for start and end dates
4. IF no bookings match the filter THEN system SHALL display empty state

### Requirement 3: 排序功能 (Sort By)

**User Story:** As a user, I want to sort bookings by different criteria, so that I can prioritize viewing.

#### Acceptance Criteria

1. WHEN user opens Sort by dropdown THEN system SHALL display sorting options:
   - Resource Name (A-Z)
   - Start Time (earliest first)
   - End Time (latest first)
   - Created Date
2. WHEN user selects a sort option THEN system SHALL reorder Gantt chart rows accordingly
3. WHEN sort is applied THEN system SHALL maintain the selection across page refreshes (optional)

### Requirement 4: 允許重疊檢視 (Allowed Overlap Toggle)

**User Story:** As a user, I want to toggle visibility of overlapping bookings, so that I can identify resource conflicts.

#### Acceptance Criteria

1. WHEN user checks "Allowed Overlap" checkbox THEN system SHALL highlight overlapping bookings with visual indicators
2. WHEN user unchecks "Allowed Overlap" THEN system SHALL display all bookings without overlap highlighting
3. WHEN overlap exists THEN system SHALL show conflict indicator (e.g., different color, border, or icon)

### Requirement 5: 快速建立預約 (Book Now Button)

**User Story:** As a user, I want to quickly navigate to booking creation, so that I can add new bookings efficiently.

#### Acceptance Criteria

1. WHEN user clicks "+ Book Now" button THEN system SHALL navigate to `/booking/create`
2. WHEN navigation occurs THEN system SHALL preserve current filter/sort state in session (optional)

### Requirement 6: 右側資訊面板 (Booking Details Panel)

**User Story:** As a user, I want to see booking details in the right panel, so that I can understand resource usage without leaving the calendar view.

#### Acceptance Criteria

1. WHEN user clicks a booking bar THEN system SHALL display booking details in right panel:
   - Data room information (e.g., "Data room Left")
   - Utilization metrics: Left capacity, Booking status (Booking Now)
   - Resource details:
     - Server name (e.g., "Robert0808")
     - Analytics type
     - Server specs (GPU, Data used %)
   - Status badge (Pending, Running, Allowed Overlap)
   - "show more details" link
2. WHEN user clicks "show more details" THEN system SHALL navigate to detailed booking view (optional)
3. WHEN no booking is selected THEN system SHALL show default panel or hide panel

### Requirement 7: 響應式佈局 (Responsive Layout)

**User Story:** As a user, I want the calendar to work on mobile devices, so that I can manage bookings on the go.

#### Acceptance Criteria

1. WHEN viewport width < 768px THEN system SHALL:
   - Display sidebar as hamburger menu (using existing SidebarLayout)
   - Stack filters vertically
   - Adjust Gantt chart to horizontal scroll
   - Show simplified right panel or hide it
2. WHEN viewport width >= 768px THEN system SHALL display full desktop layout

## Non-Functional Requirements

### Code Architecture and Modularity

**Feature-based 架構硬限制：**
- **單一職責**：每個檔案只做一件事
  - `components/*`: 純展示元件（GanttChart, FilterBar, BookingDetailsPanel）
  - `hooks/*`: 狀態管理與資料整合（useBookingCalendar, useGanttTasks）
  - `services/*`: API 呼叫或 mock 資料（bookingCalendarServices.ts）
  - `types/*`: Domain types（BookingTask, GanttTaskAdapter）
- **禁止跨層呼叫**：
  - components 不可直接呼叫 services，必須透過 hooks
  - types 不可包含邏輯，只能定義型別
- **gantt-task-react 封裝**：
  - 顯示元件：`features/booking/components/GanttChartView.tsx`
  - 資料轉換：`features/booking/hooks/useGanttTasks.ts`
  - Domain type：`features/booking/types/gantt.types.ts`
- **共用元件**：
  - SidebarLayout 已存在於 `shared/layouts`，只能使用不可修改
  - 若需通用 UI 元件（如 EmptyState），放在 `shared/components`

### Performance

- Gantt chart 必須在 < 500ms 內渲染（100 筆預約內）
- 篩選操作回應時間 < 200ms
- 支援 lazy loading（若預約數量 > 500 筆）

### Security

- 所有 API 呼叫必須包含 authentication token
- 使用者只能查看自己權限範圍內的預約
- 防止 XSS：使用 React 內建 escaping

### Reliability

- 處理 API 失敗：顯示 error state
- 處理空資料：顯示 empty state
- 處理 loading 狀態：顯示 skeleton 或 spinner

### Usability

- 符合 Figma 設計規範（spacing, typography, colors）
- 使用 Ant Design 元件優先（Select, Checkbox, Button）
- 提供 loading indicator 與 error messages
- 甘特圖必須支援水平捲動（時間軸過長時）

## Technical Constraints

1. **必須使用既有架構**：
   - `src/features/booking/*` 目錄結構
   - `SidebarLayout` 作為主版面
   - React Router 路由系統
2. **套件限制**：
   - 使用 `gantt-task-react` 顯示甘特圖
   - 使用 `antd` UI 元件
   - 不引入其他甘特圖套件
3. **測試要求**：
   - Playwright e2e 測試必須可重跑
   - 測試覆蓋：desktop/mobile viewport、empty/loading/error state

## Out of Scope (不在此次範圍)

- 拖拉調整預約時間（Drag & Drop）
- 即時協作編輯
- 預約衝突自動解決
- 匯出 PDF/CSV
- 多語系支援（i18n 已存在但此功能暫不翻譯）
