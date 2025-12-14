# Design Document - Booking Calendar

## Overview

Booking Calendar 提供甘特圖視覺化的預約管理系統，核心架構基於 `gantt-task-react` 套件與 feature-based 模組化設計。系統透過 3 層分離（components/hooks/services）實現資料流動與職責分離，確保可測試性與可維護性。

**核心設計原則：**
- **資料結構優先**：定義 BookingTask domain type，避免直接暴露 gantt-task-react 的 Task 型別
- **消除特殊情況**：透過 Adapter Pattern 統一處理空資料、loading、error 狀態
- **零破壞性**：使用既有 SidebarLayout 與 routing 系統，不修改現有架構

## Steering Document Alignment

### Technical Standards (tech.md)

**遵循既定技術棧：**
- **React 18.3.1 + TypeScript**：函數式元件 + Hooks，嚴格型別檢查
- **Ant Design 5.22.2**：Select、Checkbox、Button、Badge 等 UI 元件
- **Redux Toolkit + RTK Query**：API 呼叫與快取（bookingCalendarServices.ts）
- **Tailwind CSS 3.4.15**：響應式佈局（md 斷點 768px）
- **gantt-task-react 0.3.9**：甘特圖渲染引擎

**架構模式：**
- Feature-based 模組化（`src/features/booking/*`）
- 路徑別名系統（`@features`, `@shared`, `@store`）

### Project Structure (structure.md)

**嚴格遵守目錄結構：**
```
src/features/booking/
├── components/
│   ├── BookingCalendar.tsx          # 主頁面元件（使用 SidebarLayout）
│   ├── GanttChartView.tsx           # 甘特圖顯示元件
│   ├── CalendarFilterBar.tsx        # 篩選欄（Time Range + Sort by + Allowed Overlap）
│   └── BookingDetailsPanel.tsx      # 右側詳情面板
├── hooks/
│   ├── useBookingCalendar.ts        # 整合 filters、sorting、data fetching
│   └── useGanttTasks.ts             # BookingTask → gantt-task-react Task adapter
├── services/
│   └── bookingCalendarServices.ts   # RTK Query API endpoints
├── types/
│   ├── booking.types.ts             # BookingTask domain type
│   └── gantt.types.ts               # GanttTaskAdapter, ViewMode, FilterOptions
└── index.ts                         # re-export BookingCalendar
```

**命名規範：**
- Components: `PascalCase.tsx`
- Services: `camelCaseServices.ts`
- Types: `camelCase.types.ts`
- Hooks: `useCamelCase.ts`

## Code Reuse Analysis

### Existing Components to Leverage

1. **SidebarLayout** (`@shared/layouts/SidebarLayout.tsx`)
   - **用途**：主版面容器，提供 Sidebar + 內容區域
   - **使用方式**：`<SidebarLayout>{children}</SidebarLayout>`
   - **響應式處理**：已內建 md 斷點（768px）切換 Drawer/固定側邊欄

2. **Ant Design Components**
   - **Select**：Time Range、Sort by 下拉選單
   - **Checkbox**：Allowed Overlap toggle
   - **Button**：Book Now 主要動作按鈕
   - **Badge**：狀態標籤（Pending, Running, Allowed Overlap）
   - **Skeleton**：Loading state
   - **Empty**：Empty state

3. **Redux Store** (`@store/store.ts`)
   - **用途**：全域狀態管理（若需跨頁面共享篩選狀態）
   - **本功能範圍**：優先使用 local state（useState），僅在必要時使用 Redux

4. **Error Handler** (`@shared/utils/errorHandler.ts`)
   - **用途**：統一 API 錯誤處理
   - **整合位置**：RTK Query `baseQueryWithErrorHandler`

### Integration Points

1. **Existing Booking Create Page** (`/booking/create`)
   - **整合方式**：Book Now 按鈕導航至 `/booking/create`
   - **資料傳遞**：透過 URL query params 傳遞預填資訊（可選）

2. **RTK Query Base Configuration**
   - **整合點**：`bookingCalendarServices.ts` 使用既有 `baseQueryWithErrorHandler`
   - **快取策略**：providesTags/invalidatesTags 確保資料同步

3. **Routing System** (`src/routes.tsx`)
   - **新增路由**：`/booking/calendar` → `<BookingCalendar />`
   - **Side effect**：無破壞性變更，純新增路由項

