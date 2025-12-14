/**
 * BookingListView Component
 *
 * 顯示所有預約的滾動列表視圖
 * 對應 Figma 設計的右側面板，垂直排列所有 booking items
 */

import { Empty } from "antd";
import { BookingListItem } from "./BookingListItem";
import type { BookingTask } from "../types/booking.types";

interface BookingListViewProps {
  /** 要顯示的預約列表 (已篩選) */
  bookings: BookingTask[];
  /** 點擊 "show more details" 的回調 */
  onShowMore?: (id: string) => void;
}

export function BookingListView({
  bookings,
  onShowMore,
}: BookingListViewProps) {
  // Empty State
  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-blue-50 rounded-lg h-full flex items-center justify-center p-8">
        <Empty description="目前沒有預約資料" />
      </div>
    );
  }

  return (
    <div className="bg-blue-50 rounded-lg overflow-hidden h-[655px]">
      {/* Header: Data room Left + Percentage */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex justify-between items-start">
          <p className="text-xs leading-3 font-medium text-gray-300">
            Data room Left
          </p>
          <p className="text-gray-500 text-right">
            <span className="text-[38px] leading-[38px] font-medium">5</span>
            <span className="text-sm leading-[14px]">%</span>
          </p>
        </div>
      </div>

      {/* Blue Button Bar */}
      <div className="mx-4 mb-4 px-4 py-[15px] bg-blue-400 border border-blue-400 rounded shadow-[0px_2px_0px_0px_rgba(0,0,0,0.04)]">
        <p className="text-base leading-4 font-medium text-white text-center">
          Left: 5% Booking Now
        </p>
      </div>

      {/* Scrollable List */}
      <div className="overflow-y-auto max-h-[calc(655px-140px)] relative">
        {bookings.map((booking) => (
          <BookingListItem
            key={booking.id}
            booking={booking}
            onShowMore={onShowMore}
          />
        ))}
      </div>
    </div>
  );
}
