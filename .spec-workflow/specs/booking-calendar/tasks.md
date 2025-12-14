# Tasks Document - Booking Calendar

## Overview

此文件將 Booking Calendar 的設計拆解為可執行的原子任務。任務順序遵循依賴關係：types → services → hooks → components → routes → tests。

**執行規範：**
- 每個任務開始前標記為 `[-]` (in-progress)
- 完成後立即標記為 `[x]` (completed) 並使用 `log-implementation` 記錄
- 嚴格遵守 feature-based 架構，不自創分層

---

## Phase 1: Types & Data Models

### Task 1.1: 建立 Booking Domain Types

- [x] 1.1. 建立 Booking Domain Types
  - **File**: `src/features/booking/types/booking.types.ts`
  - **Purpose**: 定義 BookingTask domain model 與 Filter 相關型別
  - **Content**:
    - `BookingTask` interface (id, resourceName, startTime, endTime, status, dataRoom, utilization, server)
    - `FilterState` interface (timeRange, customRange, sortBy, allowedOverlap)
    - `TimeRangeOption` type ('today' | 'week' | 'month' | 'custom')
    - `SortOption` type ('resource' | 'startTime' | 'endTime' | 'created')
  - **_Leverage**: 參考 `src/features/maintainer-manager/types/user.types.ts` 的命名慣例
  - **_Requirements**: Requirements 1, 2, 3, 4
  - **_Prompt**:
    ```
    Implement the task for spec booking-calendar, first run spec-workflow-guide to get the workflow guide then implement the task:
    
    Role: TypeScript Developer 專精於 Domain-Driven Design 與型別系統
    
    Task: 建立 `src/features/booking/types/booking.types.ts`，定義 BookingTask domain model（包含 id, resourceName, startTime ISO 8601, endTime, status enum, dataRoom, utilization object, server object），FilterState（timeRange, customRange optional, sortBy, allowedOverlap boolean），TimeRangeOption 與 SortOption 型別，參考 design.md Data Models 章節
    
    Restrictions: 
    - 時間必須使用 ISO 8601 字串格式（不使用 Date 物件）
    - status 必須為 enum ('pending' | 'running' | 'completed' | 'overlap')
    - 禁用 any 型別
    - 所有註解使用繁體中文
    
    Success: 
    - TypeScript 編譯無錯誤
    - 所有 interface 匯出且命名清晰
    - 符合 structure.md 的 naming conventions
    
    Post-Implementation:
    1. 標記 tasks.md Task 1.1 為 in-progress [-]
    2. 完成後使用 log-implementation 工具記錄（必須包含 artifacts.classes 或 artifacts.functions）
    3. 標記 Task 1.1 為 completed [x]
    ```

---

### Task 1.2: 建立 Gantt Adapter Types

- [x] 1.2. 建立 Gantt Adapter Types
  - **File**: `src/features/booking/types/gantt.types.ts`
  - **Purpose**: 隔離 gantt-task-react 套件型別，未來若更換套件只需修改此檔
  - **Content**:
    - Re-export `Task`, `ViewMode` from 'gantt-task-react'
    - 定義 `GanttChartViewProps` interface
  - **_Leverage**: gantt-task-react 套件已安裝
  - **_Requirements**: Requirements 1
  - **_Prompt**:
    ```
    Implement the task for spec booking-calendar, first run spec-workflow-guide to get the workflow guide then implement the task:
    
    Role: TypeScript Developer 專精於套件封裝與型別隔離
    
    Task: 建立 `src/features/booking/types/gantt.types.ts`，re-export Task 與 ViewMode from 'gantt-task-react'，定義 GanttChartViewProps（tasks: Task[], isLoading: boolean, error?: string, onTaskClick: (task: Task) => void, viewMode: ViewMode），參考 design.md Component 2
    
    Restrictions:
    - 必須使用 re-export，不直接在 components 中 import gantt-task-react types
    - GanttChartViewProps 必須明確定義所有 props 型別
    - 禁用 any
    
    Success:
    - gantt-task-react types 成功 re-export
    - GanttChartViewProps 型別完整
    - Components 可透過此檔案 import 所需型別
    
    Post-Implementation:
    1. 標記 tasks.md Task 1.2 為 in-progress [-]
    2. 完成後使用 log-implementation 工具記錄
    3. 標記 Task 1.2 為 completed [x]
    ```

---

## Phase 2: Services Layer

### Task 2.1: 建立 RTK Query Booking Calendar Service

