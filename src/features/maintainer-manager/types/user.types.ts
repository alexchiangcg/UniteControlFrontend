/**
 * User Management 類型定義
 *
 * 定義使用者管理功能所需的所有 TypeScript 介面與類型
 */

/**
 * 使用者狀態類型
 */
export type UserStatus = 'active' | 'inactive' | 'archived';

/**
 * 使用者介面
 */
export interface User {
  /** 使用者唯一識別碼 */
  id: string;
  /** 使用者名稱 */
  username: string;
  /** 電子郵件 */
  email: string;
  /** 使用者狀態 */
  status: UserStatus;
  /** 備註 */
  notes?: string;
  /** 建立時間（ISO 8601 格式） */
  createdAt: string;
  /** 更新時間（ISO 8601 格式） */
  updatedAt: string;
}

/**
 * 使用者表單值介面（用於建立/編輯）
 */
export interface UserFormValues {
  /** 使用者名稱 */
  username: string;
  /** 電子郵件 */
  email: string;
  /** 備註（選填） */
  notes?: string;
  /** 密碼（僅建立時需要） */
  password?: string;
}

/**
 * 使用者列表回應介面
 */
export interface UsersResponse {
  /** 使用者列表 */
  users: User[];
  /** 總筆數 */
  total: number;
  /** 當前頁碼 */
  page: number;
  /** 每頁筆數 */
  pageSize: number;
}

/**
 * 批次匯入結果介面
 */
export interface ImportUsersResult {
  /** 成功匯入數量 */
  successCount: number;
  /** 失敗數量 */
  failedCount: number;
  /** 錯誤詳情（選填） */
  errors?: Array<{
    /** 錯誤發生的行數 */
    row: number;
    /** 錯誤原因 */
    reason: string;
  }>;
}
