# BookingHistory 視覺回歸測試場景定義

本文件定義 BookingHistory 頁面的視覺回歸測試場景，使用 **Playwright MCP 工具**進行測試。

## 前置設定

### Viewport 尺寸
- 寬度：1512px
- 高度：1003px
- 依據 Figma Frame (booking-history) 尺寸設定

### 測試頁面路由
- URL: `http://localhost:5173/booking/history`
- 需要確保開發伺服器正在運行

### 認證要求
- 如果頁面需要認證，請先完成登入流程
- TODO: 待確認認證機制後補充登入步驟

---

## 測試場景 1：一般狀態 - 顯示完整預訂記錄列表

### 測試目標
確保頁面在載入預訂記錄後的呈現與 Figma 設計一致

### 測試步驟

1. **設定 Viewport**
   ```
   使用 MCP 工具：browser_resize
   參數：width=1512, height=1003
   ```

2. **導航至頁面**
   ```
   使用 MCP 工具：browser_navigate
   參數：url="http://localhost:5173/booking/history"
   ```

3. **等待頁面載入**
   ```
   使用 MCP 工具：browser_wait_for
   等待條件：表格資料載入完成（至少有一筆預訂記錄顯示）
   ```

4. **截圖比對**
   ```
   使用 MCP 工具：browser_take_screenshot
   參數：
     - filename: "booking-history-normal-state.png"
     - fullPage: true
   ```

### 預期結果
- 表格標題列與資料列的對齊與間距正確
- 狀態標籤（Status、Overlap）的顏色與樣式符合設計
- 篩選列的佈局與元件對齊正確
- 分頁控制器的位置與樣式正確
- Detail 按鈕的樣式與 icon 呈現正確

### Baseline 管理
- 首次執行時建立 baseline 圖片
- 後續執行時與 baseline 比對
- 如有差異，手動檢視是否為預期的設計變更

---

## 測試場景 2：空狀態 - 無預訂記錄

### 測試目標
確保空狀態的 Empty 元件呈現正確

### 測試步驟

1. **設定 Viewport**
   ```
   使用 MCP 工具：browser_resize
   參數：width=1512, height=1003
   ```

2. **導航至頁面**
   ```
   使用 MCP 工具：browser_navigate
   參數：url="http://localhost:5173/booking/history"
   ```

3. **模擬空資料狀態**
   - TODO: 需要使用 Mock Service Worker (MSW) 或 API 攔截工具
   - 模擬 API 回傳空陣列：`{ records: [], total: 0, page: 1, pageSize: 10, totalPages: 0 }`

4. **等待 Empty 元件顯示**
   ```
   使用 MCP 工具：browser_wait_for
   等待條件：Empty 元件出現（"暫無預訂記錄"文字可見）
   ```

5. **截圖比對**
   ```
   使用 MCP 工具：browser_take_screenshot
   參數：
     - filename: "booking-history-empty-state.png"
     - fullPage: true
   ```

### 預期結果
- Empty 元件正確顯示
- Empty 圖示與文字樣式符合設計
- 頁面整體佈局不崩潰

---

## 測試場景 3：載入狀態 - Skeleton 呈現

### 測試目標
確保載入狀態的 Skeleton 或 Spin 元件呈現正確

### 測試步驟

1. **設定 Viewport**
   ```
   使用 MCP 工具：browser_resize
   參數：width=1512, height=1003
   ```

2. **導航至頁面**
   ```
   使用 MCP 工具：browser_navigate
   參數：url="http://localhost:5173/booking/history"
   ```

3. **快速截圖（捕捉載入狀態）**
   - 需要在頁面載入的瞬間截圖
   - TODO: 可能需要使用 API 延遲模擬工具來延長載入時間
   ```
   使用 MCP 工具：browser_take_screenshot
   參數：
     - filename: "booking-history-loading-state.png"
     - fullPage: true
   執行時機：在資料載入完成前立即執行
   ```

### 預期結果
- Ant Design Table 的 loading 狀態（Spin）正確顯示
- Skeleton 或 loading indicator 位置正確
- 頁面不閃爍或跳動

### 注意事項
- 此測試可能需要網路節流或 API 延遲模擬
- 建議使用開發工具的網路節流功能

---

## 測試場景 4：篩選狀態 - 應用篩選條件後的呈現

### 測試目標
確保篩選條件應用後的頁面呈現正確

### 測試步驟

1. **設定 Viewport**
   ```
   使用 MCP 工具：browser_resize
   參數：width=1512, height=1003
   ```

2. **導航至頁面**
   ```
   使用 MCP 工具：browser_navigate
   參數：url="http://localhost:5173/booking/history"
   ```

3. **等待頁面載入**
   ```
   使用 MCP 工具：browser_wait_for
   等待條件：表格資料載入完成
   ```

4. **應用篩選條件**
   ```
   使用 MCP 工具：browser_click
   步驟 1：點擊節點下拉選單
   步驟 2：選擇 "10.0.1.11"
   步驟 3：點擊狀態下拉選單
   步驟 4：選擇 "Running"
   ```

5. **等待篩選結果更新**
   ```
   使用 MCP 工具：browser_wait_for
   等待條件：表格資料重新載入完成（時間: 1000ms）
   ```

6. **截圖比對**
   ```
   使用 MCP 工具：browser_take_screenshot
   參數：
     - filename: "booking-history-filtered-state.png"
     - fullPage: true
   ```