- [x] 2.1. 建立 RTK Query Booking Calendar Service
  - **File**: `src/features/booking/services/bookingCalendarServices.ts`
  - **Purpose**: 定義 API endpoints（getBookings）並整合 RTK Query
  - **Content**:
    - createApi 配置（reducerPath: 'bookingCalendarApi'）
    - baseQuery: `baseQueryWithErrorHandler`
    - tagTypes: ['Booking']
    - endpoint: `getBookings` query (返回 `BookingTask[]`)
    - 自動生成 hooks: `useGetBookingsQuery`
  - **_Leverage**: 
    - `@shared/services/baseQueryWithErrorHandler.ts`
    - 參考 `src/features/maintainer-manager/services/userManagementServices.ts`
  - **_Requirements**: Requirements 1
  - **_Prompt**:
    ```
    Implement the task for spec booking-calendar, first run spec-workflow-guide to get the workflow guide then implement the task:
    
    Role: Full-stack Developer 專精於 RTK Query 與 API 設計
    
    Task: 建立 `src/features/booking/services/bookingCalendarServices.ts`，使用 createApi 定義 bookingCalendarApi（reducerPath: 'bookingCalendarApi', baseQuery: baseQueryWithErrorHandler, tagTypes: ['Booking']），實作 getBookings endpoint（query: () => '/api/bookings', 返回 BookingTask[], providesTags: ['Booking']），匯出 useGetBookingsQuery hook，參考 design.md Service 章節與 userManagementServices.ts 模式
    
    Restrictions:
    - 必須使用 baseQueryWithErrorHandler（from @shared/services）
    - endpoint 返回型別必須明確為 BookingTask[]
    - 禁止在 service 層處理 UI 邏輯
    - 必須配置 providesTags 支援快取
    
    Success:
    - RTK Query API 正確配置
    - useGetBookingsQuery hook 可正常使用
    - TypeScript 型別檢查通過
    - 符合既有 services 模式
    
    Post-Implementation:
    1. 標記 tasks.md Task 2.1 為 in-progress [-]
    2. 完成後使用 log-implementation 工具記錄（必須包含 artifacts.apiEndpoints）
    3. 標記 Task 2.1 為 completed [x]
    ```

---

### Task 2.2: 註冊 Booking Calendar API 至 Redux Store

- [x] 2.2. 註冊 Booking Calendar API 至 Redux Store
  - **File**: `src/store/store.ts` (修改既有檔案)
  - **Purpose**: 將 bookingCalendarApi 註冊至 Redux store
  - **Content**:
    - import bookingCalendarApi
    - 將 `bookingCalendarApi.reducer` 加入 reducer
    - 將 `bookingCalendarApi.middleware` 加入 middleware
  - **_Leverage**: 既有 store 配置模式
  - **_Requirements**: Requirements 1
  - **_Prompt**:
    ```
    Implement the task for spec booking-calendar, first run spec-workflow-guide to get the workflow guide then implement the task:
    
    Role: Redux Developer 專精於 Store 配置與 Middleware
    
    Task: 修改 `src/store/store.ts`，import bookingCalendarApi from '@features/booking/services/bookingCalendarServices'，在 configureStore 的 reducer 中加入 [bookingCalendarApi.reducerPath]: bookingCalendarApi.reducer，在 middleware 中 concat bookingCalendarApi.middleware，參考既有 RTK Query API 的註冊方式
    
    Restrictions:
    - 不可修改既有 reducer 或 middleware 配置
    - 必須使用 reducerPath 作為 key
    - 必須使用 concat 方式加入 middleware
    
    Success:
    - store 正確配置 bookingCalendarApi
    - 應用啟動無錯誤
    - RTK Query hooks 可正常使用
    
    Post-Implementation:
    1. 標記 tasks.md Task 2.2 為 in-progress [-]
    2. 完成後使用 log-implementation 工具記錄
    3. 標記 Task 2.2 為 completed [x]
    ```

---

## Phase 3: Hooks Layer

### Task 3.1: 實作 useGanttTasks Hook (Adapter)

