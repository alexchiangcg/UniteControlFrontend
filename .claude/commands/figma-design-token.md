---
name: figma-design-token
description: 從 Figma Dev Mode 選取的 Frame 萃取設計 Tokens，並更新 Tailwind 3.4 的 src/styles/main.css 與 tailwind.config.js 設定。
---

# /figma-design-token — 萃取 Tokens 並直接改專案設定

> 從目前選取的設計萃取色票 / 字級 / 半徑 / 陰影 / Spacing，**自動分配到 `src/styles/main.css` 與 `tailwind.config.js` 中適合的位置**，並建立回歸計畫。

## 任務說明

請針對我在 Figma Dev Mode 中目前選取的 Frame，萃取設計 Tokens（**色票、字級、半徑、陰影、Spacing**），然後「直接修改」專案內這兩個檔案：

- src/styles/main.css
- tailwind.config.js

不要只在聊天視窗印出程式碼，而是實際覆寫 / 插入到上述檔案中（保留原有有用設定，必要時重構整理），並在回覆中貼出修改後的檔案內容。

---

## 1. Tailwind 版本與檔案分工

- 本專案使用 **Tailwind CSS 3.4**。
- 請依照 Token 性質，自行判斷「適合放哪裡」。

### 優先放在 `tailwind.config.js` 的項目（theme.extend）

這些會直接被 Tailwind utility 類名使用：

- 顏色：theme.extend.colors
- 間距 / Spacing：theme.extend.spacing
- 圓角 / Radius：theme.extend.borderRadius
- 陰影 / Shadow：theme.extend.boxShadow
- 字體家族 / Font Family：theme.extend.fontFamily
- 字級 / 行高：theme.extend.fontSize、theme.extend.lineHeight

### 放在 `src/styles/main.css` 的項目（@layer base + :root）

需要讓純 CSS 或第三方元件共用的 Token，請在 @layer base 裡，用 :root 宣告 CSS 變數：

- 顏色：--color-*
- 間距：--space-*
- 圓角：--radius-*
- 陰影：--shadow-*
- 字體：--font-*

### 同時需要兩邊都配合的 Token

若某個 Token 同時會被：

- Tailwind 類名用到，以及
- 原生 CSS / 第三方樣式用到

請同時：

1. 在 tailwind.config.js 建立對應 theme.extend 設定。
2. 在 src/styles/main.css 的 :root 建立對應 CSS 變數（兩邊數值需一致）。

---

## 2. `src/styles/main.css` 具體要求

1. 保留基本結構（若已存在就不要刪）：

    @tailwind base;
    @tailwind components;
    @tailwind utilities;

2. 在檔案中加入或更新下列區塊（若已存在 @layer base { :root { ... } }，請整合與重構，而不是重複新增）：

    @layer base {
      :root {
        /* 在這裡宣告所有設計用 CSS 變數 */
        /* 以下為範例，實際內容請依 Figma Tokens 替換 */

        --color-brand-500: #123456; /* 主品牌色 / color.brand/500 / #123456 */
        --space-4: 1rem; /* 內距 4 單位 / spacing/4 / 16px */
        --radius-5xl: 9999px; /* 藥丸角 / radius.pill / 9999px */
        --shadow-1: 0 1px 3px rgba(15, 23, 42, 0.08); /* 卡片陰影階層 1 / shadow.card/1 / ... */
        --font-sans: "Inter"; /* 主要內文字體 / font.sans / "Inter" */
        --font-heading: "Inter"; /* 標題字體 / font.heading / "Inter" */
      }
    }

3. 命名與註解規則（必須遵守）：

- 採語義化命名：
  - 顏色：--color-brand-500、--color-surface-100…
  - 半徑：--radius-lg、--radius-5xl…
  - 字體：--font-sans、--font-heading…
  - 間距：--space-4、--space-6…
  - 陰影：--shadow-1、--shadow-2…
- 每一條變數旁都要加上「台灣繁體中文註解」，內容包含：
  - 原 Figma 名稱
  - Figma Token 路徑 / 名稱
  - 實際數值

註解範例：

    --color-brand-500: #123456; /* 主品牌色 / color.brand/500 / #123456 */
    --radius-5xl: 9999px; /* 藥丸角 / radius.pill / 9999px */
    --space-4: 1rem; /* 內距 4 單位 / spacing/4 / 16px */

