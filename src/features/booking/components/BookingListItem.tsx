/**
 * BookingListItem Component
 *
 * 單一預約卡片,對應 Figma 設計的重複項目
 * 顯示預約的核心資訊：資源、伺服器、狀態
 */

import { Avatar } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import type { BookingTask } from "../types/booking.types";

interface BookingListItemProps {
  booking: BookingTask;
  onShowMore?: (id: string) => void;
  /** 可選：強制顯示 Allowed Overlap tag（用於測試或特殊場景）*/
  allowedOverlap?: boolean;
}

/**
 * 狀態 Badge 組件
 *
 * 根據 Figma 設計：
 * - Pending: 黃色背景 (#fff6da)
 * - Running: 藍色背景 (#d8e7f2)，帶進度圓圈圖標
 * - Completed: 綠色背景 (#e0f4ef)，綠色文字
 * 注意：overlap 不是狀態 badge，而是額外的 tag
 */
function StatusBadge({ status }: { status: BookingTask["status"] }) {
  // overlap 狀態不顯示 badge，只顯示 AllowedOverlapTag
  const actualStatus = status === "overlap" ? "pending" : status;

  const config = {
    pending: {
      icon: <ClockCircleOutlined className="text-xs" />,
      text: "Pending",
      bgColor: "bg-warning-light",
      textColor: "text-gray-500",
    },
    running: {
      icon: (
        <div className="w-3 h-3 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle
              cx="7"
              cy="7"
              r="6"
              className="stroke-blue-400"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
      ),
      text: "Running",
      bgColor: "bg-blue-100",
      textColor: "text-gray-500",
    },
    completed: {
      icon: <CheckCircleOutlined className="text-xs" />,
      text: "Completed",
      bgColor: "bg-success-light",
      textColor: "text-success",
    },
  } as const;

  const { icon, text, bgColor, textColor } =
    config[actualStatus as keyof typeof config] || config.pending;

  return (
    <div
      className={`inline-flex items-center gap-0.5 px-1.5 py-1.5 rounded ${bgColor} ${textColor}`}
    >
      {icon}
      <span className="text-sm leading-[14px]">{text}</span>
    </div>
  );
}

/**
 * Allowed Overlap Tag
 *
 * 根據 Figma 設計，overlap tag 有兩種顏色：
 * - Pending/其他狀態：藍色邊框 (#5a7684)
 * - Running 狀態：綠色邊框 (#3fa796)
 */
function AllowedOverlapTag({
  status,
  isOverlap,
}: {
  status: BookingTask["status"];
  isOverlap?: boolean;
}) {
  if (!isOverlap) return null;

  // 根據狀態決定顏色
  const isRunning = status === "running";
  const borderColor = isRunning ? "border-success" : "border-second-blue-400";
  const textColor = isRunning ? "text-success" : "text-second-blue-400";

  return (
    <div
      className={`inline-flex items-center gap-0.5 px-1.5 py-1.5 rounded bg-white border ${borderColor}`}
    >
      <CheckOutlined className={` text-xs ${textColor}`} />
      <span className={`text-sm leading-[14px] ${textColor}`}>
        Allowed Overlap
      </span>
    </div>
  );
}

export function BookingListItem({
  booking,
  onShowMore,
  allowedOverlap,
}: BookingListItemProps) {
  return (
    <div className=" border-b border-gray-100 last:border-b-0">
      {/* Booking Info Section */}
      <div className="px-4 py-3">
        <div className="text-xs leading-3 text-gray-300 mb-2 font-medium">
          Booking info
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="bg-blue-300 flex-shrink-0">
            {booking.resourceName.charAt(0)}
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-base leading-4 font-medium text-gray-500">
              {booking.server.name}
            </div>
            <div className="text-xs leading-3 text-gray-400 mt-1">
              {booking.server.type}
            </div>
          </div>
        </div>
      </div>

      {/* Server Details */}
      <div className="px-4 pb-3">
        <div className="space-y-2.5 text-sm leading-[14px]">
          <div className="flex justify-between">
            <span className="text-gray-300">Server</span>
            <span className="text-gray-500 font-normal">
              {booking.server.name.charAt(0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">GPU</span>
            <span className="text-gray-500 font-normal">
              {booking.server.gpu}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Data used</span>
            <span className="text-gray-500 font-normal">
              {booking.server.dataUsed}%
            </span>
          </div>
        </div>
      </div>

      {/* Status + Overlap Tag */}
      <div className="px-4 pb-3 flex items-center justify-between gap-2">
        <StatusBadge status={booking.status} />
        <AllowedOverlapTag
          status={booking.status}
          isOverlap={allowedOverlap ?? booking.status === "overlap"}
        />
      </div>

      {/* Show More Link */}
      {onShowMore && (
        <div className="px-4 pb-3 text-right">
          <button
            onClick={() => onShowMore(booking.id)}
            className="text-xs leading-3 text-gray-500 underline hover:text-gray-700 cursor-pointer"
          >
            show more details
          </button>
        </div>
      )}
    </div>
  );
}