## Architecture

### 資料流設計（Linus 風格：資料結構優先）

```mermaid
graph TD
    A[API Response] -->|Raw JSON| B[RTK Query Service]
    B -->|BookingTask[]| C[useBookingCalendar Hook]
    C -->|Filtered & Sorted| D[useGanttTasks Hook]
    D -->|Task[] for gantt-task-react| E[GanttChartView Component]
    
    F[User Interaction] -->|Filter/Sort| C
    C -->|State Update| E
    
    E -->|Click Event| G[BookingDetailsPanel]
    G -->|Show Details| H[Selected BookingTask]
```

**關鍵設計決策：**
1. **Domain Type 隔離**：`BookingTask` 不依賴 `gantt-task-react` 的 `Task` 型別
2. **Adapter 位置**：`useGanttTasks` hook 負責型別轉換，components 完全不知道轉換邏輯
3. **狀態提升**：篩選狀態在 `useBookingCalendar` 統一管理，避免 prop drilling

### Modular Design Principles

**單一檔案職責：**
- `BookingCalendar.tsx`：版面組合，不含商業邏輯
- `useBookingCalendar.ts`：篩選、排序、API 呼叫整合
- `useGanttTasks.ts`：純資料轉換，無 side effects
- `bookingCalendarServices.ts`：純 API 定義，無 UI 邏輯

**禁止跨層呼叫：**
```
✅ Component → Hook → Service
❌ Component → Service (直接呼叫)
❌ Hook → Component (反向依賴)
```

## Components and Interfaces

### Component 1: BookingCalendar (主頁面)

**Purpose:** 主容器元件，組合所有子元件並使用 SidebarLayout

**Interfaces:**
```typescript
export default function BookingCalendar(): JSX.Element
```

**Dependencies:**
- `SidebarLayout` (from `@shared/layouts`)
- `CalendarFilterBar`
- `GanttChartView`
- `BookingDetailsPanel`
- `useBookingCalendar` hook

**Reuses:**
- SidebarLayout 提供版面結構
- Ant Design Layout/Row/Col 做響應式網格

**Implementation:**
```tsx
<SidebarLayout>
  <div className="p-4 md:p-6">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold">Calendar</h1>
      <Button type="primary" icon={<PlusOutlined />}>Book Now</Button>
    </div>
    
    <CalendarFilterBar {...filterProps} />
    
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
      <GanttChartView {...ganttProps} />
      <BookingDetailsPanel {...detailsProps} />
    </div>
  </div>
</SidebarLayout>
```

---

### Component 2: GanttChartView

**Purpose:** 封裝 gantt-task-react 的顯示邏輯，處理 loading/empty/error states

**Interfaces:**
```typescript
interface GanttChartViewProps {
  tasks: Task[];              // gantt-task-react 的 Task 型別
  isLoading: boolean;
  error?: string;
  onTaskClick: (task: Task) => void;
  viewMode: ViewMode;         // Hour | Day | Week | Month
}

export default function GanttChartView(props: GanttChartViewProps): JSX.Element
```

**Dependencies:**
- `gantt-task-react` (Gantt component)
- Ant Design Skeleton, Empty

**Reuses:**
- 無（首次引入 gantt-task-react）

**Implementation Notes:**
- 使用 `gantt-task-react` 的 `<Gantt>` 元件
- 自訂 `columnWidth`、`listCellWidth`、`barBackgroundColor` 符合 Figma 設計
- Empty state 使用 Ant Design `<Empty description="No bookings found" />`
- Loading state 使用 `<Skeleton active paragraph={{ rows: 8 }} />`

---

### Component 3: CalendarFilterBar

**Purpose:** 篩選與排序 UI，不含狀態邏輯（controlled component）

**Interfaces:**
```typescript
interface CalendarFilterBarProps {
  timeRange: TimeRangeOption;
  onTimeRangeChange: (value: TimeRangeOption) => void;
  sortBy: SortOption;
  onSortByChange: (value: SortOption) => void;
  allowedOverlap: boolean;
  onAllowedOverlapChange: (checked: boolean) => void;
}

export default function CalendarFilterBar(props: CalendarFilterBarProps): JSX.Element
```