- [x] 3.1. 實作 useGanttTasks Hook (Adapter)
  - **File**: `src/features/booking/hooks/useGanttTasks.ts`
  - **Purpose**: 將 BookingTask[] 轉換為 gantt-task-react 的 Task[]
  - **Content**:
    - 接收 `bookings: BookingTask[]` 參數
    - 使用 `useMemo` 進行資料轉換
    - 將 startTime/endTime (ISO string) 轉為 Date
    - 根據 status 設定不同 backgroundColor (overlap 用 '#faad14', 其他用 '#1890ff')
    - 返回 `Task[]`
  - **_Leverage**: dayjs 套件（已安裝），參考 design.md Hook 2
  - **_Requirements**: Requirements 1, 4
  - **_Prompt**:
    ```
    Implement the task for spec booking-calendar, first run spec-workflow-guide to get the workflow guide then implement the task:
    
    Role: React Developer 專精於 Hooks 與資料轉換
    
    Task: 建立 `src/features/booking/hooks/useGanttTasks.ts`，實作 useGanttTasks(bookings: BookingTask[]): Task[] hook，使用 useMemo 將 BookingTask 轉為 gantt-task-react Task 格式（id, name: resourceName, start: dayjs(startTime).toDate(), end: dayjs(endTime).toDate(), progress: 100, type: 'task', styles: { backgroundColor: status === 'overlap' ? '#faad14' : '#1890ff' }），參考 design.md Hook 2 Implementation Logic
    
    Restrictions:
    - 必須使用 useMemo 優化效能
    - 時間轉換必須使用 dayjs
    - 禁止在此 hook 中呼叫 API
    - 必須處理空陣列情況
    
    Success:
    - BookingTask 正確轉換為 Task
    - overlap 狀態顯示不同顏色
    - useMemo 正確配置 dependencies
    - 無 TypeScript 錯誤
    
    Post-Implementation:
    1. 標記 tasks.md Task 3.1 為 in-progress [-]
    2. 完成後使用 log-implementation 工具記錄（必須包含 artifacts.functions）
    3. 標記 Task 3.1 為 completed [x]
    ```

---

### Task 3.2: 實作 useBookingCalendar Hook (狀態管理)

- [x] 3.2. 實作 useBookingCalendar Hook (狀態管理)
  - **File**: `src/features/booking/hooks/useBookingCalendar.ts`
  - **Purpose**: 整合 API 資料獲取、篩選、排序、選取邏輯
  - **Content**:
    - 使用 `useGetBookingsQuery()` 獲取資料
    - 使用 `useState` 管理 filters (FilterState)
    - 使用 `useState` 管理 selectedBooking
    - 使用 `useMemo` 實作 client-side filtering (timeRange)
    - 使用 `useMemo` 實作 client-side sorting (sortBy)
    - 提供 `updateFilter` 函數
    - 提供 `selectBooking` 函數
    - 返回 `UseBookingCalendarReturn` 物件
  - **_Leverage**: dayjs 套件，參考 design.md Hook 1
  - **_Requirements**: Requirements 1, 2, 3, 4
  - **_Prompt**:
    ```
    Implement the task for spec booking-calendar, first run spec-workflow-guide to get the workflow guide then implement the task:
    
    Role: React Developer 專精於複雜狀態管理與資料處理
    
    Task: 建立 `src/features/booking/hooks/useBookingCalendar.ts`，實作 useBookingCalendar() hook，整合 useGetBookingsQuery 獲取資料、useState 管理 filters（初始值 timeRange: 'today', sortBy: 'startTime', allowedOverlap: false）與 selectedBooking（初始 null）、useMemo 實作 timeRange client-side 篩選（today: 當天, week: 本週, month: 本月）、useMemo 實作 sortBy client-side 排序（resource: resourceName A-Z, startTime: 升序, endTime: 降序）、提供 updateFilter 與 selectBooking 函數，返回 { bookings, isLoading, error, filters, updateFilter, selectedBooking, selectBooking }，參考 design.md Hook 1
    
    Restrictions:
    - 篩選與排序必須在 client-side 進行（useMemo）
    - 必須處理 API loading 與 error 狀態
    - updateFilter 必須使用 partial update（spread operator）
    - 禁止直接修改 state（immutable updates）
    
    Success:
    - API 資料正確獲取
    - 篩選邏輯正確（today/week/month）
    - 排序邏輯正確（3 種模式）
    - useMemo dependencies 正確配置
    - TypeScript 型別完整
    
    Post-Implementation:
    1. 標記 tasks.md Task 3.2 為 in-progress [-]
    2. 完成後使用 log-implementation 工具記錄（必須包含 artifacts.functions）
    3. 標記 Task 3.2 為 completed [x]
    ```

---

## Phase 4: Components Layer

### Task 4.1: 實作 GanttChartView Component

