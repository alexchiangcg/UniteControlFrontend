/**
 * BookingStatusTag 元件
 *
 * 渲染預訂執行狀態標籤，支援 4 種狀態：
 * - pending: 等待中（黃色背景 + 沙漏圖示）
 * - running: 執行中（藍色背景 + 播放圖示）
 * - paused: 暫停中（橘色背景 + 暫停圖示）
 * - terminated: 已終止（灰色背景 + 停止圖示）
 *
 * 使用自訂 CSS 類別，配合專案 CSS 變數確保設計一致性
 */

import React from "react";
import {
  HourglassOutlined,
  Loading3QuartersOutlined,
  PauseOutlined,
  StopOutlined,
} from "@ant-design/icons";
import type { BookingHistoryStatus } from "../types/booking-history.types";

/**
 * BookingStatusTag Props 介面
 */
export interface BookingStatusTagProps {
  /** 預訂執行狀態 */
  status: BookingHistoryStatus;
}

/**
 * 狀態配置對應表
 *
 * 定義每個狀態的 CSS 類別、圖示與顯示文字
 */
const STATUS_CONFIG: Record<
  BookingHistoryStatus,
  {
    className: string;
    icon: React.ReactNode;
    text: string;
  }
> = {
  pending: {
    className: "status-tag status-tag-pending",
    icon: <HourglassOutlined />,
    text: "Pending",
  },
  running: {
    className: "status-tag status-tag-running",
    icon: <Loading3QuartersOutlined />,
    text: "Running",
  },
  paused: {
    className: "status-tag status-tag-paused",
    icon: <PauseOutlined />,
    text: "Paused",
  },
  terminated: {
    className: "status-tag status-tag-terminated",
    icon: <StopOutlined />,
    text: "Terminated",
  },
};

/**
 * BookingStatusTag 元件
 *
 * @param {BookingStatusTagProps} props - 元件 props
 * @returns {React.FC} React 函式型元件
 */
const BookingStatusTag: React.FC<BookingStatusTagProps> = ({ status }) => {
  const config = STATUS_CONFIG[status];

  return (
    <span className={config.className}>
      {config.icon}
      <span>{config.text}</span>
    </span>
  );
};

export default BookingStatusTag;