**Dependencies:**
- Ant Design Select, Checkbox

**Reuses:**
- Ant Design 元件樣式

**Implementation:**
```tsx
<div className="flex flex-wrap gap-4 mb-4">
  <Select value={timeRange} onChange={onTimeRangeChange} className="w-40">
    <Option value="today">Today</Option>
    <Option value="week">This Week</Option>
    <Option value="month">This Month</Option>
  </Select>
  
  <Select value={sortBy} onChange={onSortByChange} className="w-40">
    <Option value="resource">Resource Name</Option>
    <Option value="startTime">Start Time</Option>
  </Select>
  
  <Checkbox checked={allowedOverlap} onChange={e => onAllowedOverlapChange(e.target.checked)}>
    Allowed Overlap
  </Checkbox>
</div>
```

---

### Component 4: BookingDetailsPanel

**Purpose:** 顯示選中預約的詳細資訊，支援空選取狀態

**Interfaces:**
```typescript
interface BookingDetailsPanelProps {
  booking: BookingTask | null;
  onShowMore?: (bookingId: string) => void;
}

export default function BookingDetailsPanel(props: BookingDetailsPanelProps): JSX.Element
```

**Dependencies:**
- Ant Design Card, Badge, Descriptions

**Reuses:**
- Ant Design 元件樣式

**Implementation:**
- 若 `booking === null`，顯示 "Select a booking to view details"
- 顯示：Server name、GPU、Data used、Status badge
- "show more details" 連結（optional）

---

### Hook 1: useBookingCalendar

**Purpose:** 整合篩選、排序與 API 資料獲取，提供統一狀態管理

**Interfaces:**
```typescript
interface UseBookingCalendarReturn {
  bookings: BookingTask[];
  isLoading: boolean;
  error?: string;
  filters: {
    timeRange: TimeRangeOption;
    sortBy: SortOption;
    allowedOverlap: boolean;
  };
  updateFilter: (key: keyof Filters, value: any) => void;
  selectedBooking: BookingTask | null;
  selectBooking: (booking: BookingTask | null) => void;
}

export function useBookingCalendar(): UseBookingCalendarReturn
```

**Dependencies:**
- `useGetBookingsQuery` (from services)
- `useState` for filters and selection

**Reuses:**
- RTK Query 快取機制

**Implementation Logic:**
1. 使用 `useGetBookingsQuery()` 獲取原始資料
2. 根據 `filters.timeRange` 過濾資料（client-side）
3. 根據 `filters.sortBy` 排序資料
4. 回傳處理後的 `bookings` 與 filter 操作函數

---

### Hook 2: useGanttTasks

**Purpose:** BookingTask[] → gantt-task-react Task[] adapter

**Interfaces:**
```typescript
export function useGanttTasks(bookings: BookingTask[]): Task[]
```

**Dependencies:**
- `gantt-task-react` Task type
- `dayjs` for date manipulation

**Reuses:**
- 無

**Implementation Logic:**
```typescript
return bookings.map(booking => ({
  id: booking.id,
  name: booking.resourceName,
  start: dayjs(booking.startTime).toDate(),
  end: dayjs(booking.endTime).toDate(),
  progress: 100,
  type: 'task',
  styles: {
    backgroundColor: booking.status === 'overlap' ? '#faad14' : '#1890ff',
    progressColor: '#1890ff'
  }
}));
```

---

### Service: bookingCalendarServices

**Purpose:** RTK Query API endpoint 定義

**Interfaces:**
```typescript
export const bookingCalendarApi = createApi({
  reducerPath: 'bookingCalendarApi',
  baseQuery: baseQueryWithErrorHandler,
  tagTypes: ['Booking'],
  endpoints: (builder) => ({
    getBookings: builder.query<BookingTask[], void>({
      query: () => '/api/bookings',
      providesTags: ['Booking']
    })
  })
});

export const { useGetBookingsQuery } = bookingCalendarApi;
```

**Dependencies:**
- `@reduxjs/toolkit/query`
- `baseQueryWithErrorHandler` (from `@shared/services`)

**Reuses:**
- 既有 RTK Query 配置模式

## Data Models

### BookingTask (Domain Model)

