/**
 * BookingHistory 視覺回歸測試
 *
 * 使用 Playwright 進行視覺回歸測試，確保頁面呈現與 Figma 設計一致
 *
 * 安裝要求：
 * ```bash
 * pnpm add -D @playwright/test
 * pnpm exec playwright install
 * ```
 *
 * 執行測試：
 * ```bash
 * pnpm exec playwright test src/features/booking/tests/visual/BookingHistory.spec.ts
 * ```
 *
 * 更新 baseline（當設計變更且確認正確時）：
 * ```bash
 * pnpm exec playwright test src/features/booking/tests/visual/BookingHistory.spec.ts --update-snapshots
 * ```
 */

import { test, expect } from '@playwright/test';

/**
 * Viewport 設定：依照 Figma Frame 尺寸 (booking-history: 1512x1003)
 */
const VIEWPORT_WIDTH = 1512;
const VIEWPORT_HEIGHT = 1003;

/**
 * 頁面路由
 */
const PAGE_URL = '/booking/history';

/**
 * 測試前置設定
 */
test.beforeEach(async ({ page }) => {
  // 設定 viewport 為 Figma Frame 尺寸
  await page.setViewportSize({
    width: VIEWPORT_WIDTH,
    height: VIEWPORT_HEIGHT,
  });

  // TODO: 如果需要認證，在此處理登入流程
  // await page.goto('/login');
  // await page.fill('[name="username"]', 'testuser');
  // await page.fill('[name="password"]', 'testpass');
  // await page.click('button[type="submit"]');

  // 導航至預訂歷史頁面
  await page.goto(PAGE_URL);
});

/**
 * 測試套件：BookingHistory 視覺回歸測試
 */
