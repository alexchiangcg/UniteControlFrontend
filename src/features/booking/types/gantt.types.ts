/**
 * Gantt Adapter Types
 * 
 * 隔離 gantt-task-react 套件型別
 * 未來若更換甘特圖套件，只需修改此檔案
 */

import type { Task, ViewMode } from 'gantt-task-react';

/**
 * Re-export gantt-task-react types
 * 避免 components 直接依賴外部套件
 */
export type { Task, ViewMode };

/**
 * GanttChartView 元件 Props
 */
export interface GanttChartViewProps {
  /** gantt-task-react Task 陣列 */
  tasks: Task[];
  
  /** 載入中狀態 */
  isLoading: boolean;
  
  /** 錯誤訊息（可選） */
  error?: string;
  
  /** 點擊 task 回調函數（可選） */
  onTaskClick?: (task: Task) => void;
  
  /** 視圖模式（Hour | Day | Week | Month） */
  viewMode: ViewMode;
}