```typescript
interface BookingTask {
  id: string;
  resourceName: string;         // e.g., "Robert08000"
  startTime: string;            // ISO 8601 datetime
  endTime: string;              // ISO 8601 datetime
  status: 'pending' | 'running' | 'completed' | 'overlap';
  dataRoom: string;             // e.g., "Data room Left"
  utilization: {
    leftCapacity: string;       // e.g., "5%"
    bookingStatus: string;      // e.g., "Booking Now"
  };
  server: {
    name: string;               // e.g., "Robert0808"
    type: string;               // e.g., "analytics"
    gpu: number;                // GPU count
    dataUsed: number;           // percentage (0-100)
  };
}
```

**Design Rationale:**
- **ISO 8601 時間格式**：避免時區問題，統一使用 UTC
- **扁平化 server 資訊**：方便 Gantt 圖顯示與篩選
- **狀態列舉**：明確定義所有可能狀態，避免字串錯誤

---

### FilterOptions (UI State)

```typescript
type TimeRangeOption = 'today' | 'week' | 'month' | 'custom';
type SortOption = 'resource' | 'startTime' | 'endTime' | 'created';

interface FilterState {
  timeRange: TimeRangeOption;
  customRange?: { start: string; end: string };
  sortBy: SortOption;
  allowedOverlap: boolean;
}
```

---

### GanttTaskAdapter (gantt-task-react Integration)

```typescript
import { Task, ViewMode } from 'gantt-task-react';

// BookingTask → Task 轉換邏輯封裝在 useGanttTasks
export type { Task, ViewMode };
```

**Isolation Strategy:**
- Components 不直接 import `gantt-task-react` types
- 所有 Gantt 相關型別透過 `types/gantt.types.ts` re-export
- 未來若更換甘特圖套件，只需修改 `useGanttTasks` 與 `gantt.types.ts`

## Error Handling

### Error Scenarios

**1. API 請求失敗 (Network Error)**
- **Handling:** RTK Query 自動 retry（3 次），失敗後設定 `error` state
- **User Impact:** 顯示 Ant Design Alert 元件："Failed to load bookings. Please try again."
- **Implementation:** 在 `GanttChartView` 判斷 `error` prop，顯示 `<Alert type="error" />`

**2. 空資料 (No Bookings)**
- **Handling:** `bookings.length === 0` 時觸發 empty state
- **User Impact:** 顯示 `<Empty description="No bookings found for selected filters" />`
- **Implementation:** 在 `GanttChartView` 判斷 `tasks.length === 0`

**3. 無效日期範圍 (Custom Range Validation)**
- **Handling:** DatePicker 禁用過去日期，end date 不可早於 start date
- **User Impact:** DatePicker 禁用選項，無法選取無效範圍
- **Implementation:** 使用 Ant Design DatePicker `disabledDate` prop

**4. 甘特圖渲染錯誤 (gantt-task-react Crash)**
- **Handling:** React Error Boundary 捕獲錯誤
- **User Impact:** 顯示 fallback UI："Gantt chart failed to render. Please refresh."
- **Implementation:** 包裹 `<ErrorBoundary>` 在 `GanttChartView` 外層（可選，Phase 2 實作）

## Testing Strategy

### Unit Testing (Vitest)

**測試範圍：**
1. **useGanttTasks hook**
   - 測試 BookingTask → Task 轉換邏輯
   - 測試空陣列處理
   - 測試 overlap 狀態顏色映射

2. **useBookingCalendar hook**
   - 測試篩選邏輯（時間範圍、排序）
   - 測試 filter update 狀態更新
   - Mock RTK Query responses

**測試工具：**
- `@testing-library/react-hooks` for hook testing
- `vitest` for assertions
- MSW (Mock Service Worker) for API mocking

---

### Integration Testing (Vitest + Testing Library)

**測試流程：**
1. **篩選互動**
   - 改變 Time Range → 驗證 bookings 過濾結果
   - 改變 Sort by → 驗證排序順序
   - Toggle Allowed Overlap → 驗證視覺狀態變化

2. **點擊互動**
   - 點擊 Gantt bar → 驗證 BookingDetailsPanel 顯示正確資料
   - 點擊 Book Now → 驗證導航至 `/booking/create`

