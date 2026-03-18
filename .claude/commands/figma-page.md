# /figma-page — Spec Workflow 優先 → Figma MCP → React 18 + AntD 頁面（Feature-based）

> 以 **Spec Workflow MCP 為起點**，先從目前選取的 Figma Frame 萃取產品 / 介面規格，再交給 Figma MCP 生成 **React 18 + TypeScript + Ant Design + Tailwind v3** 頁面元件，最後只由 Playwright MCP 建立「視覺回歸測試」，全程採 Feature-based 路徑。

---

## 整體流程（必須遵守執行順序）

**請嚴格依照以下順序執行，即使是在同一輪回覆中完成：**

1. **第一步：Spec Workflow MCP**
   - 針對目前選取的 Figma Frame：
     - 定義 `<feature>` 名稱、檔名與路徑
     - 規劃路由、區塊切分
     - 撰寫 User Stories 與 AC
     - 定義設計與資料流的基本規格
   - 所有說明與註解均使用「台灣繁體中文」。

2. **第二步：Figma MCP → React 18 + AntD 頁面**
   - 根據「第一步產出的規格」，使用 Figma MCP 讀取目前選取的 Frame：
     - 產出 React 18 + TypeScript + AntD + Tailwind v3 的頁面元件程式碼。
     - 遵守檔名 / 路徑 / 切分方式等規格。

3. **第三步：Playwright MCP → 視覺回歸測試**
   - 依照「第一步的規格」與「第二步產出的頁面」，建立對應的 **視覺回歸測試檔**：
     - 設定 viewport 為目前選取 Frame 的寬 / 高。
     - 第一次建立 baseline，以後比對差異並給出處理建議。
   - 不需要規劃或產出其他種類的測試（不做單元測試 / E2E 測試的腳本）。

---

## 檔名與路徑規範（必須遵守）

- `<feature>` 優先取 **Figma 的 Page 名稱**；若 Page 不適合，取節點名以「/」分段後的 **第一段**。
  若仍無法判定，暫用 `samples`，並在檔案頂部以「台灣繁體中文」註解標明需人工調整。
- 頁面檔名 **遵照 Figma 節點名稱**：
  - 移除非法字元
  - 空白轉 `-`
  - 保持大小寫
  例如：`Member Home` → `Member-Home.tsx`
- **落檔路徑**：
  - 頁面元件：`src/pages/(<feature>)/<FigmaName>.tsx`
  - 若有拆出子元件：建議放於 `src/features/<feature>/components/` 底下（或專案既有的 feature-based 結構）。

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

## 2. 現有元件與 Layout / Sidebar 重用規則

在生成頁面時，請嚴格遵守以下重用原則：

1. **優先假設專案已有共用 Layout / Sidebar / UI Components**
   - 若 Figma 版面明顯使用共通框架（例如：左側菜單 + 右側內容、頂部 Header + 內容區等）：
     - 元件內請優先使用抽象名稱：
       - `<AppLayout>` / `<MainLayout>` / `<DashboardLayout>`
       - `<SidebarLayout>` / `<MainSidebar>` / `<SiderMenu>` 等
     - 並在檔案頂部撰寫台灣繁體中文註解，例如：
       「此處建議改用專案既有 AppLayout/SidebarLayout 元件，請依實際專案命名調整。」
2. **若專案合理推測已有共用 UI 元件（例如 PageHeader / FilterBar / DataTable 等）**
   - 優先使用語義化元件名稱，如 `<PageHeader />`, `<FilterBar />`, `<DataTable />`，而非重新命名新的變形。
   - 在註解中標明「建議使用專案既有的 XXX 元件」。
3. **只有在無法重用的情況下才新增元件**
   - 若推斷專案中沒有可重用元件，才在頁面內直接用 AntD + Tailwind 組出新結構。
   - 同時在註解中註明：「目前未偵測到可重用元件，暫時在頁面內直接使用 AntD 組合，後續可抽出為共用元件。」

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

- 頁面需輸出為一個預設匯出的 React 函式型元件，範例結構如下（實際內容請依 Figma ）：

    import React from "react";
    import { Layout, Typography, Button /* 其他需要的 AntD 元件 */ } from "antd";

    // 若專案已有 AppLayout/SidebarLayout，請優先改為匯入既有 Layout 元件
    const { Content } = Layout;
    const { Title, Text } = Typography;

    const Page: React.FC = () => {
      return (
        <Layout className="min-h-screen">
          {/* 建議：此處改用專案既有的 Layout/Sidebar 元件 */}
          <Content className="p-6">
            {/* 這裡依照 Figma 版面切分區塊，註解一律使用台灣繁體中文 */}
          </Content>
        </Layout>
      );
    };

    export default Page;

- 把 Figma 的階層結構轉為合理的區塊：
  - Header / SubHeader / Main Content / Sidebar / Footer 等。
  - 優先使用 AntD 的 `Layout`, `Card`, `Form`, `Table`, `Tabs`, `List` 等組出層次。