- [x] 4.1. 實作 GanttChartView Component
  - **File**: `src/features/booking/components/GanttChartView.tsx`
  - **Purpose**: 封裝 gantt-task-react 的 Gantt 元件，處理 loading/empty/error states
  - **Content**:
    - 接收 `GanttChartViewProps`
    - Loading state: 使用 Ant Design `<Skeleton active paragraph={{ rows: 8 }} />`
    - Error state: 使用 `<Alert type="error" message={error} />`
    - Empty state: 使用 `<Empty description="No bookings found" />`
    - 正常狀態: 渲染 `<Gantt>` 元件（from gantt-task-react）
    - 配置 Gantt props: `tasks`, `viewMode={ViewMode.Day}`, `onSelect={onTaskClick}`, `columnWidth={60}`, `listCellWidth="150px"`
  - **_Leverage**: 
    - gantt-task-react 套件
    - Ant Design Skeleton, Empty, Alert
  - **_Requirements**: Requirements 1
  - **_Prompt**:
    ```
    Implement the task for spec booking-calendar, first run spec-workflow-guide to get the workflow guide then implement the task:
    
    Role: React Developer 專精於第三方套件整合與 UI 狀態處理
    
    Task: 建立 `src/features/booking/components/GanttChartView.tsx`，實作 GanttChartView 元件，接收 GanttChartViewProps（tasks, isLoading, error, onTaskClick, viewMode），處理 3 種狀態：isLoading 顯示 <Skeleton active paragraph={{ rows: 8 }} />、error 顯示 <Alert type="error" message={error} />、tasks.length === 0 顯示 <Empty description="No bookings found" />，正常狀態渲染 <Gantt tasks={tasks} viewMode={viewMode || ViewMode.Day} onSelect={onTaskClick} columnWidth={60} listCellWidth="150px" />，參考 design.md Component 2
    
    Restrictions:
    - 必須處理所有 3 種 edge cases（loading/error/empty）
    - 必須使用 Ant Design 元件
    - Gantt 元件必須配置 columnWidth 與 listCellWidth
    - 禁止在此元件中呼叫 API
    - 所有 props 必須明確型別
    
    Success:
    - Loading state 正確顯示 Skeleton
    - Error state 正確顯示 Alert
    - Empty state 正確顯示 Empty
    - 有資料時 Gantt 正確渲染
    - onTaskClick 事件正確觸發
    - 符合 Figma 設計（時間軸、task bars）
    
    Post-Implementation:
    1. 標記 tasks.md Task 4.1 為 in-progress [-]
    2. 完成後使用 log-implementation 工具記錄（必須包含 artifacts.components）
    3. 標記 Task 4.1 為 completed [x]
    ```

---

### Task 4.2: 實作 CalendarFilterBar Component

- [x] 4.2. 實作 CalendarFilterBar Component
  - **File**: `src/features/booking/components/CalendarFilterBar.tsx`
  - **Purpose**: 篩選與排序 UI（controlled component）
  - **Content**:
    - 接收 `CalendarFilterBarProps`（timeRange, onTimeRangeChange, sortBy, onSortByChange, allowedOverlap, onAllowedOverlapChange）
    - 渲染 Time Range Select（options: Today, This Week, This Month）
    - 渲染 Sort by Select（options: Resource Name, Start Time, End Time）
    - 渲染 Allowed Overlap Checkbox
    - 使用 Tailwind 響應式佈局（flex flex-wrap gap-4）
  - **_Leverage**: Ant Design Select, Checkbox
  - **_Requirements**: Requirements 2, 3, 4
  - **_Prompt**:
    ```
    Implement the task for spec booking-calendar, first run spec-workflow-guide to get the workflow guide then implement the task:
    
    Role: React Developer 專精於 Form Controls 與 Controlled Components
    
    Task: 建立 `src/features/booking/components/CalendarFilterBar.tsx`，實作 CalendarFilterBar 元件，接收 CalendarFilterBarProps（timeRange, onTimeRangeChange, sortBy, onSortByChange, allowedOverlap, onAllowedOverlapChange），渲染 3 個控制項：1) Time Range Select（value={timeRange}, onChange={onTimeRangeChange}, options: today/week/month, className="w-40"）、2) Sort by Select（value={sortBy}, onChange={onSortByChange}, options: resource/startTime/endTime, className="w-40"）、3) Allowed Overlap Checkbox（checked={allowedOverlap}, onChange={e => onAllowedOverlapChange(e.target.checked)}），使用 <div className="flex flex-wrap gap-4 mb-4"> 包裹，參考 design.md Component 3
    
    Restrictions:
    - 必須為 controlled component（所有 state 由 parent 管理）
    - 必須使用 Ant Design Select 與 Checkbox
    - 必須使用 Tailwind utilities（禁用 inline style）
    - Select options 必須使用 <Option> 子元件
    - 響應式佈局使用 flex-wrap
    
    Success:
    - Time Range Select 正確顯示與觸發
    - Sort by Select 正確顯示與觸發
    - Allowed Overlap Checkbox 正確顯示與觸發
    - 響應式佈局在 mobile/desktop 正常運作
    - 符合 Figma 設計樣式
    
    Post-Implementation:
    1. 標記 tasks.md Task 4.2 為 in-progress [-]
    2. 完成後使用 log-implementation 工具記錄（必須包含 artifacts.components）
    3. 標記 Task 4.2 為 completed [x]
    ```