**測試範例：**
```typescript
test('filters bookings by time range', () => {
  render(<BookingCalendar />);
  
  const select = screen.getByLabelText('Time Range');
  userEvent.selectOptions(select, 'today');
  
  // 驗證只顯示今天的預約
  expect(screen.queryByText('Robert08000')).toBeInTheDocument();
  expect(screen.queryByText('PastBooking')).not.toBeInTheDocument();
});
```

---

### End-to-End Testing (Playwright)

**測試場景：**
1. **完整使用者流程**
   - 進入 `/booking/calendar` → 驗證 SidebarLayout 渲染
   - 改變篩選條件 → 驗證 Gantt 圖更新
   - 點擊預約 → 驗證詳情面板顯示
   - 點擊 Book Now → 驗證導航成功

2. **響應式測試**
   - Desktop (1920x1080): 驗證 3 欄佈局
   - Tablet (768x1024): 驗證 2 欄佈局
   - Mobile (375x667): 驗證 Drawer sidebar，垂直堆疊

3. **邊界情況**
   - Empty state: 無預約資料
   - Loading state: API 請求中
   - Error state: API 請求失敗

**Playwright 測試檔案位置：**
- `src/test/e2e/booking-calendar.spec.ts`

**關鍵測試：**
```typescript
test('displays gantt chart with bookings', async ({ page }) => {
  await page.goto('/booking/calendar');
  
  // 驗證 SidebarLayout
  await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
  
  // 驗證 Gantt 圖存在
  await expect(page.locator('.gantt-container')).toBeVisible();
  
  // 驗證至少 1 個 task bar
  const taskBars = page.locator('.bar');
  await expect(taskBars).toHaveCount({ gte: 1 });
});

test('mobile viewport shows drawer', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/booking/calendar');
  
  // 驗證 hamburger menu 存在
  await expect(page.locator('[aria-label="menu"]')).toBeVisible();
});
```

## Performance Considerations

**優化策略：**
1. **資料篩選優化**：使用 `useMemo` 快取篩選結果，避免每次 render 重新計算
2. **Gantt 圖懶加載**：若預約數量 > 500，考慮分頁或虛擬滾動（暫不實作）
3. **RTK Query 快取**：利用 `providesTags` 避免重複請求

**效能目標：**
- 首次渲染 < 500ms（100 筆預約）
- 篩選操作回應 < 200ms
- 支援最多 1000 筆預約（無虛擬滾動）

## Implementation Phases (對應 tasks.md)

**Phase 1: Types & Data Models**
- 定義 `booking.types.ts`, `gantt.types.ts`

**Phase 2: Services & Hooks**
- 實作 `bookingCalendarServices.ts`
- 實作 `useGanttTasks.ts`, `useBookingCalendar.ts`

**Phase 3: Components**
- 實作 `GanttChartView.tsx`
- 實作 `CalendarFilterBar.tsx`
- 實作 `BookingDetailsPanel.tsx`
- 實作 `BookingCalendar.tsx`

**Phase 4: Integration**
- 新增路由 `/booking/calendar`
- 更新 `index.ts` export

**Phase 5: Testing**
- Playwright e2e tests
- Unit tests for hooks

## Technology Decisions

### 為何選擇 gantt-task-react？
- ✅ 已安裝，無需新增依賴
- ✅ 支援 TypeScript
- ✅ 提供基本 Gantt 功能（時間軸、task bars）
- ❌ 不支援拖拉調整（符合 requirements out of scope）

### 為何不使用 FullCalendar？
- 專案已有 FullCalendar，但其專注於日曆事件視圖，不適合資源分配的甘特圖場景
- gantt-task-react 更適合時間軸導向的視覺化

### 為何篩選邏輯在 client-side？
- **初期資料量小**：預計 < 500 筆預約，client-side 篩選效能足夠
- **簡化 API**：避免複雜的 query parameters
- **未來擴展**：若資料量增大，可輕鬆改為 server-side filtering（修改 RTK Query 參數）

## Migration & Rollback Plan

**無破壞性變更：**
- 新增功能，不修改既有 Booking Create 頁面
- 新增路由，不影響現有路由
- 若需 rollback，僅需移除 `/booking/calendar` 路由項

**階段性上線：**
1. Phase 1-2: 僅實作 types + services（不影響 UI）
2. Phase 3: 實作 components（可在 `/booking/calendar` 獨立測試）
3. Phase 4: 整合路由（正式上線）
