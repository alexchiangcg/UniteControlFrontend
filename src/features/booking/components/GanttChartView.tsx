/**
 * GanttChartView Component
 *
 * 封裝 gantt-task-react，處理 loading/empty/error 狀態
 * 隔離 components 層對第三方套件的直接依賴
 */

import { Skeleton, Empty, Alert } from "antd";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import type { GanttChartViewProps } from "../types/gantt.types";

const DEFAULT_COLUMN_WIDTH: Record<string, number> = {
  [ViewMode.Hour]: 60,
  [ViewMode.QuarterDay]: 120, // 6 小時一格
  [ViewMode.HalfDay]: 120, // 12 小時一格
  [ViewMode.Day]: 60,
  [ViewMode.Week]: 250,
  [ViewMode.Month]: 300,
  [ViewMode.Year]: 350,
};

export function GanttChartView({
  tasks,
  isLoading,
  error,
  onTaskClick,
  viewMode = ViewMode.Year,
}: GanttChartViewProps) {
  // Loading State
  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-4">
        <Alert
          type="error"
          message="載入失敗"
          description={
            typeof error === "string" ? error : "無法載入預約資料，請稍後再試"
          }
          showIcon
        />
      </div>
    );
  }

  // Empty State
  if (!tasks || tasks.length === 0) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <Empty description="目前沒有預約資料" />
      </div>
    );
  }

  // Normal State - Render Gantt Chart
  return (
    <div className="gantt-container w-full">
      <Gantt
        tasks={tasks}
        viewMode={viewMode}
        columnWidth={DEFAULT_COLUMN_WIDTH[viewMode] ?? 60}
        listCellWidth=""
        onClick={(task) => {
          onTaskClick?.(task);
        }}
      />
    </div>
  );
}