### 預期結果
- 篩選條件正確應用
- 選中的篩選項目正確高亮顯示
- 表格顯示符合篩選條件的記錄
- 分頁資訊正確更新

---

## 測試場景 5：分頁狀態 - 不同頁碼的呈現

### 測試目標
確保分頁元件在不同頁碼的呈現正確

### 測試步驟

1. **設定 Viewport**
   ```
   使用 MCP 工具：browser_resize
   參數：width=1512, height=1003
   ```

2. **導航至頁面**
   ```
   使用 MCP 工具：browser_navigate
   參數：url="http://localhost:5173/booking/history"
   ```

3. **等待頁面載入**
   ```
   使用 MCP 工具：browser_wait_for
   等待條件：表格與分頁元件載入完成
   ```

4. **點擊第 2 頁**
   ```
   使用 MCP 工具：browser_click
   目標元素：分頁按鈕 "2"
   ```

5. **等待頁面切換完成**
   ```
   使用 MCP 工具：browser_wait_for
   等待條件：表格資料重新載入完成（時間: 1000ms）
   ```

6. **截圖比對**
   ```
   使用 MCP 工具：browser_take_screenshot
   參數：
     - filename: "booking-history-page-2-state.png"
     - fullPage: true
   ```

### 預期結果
- 分頁按鈕高亮顯示正確（第 2 頁為 active 狀態）
- 表格顯示第 2 頁的資料
- 分頁資訊文字更新正確（例如："Showing 11-20 of 85"）

---

## 測試場景 6：關鍵 UI 元件獨立測試 - 狀態標籤區域

### 測試目標
確保關鍵視覺元素（狀態標籤）的呈現一致性

### 測試步驟

1. **設定 Viewport**
   ```
   使用 MCP 工具：browser_resize
   參數：width=1512, height=1003
   ```

2. **導航至頁面**
   ```
   使用 MCP 工具：browser_navigate
   參數：url="http://localhost:5173/booking/history"
   ```

3. **等待頁面載入**
   ```
   使用 MCP 工具：browser_wait_for
   等待條件：表格資料載入完成
   ```

4. **截圖（聚焦測試）**
   ```
   使用 MCP 工具：browser_take_screenshot
   參數：
     - filename: "booking-history-status-tags.png"
     - element: 表格區域（包含 Status 與 Overlap 欄位）
     - fullPage: false
   ```

### 預期結果
- 4 種執行狀態標籤視覺正確：
  - Pending: 橘色 + 沙漏圖示
  - Running: 藍色 + 播放圖示
  - Paused: 灰色 + 暫停圖示
  - Terminated: 灰色 + 停止圖示
- 2 種重疊狀態標籤視覺正確：
  - Allowed (No): 綠色 + 勾選圖示
  - Not Allowed: 紅色 + 關閉圖示
- Icon 與文字對齊正確
- 標籤間距一致

---

## 視覺回歸測試策略說明

### 1. Baseline 建立
- 第一次執行測試會建立 baseline 圖片（儲存於專案目錄）
- 確保第一次執行時頁面呈現與 Figma 設計完全一致
- Baseline 應納入版本控制（Git）

### 2. 差異處理流程
當測試失敗（有視覺差異）時：

**步驟 1：檢視差異**
- 使用 Playwright MCP 工具比對 baseline 與實際截圖
- 分析差異的原因

**步驟 2：判斷差異類型**
- **預期的設計變更**：執行更新 baseline 操作
- **非預期的 bug**：修復程式碼後重新測試

**步驟 3：更新 Baseline（如果是預期變更）**
- 替換舊的 baseline 圖片
- 提交 Git commit 記錄設計變更

### 3. CI/CD 整合建議
- 在 CI pipeline 中執行測試，確保每次部署前視覺一致性
- 使用 Docker 容器執行測試，確保跨環境的字體與渲染一致性
- 測試失敗時，自動產生差異報告並通知開發團隊

### 4. 維護建議
- **當 Figma 設計更新時**：同步更新 baseline
- **當 Design Tokens 變更時**：重新驗證所有視覺測試
- **定期檢視測試覆蓋率**：補充遺漏的視覺狀態
- **避免測試脆弱性**：使用適當的等待條件，避免時序問題

---

## 執行測試的指令範例

使用 Claude Code CLI 搭配 Playwright MCP 工具：

```bash
# 1. 啟動開發伺服器
pnpm run dev

# 2. 在 Claude Code 中執行視覺測試
# 例如：測試場景 1（一般狀態）
claude-code> 請使用 Playwright MCP 工具執行 BookingHistory 視覺測試場景 1

# 3. 檢視測試結果
# 截圖檔案會儲存在專案目錄中，可以手動檢視或比對
```

---

## 待完成事項（TODO）

1. **認證流程**：補充登入步驟（如果頁面需要認證）
2. **API Mock**：整合 MSW 或 API 攔截工具，模擬不同的資料狀態（空資料、載入延遲等）
3. **自動化腳本**：建立自動化測試腳本，整合 Playwright MCP 工具
4. **Baseline 管理**：建立 baseline 圖片的版本控制策略
5. **CI/CD 整合**：將視覺測試加入 CI pipeline

---

## 參考資料

- [Playwright MCP 工具文件](https://github.com/tmthecoder/mcp-playwright)
- [Figma 設計檔](https://figma.com/design/...) - TODO: 補充 Figma 連結
- [Requirements 文件](./.spec-workflow/specs/booking-history/requirements.md)
- [Design 文件](./.spec-workflow/specs/booking-history/design.md)
