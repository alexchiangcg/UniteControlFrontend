/**
 * OverlapStatusTag 元件
 *
 * 渲染時間重疊狀態標籤，支援 2 種狀態：
 * - allowed: 允許重疊（綠色背景 + 邊框 + 勾選圖示 + "Allowed"）
 * - not-allowed: 不允許重疊（紅色背景 + 邊框 + 關閉圖示 + "Not Allowed"）
 *
 * 使用自訂 CSS 類別，配合專案 CSS 變數確保設計一致性
 */

import React from "react";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import type { OverlapStatus } from "../types/booking-history.types";

/**
 * OverlapStatusTag Props 介面
 */
export interface OverlapStatusTagProps {
  /** 時間重疊狀態 */
  overlapStatus: OverlapStatus;
}

/**
 * 狀態配置對應表
 *
 * 定義每個狀態的 CSS 類別、圖示與顯示文字
 */
const OVERLAP_CONFIG: Record<
  OverlapStatus,
  {
    className: string;
    icon: React.ReactNode;
    text: string;
  }
> = {
  allowed: {
    className: "status-tag status-tag-allowed",
    icon: <CheckCircleOutlined />,
    text: "Allowed",
  },
  "not-allowed": {
    className: "status-tag status-tag-not-allowed",
    icon: <CloseCircleOutlined />,
    text: "Not Allowed",
  },
};

/**
 * OverlapStatusTag 元件
 *
 * @param props - 元件 props
 * @returns React 函式型元件
 */
const OverlapStatusTag: React.FC<OverlapStatusTagProps> = ({
  overlapStatus,
}) => {
  const config = OVERLAP_CONFIG[overlapStatus];

  return (
    <span className={config.className}>
      {config.icon}
      <span>{config.text}</span>
    </span>
  );
};

export default OverlapStatusTag;
