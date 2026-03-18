# /figma-plan — Figma MCP → Plan Mode → React 18 + AntD 頁面（Feature-based）

> 從 Figma MCP 讀取設計，進入 **Claude Code Plan Mode** 規劃實作方案，經用戶核准後產出 **React 18 + TypeScript + Ant Design + Tailwind v3** 頁面元件，全程採 Feature-based 路徑。

---

## 整體流程（必須遵守執行順序）

**請嚴格依照以下順序執行：**

1. **第一步：Figma MCP 讀取設計**
   - 使用 `get_design_context` 讀取用戶提供的 Figma URL 或目前選取的 Frame。
   - 同時使用 `get_screenshot` 取得截圖，以便後續對照。
   - 若需要了解結構，可額外呼叫 `get_metadata`。

2. **第二步：進入 Plan Mode 規劃實作方案**
   - 呼叫 `EnterPlanMode` 進入規劃模式。
   - 在 Plan 中包含以下內容（全部使用台灣繁體中文）：
     - Feature 名稱、檔名、路徑
     - 路由規劃
     - 區塊切分（對照 Figma 結構）
     - 元件拆分建議（哪些需拆成獨立元件、哪些可重用既有元件）
     - 資料流與狀態管理方向
     - 需要的 AntD 元件清單
   - 等待用戶核准 Plan 後才進入實作。

3. **第三步：實作 React 18 + AntD 頁面**
   - 根據核准的 Plan，產出頁面元件程式碼。
   - 嚴格遵守本文件所有技術規範。

---

## 檔名與路徑規範（必須遵守）

- `<feature>` 優先取 **Figma 的 Page 名稱**；若 Page 不適合，取節點名以「/」分段後的 **第一段**。
  若仍無法判定，暫用 `samples`，並在檔案頂部以台灣繁體中文註解標明需人工調整。
- 頁面檔名 **遵照 Figma 節點名稱，轉為 PascalCase**：
  - 移除非法字元
  - 移除空白，每個字首大寫（PascalCase）
  例如：`Member Home` → `MemberHome.tsx`、`Booking Details` → `BookingDetails.tsx`
- **落檔路徑**：
  - 頁面元件：`src/features/<feature>/pages/<FigmaName>.tsx`
  - 子元件：`src/features/<feature>/components/`
  - Feature index：`src/features/<feature>/index.ts`（匯出公開 API）

---

## 1. 技術棧與使用原則（React 18 + AntD + Tailwind v3）

- **React 18 + TypeScript + Tailwind CSS v3 + Ant Design（antd）**
  - 使用 **函式型元件（Function Component）**，不可使用 class component。
  - JSX 內一律使用 `className` 而不是 `class`。
- **AntD 使用優先順序（非常重要）：**
  1. **能用 AntD 就一定要用 AntD**
     - 只要 Figma 元件對得上 AntD 類型，就必須使用對應的 AntD 元件，例如（不限於）：
       - Button, Input, InputNumber, Select, DatePicker, TimePicker, RangePicker, Checkbox, Radio, Switch
       - Form, Form.Item
       - Table, List, Descriptions
       - Modal, Drawer, Popover, Tooltip
       - Tabs, Steps, Pagination
       - Layout（Header, Sider, Content, Footer）
       - Menu, Breadcrumb, Dropdown, Tag, Badge, Avatar, Card, Skeleton, Empty, Alert, Result 等。
  2. **沒有完全對應的，也要用 AntD 去組合**
     - 例如：用 `Card + Typography + Button + Space` 組出資訊卡；用 `Form + Form.Item + Input` 組出表單區塊。
- **Tailwind v3 使用範圍：**
  - 版面排版（`flex` / `grid` / `gap-*` / `justify-*` / `items-*`）
  - 間距與尺寸（`p-*`, `m-*`, `w-*`, `h-*`, `max-w-*` 等）
  - 細節調整（`rounded-*`, `shadow-*`, `border-*`, `bg-*`, `text-*` 等）
  - **不覆寫 AntD 的功能與交互邏輯**（例如驗證、loading 狀態、disabled 行為交給 AntD 控制）。

---

## 2. 專案既有元件重用規則

在生成頁面時，請嚴格遵守以下重用原則：

1. **Layout 使用 `SidebarLayout`**
   - 專案已有 `SidebarLayout`（`src/shared/layouts/SidebarLayout.tsx`），所有需要側邊欄的頁面必須使用：
     ```tsx
     import SidebarLayout from "@shared/layouts/SidebarLayout";
     ```
   - Props：`children`, `sidebarItems?`, `activeId?`, `breadcrumbItems?`
   - 不要重新實作 Layout / Sidebar / Header。

2. **優先掃描專案既有共用元件**
   - 在 Plan Mode 中，先用 Glob/Grep 工具掃描 `src/shared/components/` 和 `src/features/` 下既有元件。
   - 若已有類似功能元件（如 `BookingStatusTag`, `CalendarFilterBar` 等），優先重用。

3. **只有在無法重用的情況下才新增元件**
   - 新增元件時放在 `src/features/<feature>/components/` 下。
   - 在註解中說明：「目前未偵測到可重用元件，暫時新增。」