---

### Task 4.3: 實作 BookingDetailsPanel Component

- [x] 4.3. 實作 BookingDetailsPanel Component
  - **File**: `src/features/booking/components/BookingDetailsPanel.tsx`
  - **Purpose**: 顯示選中預約的詳細資訊
  - **Content**:
    - 接收 `BookingDetailsPanelProps`（booking: BookingTask | null, onShowMore?: (id: string) => void）
    - 若 booking === null: 顯示 "Select a booking to view details"
    - 若有 booking: 使用 Ant Design Card 顯示詳情
      - Data room 資訊
      - Utilization metrics（Left capacity, Booking status）
      - Server details（name, type, GPU, Data used %）
      - Status Badge（使用 Ant Design Badge，根據 status 顯示不同顏色）
      - "show more details" 連結（optional，呼叫 onShowMore）
  - **_Leverage**: Ant Design Card, Badge, Descriptions
  - **_Requirements**: Requirements 6
  - **_Prompt**:
    ```
    Implement the task for spec booking-calendar, first run spec-workflow-guide to get the workflow guide then implement the task:
    
    Role: React Developer 專精於資料展示與 Ant Design 元件
    
    Task: 建立 `src/features/booking/components/BookingDetailsPanel.tsx`，實作 BookingDetailsPanel 元件，接收 BookingDetailsPanelProps（booking: BookingTask | null, onShowMore optional），處理 2 種狀態：1) booking === null 顯示空狀態訊息、2) 有 booking 使用 <Card title="Booking Details"> 顯示內容（使用 Descriptions 顯示 dataRoom, utilization.leftCapacity, utilization.bookingStatus, server.name, server.type, server.gpu, server.dataUsed，使用 Badge 顯示 status（pending: default, running: processing, completed: success, overlap: warning），若 onShowMore 存在顯示可點擊的 "show more details" 連結），參考 design.md Component 4 與 Figma 右側面板設計
    
    Restrictions:
    - 必須使用 Ant Design Card, Descriptions, Badge
    - 必須處理 null 狀態
    - Badge 顏色必須根據 status 動態設定
    - 禁用 inline style
    - onShowMore 必須為 optional
    
    Success:
    - null 狀態正確顯示提示訊息
    - 有 booking 時正確顯示所有欄位
    - Status Badge 顏色正確對應
    - show more details 連結正確觸發（若有 onShowMore）
    - 符合 Figma 設計樣式
    
    Post-Implementation:
    1. 標記 tasks.md Task 4.3 為 in-progress [-]
    2. 完成後使用 log-implementation 工具記錄（必須包含 artifacts.components）
    3. 標記 Task 4.3 為 completed [x]
    ```

---

### Task 4.4: 實作 BookingCalendar 主頁面元件

- [x] 4.4. 實作 BookingCalendar 主頁面元件
  - **File**: `src/features/booking/components/BookingCalendar.tsx`
  - **Purpose**: 主容器元件，組合所有子元件並使用 SidebarLayout
  - **Content**:
    - 使用 `useBookingCalendar` hook 獲取資料與狀態
    - 使用 `useGanttTasks` hook 轉換資料
    - 使用 `useNavigate` 處理 Book Now 導航
    - 渲染結構：
      ```tsx
      <SidebarLayout>
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Calendar</h1>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleBookNow}>
              Book Now
            </Button>
          </div>
          
          {/* Filters */}
          <CalendarFilterBar {...filterProps} />
          
          {/* Main Content: Gantt + Details Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
            <GanttChartView {...ganttProps} />
            <BookingDetailsPanel {...detailsProps} />
          </div>
        </div>
      </SidebarLayout>
      ```
  - **_Leverage**: 
    - `@shared/layouts/SidebarLayout`
    - Ant Design Button
    - React Router useNavigate
  - **_Requirements**: Requirements 1, 2, 3, 4, 5, 6, 7
  - **_Prompt**:
    ```
    Implement the task for spec booking-calendar, first run spec-workflow-guide to get the workflow guide then implement the task:
    
    Role: React Developer 專精於元件組合與版面佈局
    
    Task: 建立 `src/features/booking/components/BookingCalendar.tsx`，實作 BookingCalendar 主元件，使用 useBookingCalendar 與 useGanttTasks hooks，使用 useNavigate（from react-router-dom），渲染 SidebarLayout 包裹內容，內部結構：1) Header（h1 "Calendar" + Book Now Button，點擊導航至 /booking/create）、2) CalendarFilterBar（傳入 filters 與 updateFilter）、3) Grid 佈局（grid-cols-1 lg:grid-cols-[1fr_360px]）包含 GanttChartView（傳入 tasks, isLoading, error, onTaskClick: selectBooking, viewMode: ViewMode.Day）與 BookingDetailsPanel（傳入 selectedBooking），參考 design.md Component 1 與 Figma 整體佈局
    
    Restrictions:
    - 必須使用 SidebarLayout（from @shared/layouts）
    - 必須使用 Tailwind 響應式佈局（md:p-6, lg:grid-cols-[1fr_360px]）
    - Book Now 必須導航至 /booking/create
    - 禁止在此元件中直接呼叫 API
    - 禁用 inline style
    
    Success:
    - SidebarLayout 正確渲染
    - Header 與 Book Now 按鈕正確顯示
    - CalendarFilterBar 正確整合
    - GanttChartView 與 BookingDetailsPanel 正確顯示
    - 響應式佈局在 desktop/tablet/mobile 正常運作
    - 點擊 Gantt bar 正確更新 BookingDetailsPanel
    - 點擊 Book Now 正確導航
    - 符合 Figma 完整設計
    
    Post-Implementation:
    1. 標記 tasks.md Task 4.4 為 in-progress [-]
    2. 完成後使用 log-implementation 工具記錄（必須包含 artifacts.components 與 artifacts.integrations）
    3. 標記 Task 4.4 為 completed [x]
    ```

