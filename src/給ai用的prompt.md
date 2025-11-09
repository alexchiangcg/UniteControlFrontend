任務摘要（優先順序）：
1) 先產生 Sidebar 子元件（可獨立使用、Props 驗證、Tailwind 控制寬度與折疊）。  
2) 接著產生整個 Frame 元件，並在 Frame 中使用剛剛的 Sidebar。  
3) 最後附上以 Tailwind class 表達的響應式建議（包含專門為 Sidebar 的建議）。
4) router 也要補上。

輸出要求（嚴格）：
- 檔名：舉例最上方一行標示：`檔名：src/samples/Frame.tsx`，之後回傳完整檔案內容（整個 .tsx 檔可直接複製）。  
- 技術棧：React + TypeScript (.tsx)、Tailwind CSS v3.4.15、Ant Design v5.22.2。  
- 不允許任何 inline-style（不得出現 `style=` 或 CSS-in-JS）。所有樣式請用 `className` 與 Tailwind utilities，或使用 Antd 組件的 props（但不可使用 style prop）。  
- 組件必須使用語意化 HTML（header, nav, main, aside, section, footer, h1.. 等）。  
- Accessibility：為互動元素加入 aria 屬性（aria-label、role 等）；圖片提供 alt；Sidebar 的 button/controls 要有可及性標記。  
- 圖片用占位 `<img src="PLACEHOLDER_IMAGE" alt="描述" className="..." />`（可填 Figma 影像 url 或 placeholder）。SVG icon 可用小型 inline SVG React component，但 SVG 本身不得用 style 屬性，只用 className/屬性。

Sidebar 規格（必須實作）：
- 必須先回傳 Sidebar 子元件（在同一檔案頂端），命名為 `Sidebar`（或 `FrameSidebar`）。Sidebar 必須：
  - 接受 props：`items: SidebarItem[]`（每項含 id, label, icon?, href?、badge?）、`collapsed?: boolean`、`onSelect?: (id:string)=>void`、`defaultWidth?: string`（Tailwind-friendly，例如 "w-64" 或 "w-56"）；
  - 支援折疊（collapsed）狀態：折疊時只顯示 icon、擴展時顯示 label；以 className 切換寬度與顯示內容（不要用 inline style）；
  - 使用語意化 `<aside aria-label="Sidebar">` 與合適的 role（如 role="navigation"）；項目用 `<ul><li>` 結構或 Antd Menu，但若用 Antd Menu，仍用 className 控制外觀並保持無 style prop；
  - 提供 keyboard 可操作性（tab focus、enter/space 觸發 onSelect）與 aria-current 標記當前項目；
  - 在元件頂端附上 JSDoc/TS types interface，並 export 相關型別（interface SidebarItem {...}）。

檔案結構要求（單一檔案）：
- imports：`React`, `useState` 等、`Button, Menu, Avatar, Badge` 等來自 antd（視需引入）、必要的 icon small components（若需要，簡易 inline SVG component）。
- 在檔案最前面先定義 `Sidebar` (含 types & small helper)，接著定義主元件 `export default function FrameSample(): JSX.Element { ... }`，FrameSample 中使用 `Sidebar`。
- Container：外層用 `className="w-full mx-auto"` 與可選 `max-w-*`；不要在元件內硬編固定 px 寬度，允許外層 /frame 控制總寬度。
- Mapping 規則（Figma layer → React）請遵守（group→flex/grid、text→h/p/span、buttons→Antd Button、inputs→Antd Input、lists→ul/li or Card grid）。

錯誤處理與 TODO：
- 若某些像素精準樣式無法純 Tailwind 表達，請加註 `/* TODO: replace with Tailwind utilities */` 在對應位置，不要加入 style 屬性或內嵌 CSS。
- 檔案末尾必須包含：1) Frame 的 1 組響應式建議 768px，2) 專門為 Sidebar 的 1 組響應式 class 建議（以 Tailwind class 表達），格式清楚可直接貼到 className。

輸出範例風格（示範性文字，**不要**把這段放入檔案）：
- 產出 `檔名：src/samples/Frame.tsx` 然後檔案內容開始。檔案內先是 `Sidebar` component 定義（含 types），接著是 `FrameSample`，最後為響應式建議註解塊（以 `//` 或 `/* */` 標注）。

現在開始：直接讀取目前 Figma MCP 選取的 Frame（MCP context），**先**輸出 Sidebar 子元件（在同一檔案頂端），再輸出整個 Frame 元件，最後附上三組響應式建議（並額外列出 Sidebar 的建議）。整個輸出必須為完整可複製的 `src/samples/Frame.tsx` 檔案內容。謝謝。