---

## 3. Design Tokens 使用規範（顏色 / 字體 / 間距 / 圓角 / 陰影）

- **所有顏色 / 字體 / 間距 / 圓角 / 陰影 必須來源於 Figma Tokens / Variables**
  - 優先使用已對應到：
    - Tailwind config 中的語義化 class（例如：`bg-brand-500`, `text-body`, `shadow-card`, `rounded-xl` 等）。
    - CSS :root 中的變數（例如：`bg-[var(--color-brand-500)]`）。
  - 若 AntD 已透過主題設定覆寫 token（例如 `colorPrimary`, `borderRadius`, `fontFamily`）：
    - 請在註解中說明此設計對應哪一個 AntD token。
- **禁止魔法數字（magic numbers）**
  - 不要在 className / 變數中硬寫完全沒有對應的尺寸 / 顏色。
  - 若真的缺少 token：
    1. 在回覆中列出「缺少的 Tokens 清單」，標註「需在 Figma 及 Design Tokens 系統中補齊」。
    2. 產碼時暫時使用最接近的既有 token，並以台灣繁體中文註解標示為暫時替代方案。

---

## 4. React + AntD 元件實作要求

- 頁面需輸出為一個預設匯出的 React 函式型元件，範例結構：

    ```tsx
    import SidebarLayout from "@shared/layouts/SidebarLayout";
    import { Typography, Button /* 其他需要的 AntD 元件 */ } from "antd";

    const { Title, Text } = Typography;

    const BookingDetails: React.FC = () => {
      return (
        <SidebarLayout activeId="booking" breadcrumbItems={[...]}>
          <div className="p-6">
            {/* 依照 Figma 版面切分區塊，註解一律使用台灣繁體中文 */}
          </div>
        </SidebarLayout>
      );
    };

    export default BookingDetails;
    ```

- 把 Figma 的階層結構轉為合理的區塊：
  - Header / SubHeader / Main Content / Sidebar / Footer 等。
  - 優先使用 AntD 的 `Card`, `Form`, `Table`, `Tabs`, `List`, `Descriptions` 等組出層次。
- Tailwind v3：
  - 用於控制 spacing、排版與細節，不取代 AntD 的邏輯與狀態控制。
- **Inline style 規則**：
  - **禁止**自行撰寫的 inline style（`style={{ color: 'red', margin: 10 }}` 等）。
  - **允許** AntD 元件 props 所需的 style（如 `Modal` 的 `width`、`Table` 的 `scroll`、`Drawer` 的 `styles` 等），因為這些是 AntD API 的一部分。
  - 版面與樣式優先透過：
    - AntD props
    - Tailwind className
    - 既有 design tokens。

---

## 5. Plan Mode 規劃內容（第二步詳細說明）

進入 Plan Mode 後，Plan 文件應包含以下章節（台灣繁體中文）：

### 5.1 Feature 與路由規劃
- `<feature>` 名稱
- 建議 route path（如：`/booking/details/:id`）
- 對應的使用情境

### 5.2 區塊切分
- 列出頁面主要區塊（對照 Figma 截圖）
- 說明每個區塊的職責與預期資料來源

### 5.3 元件拆分
- 哪些區塊適合抽成獨立元件
- 哪些可重用既有元件（掃描結果）
- 新元件的命名與檔案路徑

### 5.4 AntD 元件對應表
- Figma 元件 → 對應的 AntD 元件
- 需要的 AntD imports 清單

### 5.5 資料流與 API
- 頁面需要的資料（props / API / store）
- 若已有對應的 API service（RTK Query），列出檔案路徑
- 若需新增 API：規劃 RTK Query service 檔案（放在 `services/` 或 `api/` 目錄），包含 endpoint 名稱、query/mutation hooks

### 5.6 實作步驟
- 依序列出需要建立 / 修改的檔案
- 每個步驟的簡述

---

## 6. 實作頁面（第三步詳細說明）

在 Plan 核准後：

- 檔案位置：`src/features/<feature>/pages/<FigmaName>.tsx`
- 完整匯入：
  - SidebarLayout
  - 所需的 AntD 元件
  - 既有共用元件
- 嚴格遵守：
  - AntD 優先使用原則
  - Design tokens 使用規範
  - Inline style 規則（禁止自行撰寫；允許 AntD API 所需）
- 同步更新：
  - `src/features/<feature>/index.ts`（匯出新頁面）
  - `src/routes.tsx`（新增路由）

---

## 7. 版面切分與命名建議

在實作完成後，請在回覆最後追加「版面切分與命名建議」：

1. **元件切分建議**
   - 哪些區塊適合抽成獨立元件
   - 建議放置的目錄
   - 若已有類似元件，提示「建議優先重用 XXX 元件」

2. **命名原則**
   - 元件名稱以用途命名，非外觀命名（例如：`BookingDetailCard` 而不是 `BlueBoxCard`）
   - className 對應語義化 token

3. **提醒**
   - 所有版面與樣式實作必須透過：design tokens / AntD 元件 / Tailwind utilities
   - 禁止自行撰寫的 inline style；允許 AntD 元件 API 所需的 style props
