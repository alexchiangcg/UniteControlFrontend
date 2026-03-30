/**
 * Booking Calendar Domain Types
 * 
 * 定義 Booking Calendar 功能的核心資料結構
 * 包含 BookingTask domain model 與 Filter 相關型別
 */

/**
 * 預約狀態列舉
 */
export type BookingStatus = 'pending' | 'running' | 'completed' | 'overlap';

/**
 * 時間範圍選項
 */
export type TimeRangeOption = 'all' | 'today' | 'week' | 'month' | 'custom';

/**
 * 排序選項
 */
export type SortOption = 'time' | 'resource' | 'startTime' | 'endTime' | 'created';

/**
 * BookingTask Domain Model
 * 
 * 核心預約資料結構，包含資源、時間、狀態與伺服器資訊
 */
export interface BookingTask {
  /** 唯一識別碼 */
  id: string;
  
  /** 資源名稱（例如：Robert08000） */
  resourceName: string;
  
  /** 開始時間（ISO 8601 格式） */
  startTime: string;
  
  /** 結束時間（ISO 8601 格式） */
  endTime: string;
  
  /** 預約狀態 */
  status: BookingStatus;
  
  /** 資料室資訊（例如：Data room Left） */
  dataRoom: string;
  
  /** 使用率資訊 */
  utilization: {
    /** 剩餘容量（例如：5%） */
    leftCapacity: string;
    
    /** 預約狀態描述（例如：Booking Now） */
    bookingStatus: string;
  };
  
  /** 伺服器詳細資訊 */
  server: {
    /** 伺服器名稱（例如：Robert0808） */
    name: string;
    
    /** 伺服器類型（例如：analytics） */
    type: string;
    
    /** GPU 數量 */
    gpu: number;
    
    /** 資料使用百分比（0-100） */
    dataUsed: number;
  };
}

/**
 * 自訂時間範圍
 */
export interface CustomTimeRange {
  /** 起始日期（ISO 8601 格式） */
  start: string;
  
  /** 結束日期（ISO 8601 格式） */
  end: string;
}

/**
 * 後端 GET /calendar 回傳的單筆記錄（對齊後端 ScheduleColumnNames）
 */
export interface CalendarRecord {
  booking_id: string;
  start: string;
  end: string;
  user_id: string;
  cpus: number;
  memory: number;
  gpus: number[];
  forward_ports: Array<Record<string, number | string>>;
  image: string;
  extra_command: string | null;
}

/**
 * 篩選狀態
 *
 * 管理 Booking Calendar 的所有篩選條件
 */
export interface FilterState {
  /** 時間範圍選項 */
  timeRange: TimeRangeOption;
  
  /** 自訂時間範圍（僅當 timeRange === 'custom' 時使用） */
  customRange?: CustomTimeRange;
  
  /** 排序選項 */
  sortBy: SortOption;
  
  /** 是否顯示允許重疊的預約 */
  allowedOverlap: boolean;
}