---

## Phase 5: Routing & Integration

### Task 5.1: 新增 /booking/calendar 路由

- [x] 5.1. 新增 /booking/calendar 路由
  - **File**: `src/routes.tsx` (修改既有檔案)
  - **Purpose**: 註冊 Booking Calendar 路由
  - **Content**:
    - import BookingCalendar from '@features/booking'
    - 在 routes 陣列新增：
      ```tsx
      {
        path: "/booking/calendar",
        element: <BookingCalendar />,
        children: [],
      }
      ```
  - **_Leverage**: 既有 routes 配置模式
  - **_Requirements**: Requirements 1
  - **_Prompt**:
    ```
    Implement the task for spec booking-calendar, first run spec-workflow-guide to get the workflow guide then implement the task:
    
    Role: React Developer 專精於 React Router 配置
    
    Task: 修改 `src/routes.tsx`，import BookingCalendar from '@features/booking'（需先確認 index.ts 已 export），在 routes 陣列中新增路由物件 { path: "/booking/calendar", element: <BookingCalendar />, children: [] }，放置在 /booking/create 路由附近（保持語意分組），參考既有路由配置格式
    
    Restrictions:
    - 必須使用路徑別名 @features/booking
    - 不可修改既有路由
    - 路由物件格式必須與既有一致（包含 children 空陣列）
    
    Success:
    - 路由正確註冊
    - 訪問 /booking/calendar 顯示 BookingCalendar 元件
    - 既有路由不受影響
    - 無 TypeScript 錯誤
    
    Post-Implementation:
    1. 標記 tasks.md Task 5.1 為 in-progress [-]
    2. 完成後使用 log-implementation 工具記錄
    3. 標記 Task 5.1 為 completed [x]
    ```

---

### Task 5.2: 更新 Booking Feature Index

- [x] 5.2. 更新 Booking Feature Index
  - **File**: `src/features/booking/index.ts` (修改既有檔案)
  - **Purpose**: 統一導出 BookingCalendar 元件
  - **Content**:
    - 新增 export: `export { default as BookingCalendar } from './components/BookingCalendar';`
  - **_Leverage**: 既有 index.ts 模式
  - **_Requirements**: Requirements 1
  - **_Prompt**:
    ```
    Implement the task for spec booking-calendar, first run spec-workflow-guide to get the workflow guide then implement the task:
    
    Role: TypeScript Developer 專精於模組導出管理
    
    Task: 修改 `src/features/booking/index.ts`，新增 export { default as BookingCalendar } from './components/BookingCalendar'，保持既有 export（如 BookingCreate）不變，參考 src/features/auth/index.ts 或 src/features/maintainer-manager/index.ts 的導出模式
    
    Restrictions:
    - 必須使用 named export
    - 不可修改既有 export
    - 必須遵循既有命名慣例
    
    Success:
    - BookingCalendar 成功導出
    - 其他模組可透過 @features/booking import
    - 既有 exports 不受影響
    - 無 TypeScript 錯誤
    
    Post-Implementation:
    1. 標記 tasks.md Task 5.2 為 in-progress [-]
    2. 完成後使用 log-implementation 工具記錄
    3. 標記 Task 5.2 為 completed [x]
    ```