- Tailwind v3：
  - 用於控制 spacing、排版與細節，不取代 AntD 的邏輯與狀態控制。
- **嚴禁 inline style**：
  - 不得出現 `style={{ ... }}` 或 `style="..."`。
  - 只能透過：
    - AntD props
    - Tailwind className
    - 既有 design tokens。

---

## 5. 第一步：Spec Workflow MCP（優先步驟）

請**先**呼叫 **Spec Workflow MCP**，針對目前選取的 Figma Frame，產出「最小但完整的規格」，內容至少包含（全部使用台灣繁體中文）：

1. **Feature 與路由規劃**
   - `<feature>` 名稱。
   - 建議 route path（如：`/member/home`），並說明對應的使用情境。
2. **區塊切分**
   - 列出頁面主要區塊（例如：頁首區、篩選條、列表區、明細卡片區、操作列等）。
   - 說明每個區塊的職責與預期資料來源。
3. **User Stories**
   - 以條列方式列出本頁面支援的主要使用情境（例如：「身為會員，我可以看到點數總覽…」）。
4. **Acceptance Criteria（AC）**
   - 以條列方式說明 UI / UX / 功能驗收條件。
5. **檔名 / 落點確認**
   - 確認：
     - 頁面檔案：`src/pages/(<feature>)/<FigmaName>.tsx`
     - 預期共用元件路徑（如：`src/features/<feature>/components/...`）。
6. **視覺回歸測試範圍建議（只針對 Playwright 視覺測試）**
   - 說明：
     - 哪些狀態（例如：空狀態 / 一般狀態 / 錯誤狀態 / 重要互動後畫面）需要被視覺回歸測試覆蓋。
     - 哪些區塊是視覺上最關鍵、需要透過截圖比對確保排版與樣式穩定。

> 注意：這裡只需規劃 **視覺回歸測試** 的狀態與畫面，不需要提單元測試或 E2E 測試。

---

## 6. 第二步：Figma MCP → React 18 + AntD 頁面

在 Spec Workflow MCP 輸出規格後，再使用 **Figma MCP** 讀取目前選取的 Frame，並根據規格產出頁面元件：

- 檔案位置：`src/pages/(<feature>)/<FigmaName>.tsx`
- 完整匯入：
  - 所需的 AntD 元件
  - 推測存在的專案共用 Layout / Sidebar / UI Components（以註解提醒實際名稱需對應專案）
- 嚴格遵守前述：
  - AntD 優先使用原則
  - Design tokens 使用規範
  - 禁止 inline style。

---

## 7. 第三步：Playwright MCP → 視覺回歸測試

最後，請呼叫 **Playwright MCP** 為 `src/pages/(<feature>)/<FigmaName>.tsx` 建立 **視覺回歸測試**：

- 建議測試檔路徑：
  - `src/features/<feature>/tests/visual/<FigmaName>.spec.ts`
  - 或專案既有視覺測試路徑結構。
- `viewport` 設定：
  - 使用「目前選取 Figma Frame 的寬 / 高」作為 `page.setViewportSize`。
- 測試內容（只做視覺回歸）：
  - 至少一個基本用例：載入頁面路由 → 等待關鍵區塊渲染完成 → 截圖 → 與 baseline 比對。
  - 若 Spec 中有定義多種重要狀態（空/正常/錯誤等），可依 Spec 擴充多個視覺測試用例。
- Baseline 策略：
  - 第一次執行建立 baseline 圖片。
  - 之後若有 diff：
    - 若為預期變更：說明更新 baseline 的建議流程。
    - 若為非預期：提供排查建議（檢查 design tokens、AntD 主題、Tailwind class 變更、資料差異等）。
- 不需要在此檔案中撰寫任何非視覺性的斷言（例如檢查文字內容、事件行為等），重點只在畫面呈現是否與設計一致。

---

## 8. 最後附上：版面切分與命名建議（台灣繁體中文）

在整個流程完成後，請在回覆最後追加一段「版面切分與命名建議」，內容包括：

1. **元件切分建議**
   - 哪些區塊適合抽成獨立元件（例如：`<FilterBar />`, `<SummaryCard />`, `<ItemList />` 等）。
   - 這些元件建議放置的目錄（例如：`src/features/<feature>/components/`）。
   - 若推斷專案已有類似元件，請明確提示「建議優先重用 XXX 元件」。
2. **命名原則**
   - 元件名稱以用途命名，而非純外觀命名（例如：`MemberOverviewCard` 而不是 `BlueBoxCard`）。
   - className 儘量對應語義化 token（避免硬寫顏色 / spacing / radius 的魔法數字）。
3. **嚴格提醒**
   - 所有版面與樣式實作必須透過：
     - design tokens
     - AntD 元件
     - Tailwind utilities
   - 不得出現 inline style。