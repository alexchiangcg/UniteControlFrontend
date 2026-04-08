/**
 * Booking History Types
 *
 * 定義預訂歷史記錄功能的核心資料結構（對齊後端 API 回應）
 */

/**
 * 預訂執行狀態
 */
export type BookingHistoryStatus = 'Pending' | 'Running' | 'Terminated';

/**
 * 預訂歷史記錄（對齊後端回傳欄位）
 */
export interface BookingHistoryRecord {
  /** 預約 ID */
  booking_id: string;

  /** 開始時間 */
  start: string;

  /** 結束時間 */
  end: string;

  /** 使用者 ID */
  user_id: string;

  /** 映像檔名稱 */
  image: string;

  /** 執行狀態 */
  status: BookingHistoryStatus;
}

/**
 * 預訂歷史篩選參數（對齊後端 BookingHistoryQuery）
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
 * 預訂歷史 API 回應（對齊後端回傳結構）
 */
export interface BookingHistoryResponse {
  booking_histories: BookingHistoryRecord[];
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