---

## Phase 6: Testing

### Task 6.1: 使用 Playwright MCP 建立 E2E 測試（可重跑）

- [x] 6.1. 使用 Playwright MCP 建立 E2E 測試（可重跑）
  - **File**: 無需建立測試檔案，直接使用 Playwright MCP 工具
  - **Purpose**: 使用 Playwright MCP 進行端到端測試 Booking Calendar 功能，測試必須可重跑
  - **Content**:
    - **測試場景 1: 基本渲染**
      - 使用 `mcp_playwright_browser_navigate` 訪問 /booking/calendar
      - 使用 `mcp_playwright_browser_snapshot` 驗證 SidebarLayout 存在
      - 驗證 Gantt 圖容器存在（class 或 role selector）
      - 驗證至少 1 個 task bar 顯示
    - **測試場景 2: 篩選功能**
      - 使用 `mcp_playwright_browser_click` 點擊 Time Range Select
      - 使用 `mcp_playwright_browser_click` 選擇 "This Week"
      - 使用 `mcp_playwright_browser_snapshot` 驗證 Gantt 圖更新
    - **測試場景 3: 點擊互動**
      - 使用 `mcp_playwright_browser_click` 點擊第一個 Gantt task bar
      - 使用 `mcp_playwright_browser_snapshot` 驗證 BookingDetailsPanel 顯示正確資訊（包含 Server name, GPU, Status）
    - **測試場景 4: Book Now 導航**
      - 使用 `mcp_playwright_browser_click` 點擊 "Book Now" 按鈕
      - 驗證 URL 變為 /booking/create
    - **測試場景 5: 響應式測試**
      - Desktop: 使用 `mcp_playwright_browser_resize` 設定 1920x1080
      - 驗證 3 欄佈局（Gantt + Details Panel 並排）
      - Mobile: 使用 `mcp_playwright_browser_resize` 設定 375x667
      - 驗證 Drawer sidebar（hamburger menu 存在）
    - **測試場景 6: Empty State**
      - （若有 API mock）清空 bookings 資料
      - 重新載入頁面
      - 使用 `mcp_playwright_browser_snapshot` 驗證 "No bookings found" Empty 元件顯示
  - **_Leverage**: Playwright MCP 工具（browser_navigate, browser_click, browser_snapshot, browser_resize, browser_wait_for）
  - **_Requirements**: All
  - **_Prompt**:
    ```
    Implement the task for spec booking-calendar, first run spec-workflow-guide to get the workflow guide then implement the task:
    
    Role: QA Engineer 專精於 Playwright MCP 工具與可重跑 E2E 測試
    
    Task: 使用 Playwright MCP 工具測試 Booking Calendar 功能，執行 6 個測試場景（所有測試必須可重跑）：
    
    1) 基本渲染測試：
       - browser_navigate 至 http://localhost:5173/booking/calendar
       - browser_snapshot 驗證頁面包含 "Calendar" heading
       - 驗證 Gantt 圖容器存在
       - 驗證至少 1 個 task bar 顯示
    
    2) 篩選功能測試：
       - browser_click Time Range dropdown
       - browser_click "This Week" option
       - browser_wait_for Gantt 更新完成
       - browser_snapshot 驗證篩選後結果
    
    3) 點擊互動測試：
       - browser_click 第一個 Gantt task bar（使用準確的 selector）
       - browser_wait_for BookingDetailsPanel 出現
       - browser_snapshot 驗證面板顯示 Server name, GPU, Status
    
    4) Book Now 導航測試：
       - browser_click "Book Now" 按鈕
       - 驗證當前 URL 為 /booking/create
    
    5) 響應式測試：
       - browser_resize 1920x1080
       - browser_snapshot 驗證 desktop 佈局（Gantt + Details Panel 並排）
       - browser_navigate 回到 /booking/calendar
       - browser_resize 375x667
       - browser_snapshot 驗證 mobile 佈局（hamburger menu 存在）
    
    6) Empty State 測試：
       - （如有需要）使用 browser_evaluate 清空資料或 mock API
       - browser_navigate 重新載入頁面
       - browser_snapshot 驗證 "No bookings found" Empty 元件
    
    參考 design.md Testing Strategy E2E 章節，所有測試步驟必須使用 Playwright MCP 工具執行，不建立測試檔案
    
    Restrictions:
    - 必須只使用 Playwright MCP 工具（browser_navigate, browser_click, browser_snapshot, browser_resize, browser_wait_for, browser_evaluate）
    - 不建立 .spec.ts 測試檔案
    - 每個測試場景必須可獨立重跑
    - 必須使用準確的 selector（role, text, class, data-testid）
    - 必須在測試前 browser_navigate 確保頁面狀態一致
    - 使用 browser_wait_for 處理非同步渲染
    
    Success:
    - 所有 6 個測試場景使用 Playwright MCP 成功執行
    - 每個測試可重跑（多次執行結果一致）
    - Desktop (1920x1080) 與 Mobile (375x667) viewport 測試通過
    - Empty state 測試通過
    - SidebarLayout 正確渲染
    - Gantt 圖正確顯示（至少 1 個 task bar）
    - 篩選功能正常運作
    - BookingDetailsPanel 點擊後正確顯示
    - Book Now 導航正確
    
    Post-Implementation:
    1. 標記 tasks.md Task 6.1 為 in-progress [-]
    2. 使用 Playwright MCP 執行所有 6 個測試場景並驗證
    3. 確認所有測試可重跑（至少執行 2 次驗證結果一致）
    4. 完成後使用 log-implementation 工具記錄（artifacts 包含測試場景與結果）
    5. 標記 Task 6.1 為 completed [x]
    ```

