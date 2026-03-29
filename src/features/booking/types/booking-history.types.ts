/**
 * Booking History Types
 *
 * 定義預訂歷史記錄功能的核心資料結構
 */

/**
 * 預訂執行狀態列舉
 */
export type BookingHistoryStatus = 'pending' | 'running' | 'paused' | 'terminated';

/**
 * 時間重疊狀態
 */
export type OverlapStatus = 'allowed' | 'not-allowed';

/**
 * 預訂歷史記錄
 *
 * 完整的預訂記錄資料結構，包含所有展示欄位
 */
export interface BookingHistoryRecord {
  /** 唯一識別碼 */
  id: string;

  /** 預訂編號（例如：#20250810001） */
  bookingId: string;

  /** 節點 IP 位址（例如：10.0.1.11） */
  node: string;

  /** 映像檔名稱（例如：worker-jobs, app-backend） */
  image: string;

  /** 群組名稱（例如：analytics） */
  group: string;

  /** 帳號名稱（例如：Robert0808） */
  account: string;

  /** 開始時間（ISO 8601 格式） */
  startTime: string;

  /** 結束時間（ISO 8601 格式） */
  endTime: string;

  /** 重疊狀態 */
  overlapStatus: OverlapStatus;

  /** 執行狀態 */
  status: BookingHistoryStatus;
}

/**
 * 預訂歷史篩選參數
 *
 * 用於 API 請求的篩選條件（對齊後端 BookingHistoryQuery）
 */
export interface BookingHistoryFilterParams {
  /** 開始時間（ISO 8601 格式） */
  start_time: string;

  /** 結束時間（ISO 8601 格式） */
  end_time: string;

  /** 映像檔 ID 篩選（可選） */
  image_id?: string;

  /** 使用者 ID 篩選（可選） */
  user_id?: string;

  /** 分頁偏移量（可選） */
  offset?: number;

  /** 每頁數量（可選） */
  limit?: number;
}

/**
 * 預訂歷史 API 回應
 *
 * 分頁資料回應結構
 */
export interface BookingHistoryResponse {
  /** 預訂記錄列表 */
  records: BookingHistoryRecord[];

  /** 總記錄數 */
  total: number;

  /** 當前頁碼 */
  page: number;

  /** 每頁顯示數量 */
  pageSize: number;

  /** 總頁數 */
  totalPages: number;
}

/**
 * 下拉選單選項
 */
export interface SelectOption {
  /** 選項值 */
  value: string;

  /** 選項標籤 */
  label: string;
}
