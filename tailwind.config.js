module.exports = {
  content: [
    "./index.html", // 掃描根目錄下的 HTML
    "./src/**/*.{js,ts,jsx,tsx}", // 掃描 src 資料夾內的 React 文件
  ],
  theme: {
    extend: {
      /* ==================== 顏色系統 / Colors ==================== */
      colors: {
        /* 主要灰階色 / Primary Gray Scale */
        gray: {
          500: "#2e2e2e", // 主要深灰 / color.primary-gray-500 / 用於深色文字與重要元素
          400: "#6b7280", // 次要深灰 / color.primary-gray-400 / 用於次要文字
          300: "#b2b7c0", // 中灰 / color.primary-gray-300 / 用於輔助文字
          200: "#ced4da", // 淺灰 / color.primary-gray-200 / 用於邊框與分隔線
          100: "#f5f7f9", // 極淺灰背景 / color.primary-gray-100 / 用於背景色
        },

        /* 主要藍色系 / Primary Blue Scale */
        blue: {
          600: "#204f74", // 主藍最深 / color.primary-blue-600 / 用於 hover 與強調狀態
          500: "#265d88", // 主藍深 / color.primary-blue-500 / 用於主要按鈕與連結
          400: "#2f6f9f", // 主藍標準 / color.primary-blue-400 / 用於品牌主色
          300: "#7fa9cb", // 主藍中淺 / color.primary-blue-300 / 用於次要元素
          200: "#afcbe1", // 主藍淺 / color.primary-blue-200 / 用於輔助背景
          100: "#d8e7f2", // 主藍極淺 / color.primary-blue-100 / 用於淺色背景
          50: "#f3f8fb", // 主藍背景色 / color.primary-blue-50 / 用於極淺背景
        },

        /* 次要藍色 / Secondary Blue */
        "second-blue": {
          400: "#5a7684", // 次要藍色 / color.second-blue-400 / 用於輔助功能與次要品牌色
        },

        /* 狀態顏色 / Status Colors */
        success: {
          DEFAULT: "#3fa796", // 成功狀態 / color.success / 用於成功訊息與確認操作
          light: "#e0f4ef", // 成功淺色 / color.success-light / 用於成功背景
        },
        warning: {
          DEFAULT: "#f6c344", // 警告狀態 / color.warning / 用於警告訊息
          light: "#fff6da", // 警告淺色 / color.warning-light / 用於警告背景
        },
        notice: {
          DEFAULT: "#f4a259", // 提醒狀態 / color.notice / 用於提醒訊息
          light: "#fff1e5", // 提醒淺色 / color.notice-light / 用於提醒背景
        },
        error: {
          DEFAULT: "#e85d75", // 錯誤狀態 / color.error / 用於錯誤訊息與刪除操作
          light: "#fde7eb", // 錯誤淺色 / color.error-light / 用於錯誤背景
        },
      },

      /* ==================== 字體系統 / Typography ==================== */
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "-apple-system", "sans-serif"], // 主要內文字體 / font.sans / 用於一般文字
        heading: ["var(--font-heading)", "Inter", "system-ui", "-apple-system", "sans-serif"], // 標題字體 / font.heading / 用於標題
      },

      fontSize: {
        /* Regular 字重尺寸 */
        "3xl": ["38px", { lineHeight: "38px" }], // 超大文字 / text.regular.3xl / 用於主要大標題
        "2xl": ["30px", { lineHeight: "30px" }], // 特大文字 / text.regular.2xl / 用於次要大標題
        xl: ["24px", { lineHeight: "24px" }], // 大文字 / text.regular.xl / 用於標題
        lg: ["20px", { lineHeight: "20px" }], // 較大文字 / text.regular.lg / 用於副標題
        md: ["18px", { lineHeight: "18px" }], // 中等文字 / text.regular.md / 用於強調內文
        sm: ["16px", { lineHeight: "16px" }], // 小文字 / text.regular.sm / 用於標準內文
        xs: ["14px", { lineHeight: "14px" }], // 極小文字 / text.regular.xs / 用於輔助文字
        xxs: ["12px", { lineHeight: "12px" }], // 最小文字 / text.regular.xxs / 用於註解與說明
      },

      fontWeight: {
        normal: 400, // 一般字重 / font.weight.normal / 用於一般內文
        medium: 500, // 中等字重 / font.weight.medium / 用於次要強調
        bold: 700, // 粗體字重 / font.weight.bold / 用於標題與強調
        black: 900, // 超粗字重 / font.weight.black / 用於特殊強調
      },
    },
  },
  plugins: [],
}