---

## Task Execution Notes

### Implementation Workflow（重要）

1. **開始任務前**：
   - 讀取該任務的 `_Prompt` 欄位
   - 編輯 `tasks.md`，將該任務的狀態從 `[ ]` 改為 `[-]`

2. **實作過程**：
   - 嚴格遵守 `_Prompt` 中的 Role、Task、Restrictions、Success 要求
   - 參考 `_Leverage` 欄位中的既有檔案與模式
   - 確保符合 `_Requirements` 中的需求編號

3. **完成任務後**：
   - 使用 `log-implementation` 工具記錄實作細節，必須包含：
     - `taskId`：任務編號（如 "1.1", "2.1"）
     - `summary`：1-2 句話總結實作內容
     - `filesModified`：修改的檔案列表
     - `filesCreated`：新建的檔案列表
     - `statistics`：{ linesAdded, linesRemoved }
     - **`artifacts`（必須）**：結構化資料
       - `apiEndpoints`: API 相關任務必須填寫（method, path, purpose, location）
       - `components`: UI 元件任務必須填寫（name, type, purpose, location, props）
       - `functions`: Hook/Utility 任務必須填寫（name, signature, location）
       - `classes`: Class 任務必須填寫（name, methods, location）
       - `integrations`: 整合任務必須填寫（description, frontendComponent, backendEndpoint, dataFlow）
   - 編輯 `tasks.md`，將該任務的狀態從 `[-]` 改為 `[x]`

4. **檢查點**：
   - 確保符合 **Success** 欄位定義的完成標準
   - 執行相關測試（如有）
   - 確認無 TypeScript 編譯錯誤
   - 確認無 ESLint 警告

### 技術規範提醒

- **禁用 inline style**：所有樣式必須使用 Tailwind utilities 或 Ant Design 元件樣式
- **Design Tokens**：顏色、字體、間距必須來自 Tailwind config 或 Ant Design tokens
- **TypeScript 嚴格模式**：所有程式碼必須通過 TypeScript 編譯，禁用 any 類型
- **註解語言**：所有註解必須使用台灣繁體中文
- **命名規範**：遵循 `structure.md` 定義的命名慣例
- **錯誤處理**：使用 `baseQueryWithErrorHandler` 統一處理 API 錯誤

### Spec-Workflow 整合

- 本任務使用 spec-workflow MCP 管理
- 每個任務完成後必須使用 `log-implementation` 記錄
- 測試階段必須使用 Playwright MCP 執行 e2e 測試
- 所有變更必須符合 requirements.md 與 design.md 定義

---

## Summary

**總任務數**: 13 個任務

**Phase 分佈**:
- Phase 1 (Types): 2 個任務
- Phase 2 (Services): 2 個任務
- Phase 3 (Hooks): 2 個任務
- Phase 4 (Components): 4 個任務
- Phase 5 (Routing): 2 個任務
- Phase 6 (Testing): 1 個任務

**預估時間**: 6-8 小時（含測試與除錯）

**依賴關係**:
```
Phase 1 (Types) → Phase 2 (Services) → Phase 3 (Hooks) → Phase 4 (Components) → Phase 5 (Routing) → Phase 6 (Testing)
```

**關鍵里程碑**:
1. Phase 1-2 完成：資料模型與 API 定義完成
2. Phase 3 完成：Hooks 層完成，可開始 UI 開發
3. Phase 4 完成：UI 元件完成，可進行手動測試
4. Phase 5 完成：路由整合完成，功能可訪問
5. Phase 6 完成：E2E 測試通過，功能完整交付