4. 如有需要共用的樣式模式（例如卡片陰影、主按鈕樣式），可以在 @layer utilities 中用 @apply 建立自訂類別：

    @layer utilities {
      .btn-primary {
        @apply bg-brand-500 text-white font-medium px-4 py-2 rounded-lg shadow-1;
      }
    }

- 這類 utilities 只能使用 Tailwind 類名與 @apply。
- 不得在這裡寫 inline style 或原生 style 屬性。

---

## 3. `tailwind.config.js` 具體要求

1. 保留原有 Tailwind 設定（content、plugins 等），只在 theme.extend 下新增 / 調整。
2. 依照 Token 類型，將設計 Token 映射到對應欄位，並使用台灣繁體中文註解。

結構範例（請整合進既有設定，而不是整個覆蓋）：

    // tailwind.config.js 範例結構
    module.exports = {
      content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {
          colors: {
            brand: {
              500: "#123456", // 主品牌色 / color.brand/500 / #123456
              600: "#0f2345", // 主品牌深色 / color.brand/600 / #0f2345
            },
            surface: {
              100: "#f5f5f5", // 淺背景色 / color.surface/100 / #f5f5f5
            },
          },
          spacing: {
            4: "1rem", // 內距 4 單位 / spacing/4 / 16px
            6: "1.5rem", // 內距 6 單位 / spacing/6 / 24px
          },
          borderRadius: {
            lg: "0.5rem", // 一般圓角 / radius/lg / 8px
            "5xl": "9999px", // 藥丸角 / radius/pill / 9999px
          },
          boxShadow: {
            1: "0 1px 3px rgba(15, 23, 42, 0.08)", // 卡片陰影階層 1 / shadow.card/1 / ...
            2: "0 4px 10px rgba(15, 23, 42, 0.12)", // 卡片陰影階層 2 / shadow.card/2 / ...
          },
          fontFamily: {
            sans: ["var(--font-sans)", "system-ui", "sans-serif"], // 主要內文字體 / font.sans / ...
            heading: ["var(--font-heading)", "system-ui", "sans-serif"], // 標題字體 / font.heading / ...
          },
          fontSize: {
            body: ["1rem", { lineHeight: "1.5rem" }], // 內文 / text.body / 16px
            caption: ["0.75rem", { lineHeight: "1rem" }], // 註解文字 / text.caption / 12px
            "heading-1": ["2rem", { lineHeight: "2.5rem" }], // H1 標題 / text.heading/1 / 32px
          },
        },
      },
      plugins: [],
    };

所有設定都要用台灣繁體中文註解說明：

- 這個 key 對應哪一個 Figma Token。
- 主要使用情境（例如：「主按鈕背景」、「卡片陰影」）。

---

## 4. 不得使用的寫法

- 嚴禁使用 inline style：
  - 不要新增 style="..." 或 :style="{ ... }"。
- 不要新增與 Tailwind 無關的自訂 build 流程。
- 只允許修改這兩個檔案：
  - src/styles/main.css
  - tailwind.config.js

---

## 5. Figma Tokens 不完整時的處理流程

若發現 Figma 尚未建立對應 Tokens / Variables，請先：

1. 在回覆中列出一份「需補齊清單」，每一項包含：
   - 建議 Token 名稱（例如：brand/primary/500）
   - 建議階層路徑（例如：color/brand/primary/500）
   - 建議值（例如：#123456 或 24px）
   - 建議用途說明（例如：「主按鈕背景」、「卡片外距」）

2. 清單列完後，先假設這些 Token 已在 Figma 建好，然後：
   - 在 src/styles/main.css 建立對應 CSS 變數。
   - 在 tailwind.config.js 建立對應 theme.extend 設定。

3. 註解中要明確標示這些是「目前 Figma 尚未正式建立的建議 Token」。

---

## 6. 回歸計畫（Regression Plan）

在修改完成後，請在回覆最後附上一段簡短文字說明「未來設計變更時，要如何回歸更新」，至少包含：

1. 若 Figma 更新色票 / 字級 / Spacing / Radius / Shadow：
   - 手動重新執行本指令的步驟說明。
2. 開發者如何快速比對：
   - src/styles/main.css 的 CSS 變數。
   - tailwind.config.js 的 theme.extend。
   是否有同步更新。
3. 建議的命名與維護原則：
   - 避免在元件內硬編數值。
   - 優先使用 token 對應的顏色 / spacing / radius / shadow / font 等設定。