test.describe('BookingHistory Visual Regression Tests', () => {

  /**
   * 測試 1：一般狀態 - 顯示完整預訂記錄列表
   *
   * 此測試確保頁面在載入預訂記錄後的呈現與設計一致：
   * - 表格標題列與資料列的對齊與間距
   * - 狀態標籤（Status、Overlap）的顏色與樣式
   * - 篩選列的佈局與元件對齊
   * - 分頁控制器的位置與樣式
   * - Detail 按鈕的樣式與 icon 呈現
   */
  test('should match baseline - normal state with booking records', async ({ page }) => {
    // 等待表格載入完成（等待 Table 元件渲染）
    await page.waitForSelector('.ant-table-wrapper', { timeout: 5000 });

    // 等待表格資料載入（至少有一筆資料）
    await page.waitForSelector('.ant-table-tbody tr', { timeout: 5000 });

    // 等待所有圖片和樣式載入完成
    await page.waitForLoadState('networkidle');

    // 額外等待 500ms 確保動畫完成
    await page.waitForTimeout(500);

    // 視覺回歸測試：與 baseline 比對
    await expect(page).toHaveScreenshot('booking-history-normal-state.png', {
      fullPage: true,
      // 允許微小的像素差異（防止字體渲染差異導致誤報）
      maxDiffPixelRatio: 0.01,
    });
  });

  /**
   * 測試 2：空狀態 - 無預訂記錄
   *
   * 此測試確保空狀態的 Empty 元件呈現正確
   */
  test('should match baseline - empty state with no records', async ({ page }) => {
    // 模擬空資料狀態（需要 Mock API 或測試環境支援）
    // TODO: 使用 MSW 或 Playwright route interception 來模擬空資料回應
    // await page.route('**/api/booking/history**', (route) => {
    //   route.fulfill({
    //     status: 200,
    //     contentType: 'application/json',
    //     body: JSON.stringify({
    //       records: [],
    //       total: 0,
    //       page: 1,
    //       pageSize: 10,
    //       totalPages: 0,
    //     }),
    //   });
    // });

    // 重新載入頁面以觸發 Mock API
    // await page.reload();

    // 等待 Empty 元件顯示
    await page.waitForSelector('.ant-empty', { timeout: 5000 });

    // 等待所有樣式載入完成
    await page.waitForLoadState('networkidle');

    // 視覺回歸測試：與 baseline 比對
    await expect(page).toHaveScreenshot('booking-history-empty-state.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  /**
   * 測試 3：載入狀態 - Skeleton 呈現
   *
   * 此測試確保載入狀態的 Skeleton 或 Spin 元件呈現正確
   */
  test('should match baseline - loading state with skeleton', async ({ page }) => {
    // 攔截 API 請求，延遲回應以捕捉載入狀態
    await page.route('**/api/booking/history**', async (route) => {
      // 延遲 2 秒回應
      await new Promise((resolve) => setTimeout(resolve, 2000));
      route.continue();
    });

    // 重新載入頁面
    await page.reload();

    // 等待載入指示器出現（Ant Design Table 的 loading 狀態）
    await page.waitForSelector('.ant-spin', { timeout: 1000 });

    // 立即截圖（捕捉載入狀態）
    await expect(page).toHaveScreenshot('booking-history-loading-state.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  /**
   * 測試 4：篩選狀態 - 應用篩選條件後的呈現
   *
   * 此測試確保篩選條件應用後的頁面呈現正確
   */
  test('should match baseline - filtered state', async ({ page }) => {
    // 等待頁面載入完成
    await page.waitForSelector('.ant-table-wrapper', { timeout: 5000 });

    // 選擇節點篩選
    await page.click('.ant-select:has-text("選擇節點")');
    await page.click('.ant-select-item:has-text("10.0.1.11")');

    // 選擇狀態篩選
    await page.click('.ant-select:has-text("選擇狀態")');
    await page.click('.ant-select-item:has-text("Running")');

    // 等待篩選結果更新
    await page.waitForTimeout(1000);

    // 等待網路請求完成
    await page.waitForLoadState('networkidle');

    // 視覺回歸測試：與 baseline 比對
    await expect(page).toHaveScreenshot('booking-history-filtered-state.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  /**
   * 測試 5：分頁狀態 - 不同頁碼的呈現
   *
   * 此測試確保分頁元件在不同頁碼的呈現正確
   */
  test('should match baseline - pagination state on page 2', async ({ page }) => {
    // 等待頁面載入完成
    await page.waitForSelector('.ant-table-wrapper', { timeout: 5000 });

    // 等待分頁元件出現
    await page.waitForSelector('.ant-pagination', { timeout: 5000 });

    // 點擊第 2 頁
    await page.click('.ant-pagination-item[title="2"]');

    // 等待頁面切換完成
    await page.waitForTimeout(1000);

    // 等待網路請求完成
    await page.waitForLoadState('networkidle');

    // 視覺回歸測試：與 baseline 比對
    await expect(page).toHaveScreenshot('booking-history-page-2-state.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  /**
   * 測試 6：關鍵 UI 元件獨立測試 - 狀態標籤區域
   *
   * 此測試聚焦於關鍵視覺元素（狀態標籤）的呈現
   */
  test('should match baseline - status tags visual consistency', async ({ page }) => {
    // 等待表格載入完成
    await page.waitForSelector('.ant-table-wrapper', { timeout: 5000 });
    await page.waitForSelector('.ant-table-tbody tr', { timeout: 5000 });

    // 等待所有樣式載入完成
    await page.waitForLoadState('networkidle');

    // 只截取表格的狀態欄位部分（聚焦測試）
    const statusColumn = page.locator('.ant-table-thead th:has-text("Status")');
    await expect(statusColumn).toBeVisible();

    // 截取整個表格區域（包含標題列與資料列的狀態標籤）
    const table = page.locator('.ant-table-wrapper');
    await expect(table).toHaveScreenshot('booking-history-status-tags.png', {
      maxDiffPixelRatio: 0.01,
    });
  });
});

/**
 * 視覺回歸測試策略說明：
 *
 * 1. Baseline 建立：
 *    - 第一次執行測試會建立 baseline 圖片（儲存於 __screenshots__ 目錄）
 *    - 確保第一次執行時頁面呈現與 Figma 設計完全一致
 *
 * 2. 差異處理：
 *    - 若測試失敗（有視覺差異），會產生 diff 圖片
 *    - 檢查 diff 圖片確認差異是否為：
 *      a) 預期的設計變更 → 執行 --update-snapshots 更新 baseline
 *      b) 非預期的 bug → 修復程式碼後重新測試
 *
 * 3. CI/CD 整合：
 *    - 在 CI pipeline 中執行測試，確保每次部署前視覺一致性
 *    - 建議使用 Docker 容器執行測試，確保跨環境的字體與渲染一致性
 *
 * 4. 維護建議：
 *    - 當 Figma 設計更新時，同步更新 baseline
 *    - 當 Design Tokens 變更時，重新驗證所有視覺測試
 *    - 定期檢視測試覆蓋率，補充遺漏的視覺狀態
 */
