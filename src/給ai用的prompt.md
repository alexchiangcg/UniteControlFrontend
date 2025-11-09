任務總覽（請嚴格執行）：
1. 直接新增或修改三個檔案：
   - src/components/Sidebar.tsx
   - src/layouts/SidebarLayout.tsx
   - src/samples/Frame.tsx
2. Frame.tsx 要**直接由目前 Figma MCP 選取的 Frame** 轉換成 React + TypeScript 元件（使用 MCP context 中的 layer 資訊）。
3. 只使用單一斷點 md（768px）：<768 為 mobile（drawer），>=768 為 desktop（固定側欄）。
4. 技術棧：React + TypeScript (.tsx)、Tailwind CSS v3.4.15、Ant Design v5.22.2。
5. 嚴格禁止出現 inline styles (`style=`)、禁止 CSS-in-JS、禁止 `<style>` 內嵌 CSS。若某處無法用 Tailwind 表示，請在該處加入註解 `/* TODO: replace with Tailwind utilities */`，不要使用 inline style。

輸出格式（Copilot 的回傳必須符合）：
- 回傳三個檔案的完整內容。每個檔案最上方一行必須標明檔名，例如：
  檔名：src/components/Sidebar.tsx
  <完整檔案內容...>
  檔名：src/layouts/SidebarLayout.tsx
  <完整檔案內容...>
  檔名：src/samples/Frame.tsx
  <完整檔案內容...>
- 檔案內容需可直接複製貼入專案（假設 Tailwind 與 Antd 已安裝與全域引入 CSS）。

共同規範（對三個檔案同時適用）：
- 使用語意化 HTML（aside, nav, main, header, section, ul/li, h1.. 等）。
- Accessibility：互動元素需有 aria-label、aria-current（當前項目）、keyboard 支援（tab + Enter/Space 可觸發）。
- 圖片用占位 `<img src={...} alt="..." className="w-full h-auto object-cover" />`（若 Figma 提供 image url，使用該 url）。
- SVG icon 可用小型 inline React SVG component，但 SVG 本身不得含 `style` 屬性，只能用屬性與 className。
- 如果使用 Antd 組件（Button, Badge, Avatar, Menu, Drawer 等），可以 import 使用，但**不得**使用 `style` prop；樣式用 Tailwind className 或 Antd props。

檔案 A — Sidebar（必須獨立、可重用）
- 檔名：src/components/Sidebar.tsx
- 要求：
  - Export 型別：`export interface SidebarItem { id: string; label: string; icon?: React.ReactNode; href?: string; badge?: number | string; disabled?: boolean }`
  - Default export `export default function Sidebar(props: SidebarProps): JSX.Element`
  - Props：
    - `items: SidebarItem[]`（必填）
    - `collapsed?: boolean`（受控）
    - `defaultCollapsed?: boolean`（非受控初始）
    - `onSelect?: (id: string) => void`
    - `defaultWidth?: string`（Tailwind-friendly，例如 "w-64"）
    - `className?: string`
  - 功能：
    - 支援受控與非受控折疊（collapsed/defaultCollapsed）。
    - 折疊時顯示窄寬（例如 `w-20` 或 `w-16`），展開時使用 `defaultWidth`。
    - 使用 `<aside aria-label="Sidebar" role="navigation">` 與 `<ul><li>` 結構或 Antd Menu（若選 Antd Menu，不可用 style prop），每個項目是 button-like，可 Tab focus，Enter/Space 觸發 onSelect。
    - 當前項目使用 `aria-current="page"`，並以 Tailwind className 顯示 active 樣式。
    - 提供折疊切換按鈕（有 aria-label），按鈕可用 Antd `<Button>` 或原生 `<button>`（同樣不可用 style prop）。
    - 若需要小型 icon helper，可在檔案內部定義簡易 inline SVG component。
  - 文件：檔案頂端包含 JSDoc / TypeScript 註解說明使用方式。

檔案 B — SidebarLayout（使用 Sidebar）
- 檔名：src/layouts/SidebarLayout.tsx
- 要求：
  - `import Sidebar from 'src/components/Sidebar'`
  - 展示 desktop vs mobile 行為：
    - Desktop (>= md)：顯示 Sidebar（固定在左），主內容區在大於等於 md 時需有左側填充以容納 sidebar（例如 `md:pl-64`，或根據 Sidebar 的 defaultWidth 調整）。
    - Mobile (< md)：header 顯示 menu 按鈕，按下後打開一個 drawer（固定寬度，例如 `w-64`），drawer 內放 Sidebar；選單選取後自動關閉 drawer。
  - 提供範例 `sidebarItems: SidebarItem[]`（至少 4 項）並示範 `onSelect` 行為（範例可用 console.log）。
  - 主內容使用 `<main>`，並示範幾個區塊（card/section）作為範例內容（使用 Tailwind class 與 Antd 組合，不使用 inline style）。

檔案 C — Frame（由 Figma MCP 選取的 Frame 直接轉換）
- 檔名：src/samples/Frame.tsx
- 要求：
  - **必須**使用 MCP context 讀取「目前選取的 Frame」並把該 Frame 轉換為 React + TypeScript 單檔元件（含 imports、export default component）。
  - 層級 mapping 規則（嚴格遵守）：
    - Frame → 外層 container（section/main），保持流體寬度（`w-full`）；不要在元件內固定 viewport。
    - Auto Layout / Group → flex / grid 對應 Tailwind（flex / flex-col / items-center / gap-x-4 / gap-y-2 / grid grid-cols-...）。
    - Text → 對應語意化標籤：h1/h2/h3/p/span。使用 Tailwind 的字級與間距 class。
    - Images → `<img src={frameImageUrl ?? 'https://via.placeholder.com/800x600'} alt="..." className="w-full h-auto object-cover" />`
    - Buttons → 若為互動型，使用 Antd `<Button className="..." />`（勿用 style prop）；純裝飾可用 `<button>` 並加 aria。
    - Lists → `<ul className="space-y-2">` 與 `<li>`，若為卡片集合可用 `grid grid-cols-... gap-...`。
  - Frame 元件需示範與 SidebarLayout 或 Sidebar 的整合方式（例如 `import SidebarLayout from 'src/layouts/SidebarLayout'` 並把轉換內容放進 layout main 區）。如果 Frame 設計包含側邊欄區塊，請使用剛剛獨立的 Sidebar component。
  - 響應處理只需針對 md（768px）：確保在 `<768` 會以行動版（header + drawer / 堆疊）顯示，`>=768` 顯示桌面版（側欄 + 主內容）。
  - 在檔案尾端以註解形式附上「md 斷點的主要 Tailwind class 建議」，列出 container / header / main / sidebar 的 class 範例（可直接複製到 className）。

其他注意事項（嚴格）：
- 不要輸出任何 build 設定、tailwind.config、或安裝步驟；只建立三個檔案的完整內容。
- 檔案內禁止任何 inline style；出現無法用 Tailwind 表達的情況，放 `/* TODO: replace with Tailwind utilities */` 註解。
- 請確保所有匯入路徑使用相對或絕對專案路徑（示例使用 'src/components/Sidebar' 與 'src/layouts/SidebarLayout'）。
