/**
 * useBookingCalendar Hook
 *
 * 業務邏輯層：整合 API、篩選邏輯
 * components 只需呼叫此 hook 即可取得所有所需狀態與邏輯
 */

import { useState, useMemo } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useGetCalendarQuery } from "../services/bookingCalendarServices";
import { useGanttTasks } from "./useGanttTasks";
import type { FilterState, SortOption } from "../types/booking.types";

// 啟用 dayjs plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

/**
 * 根據 timeRange 計算 API 查詢的時間範圍
 */
function getCalendarTimeRange(filters: FilterState) {
  const now = dayjs();

  switch (filters.timeRange) {
    case "today":
      return {
        start_time: now.startOf("day").toISOString(),
        end_time: now.endOf("day").toISOString(),
      };
    case "week":
      return {
        start_time: now.startOf("week").toISOString(),
        end_time: now.endOf("week").toISOString(),
      };
    case "month":
      return {
        start_time: now.startOf("month").toISOString(),
        end_time: now.endOf("month").toISOString(),
      };
    case "custom":
      if (filters.customRange) {
        return {
          start_time: dayjs(filters.customRange.start).startOf("day").toISOString(),
          end_time: dayjs(filters.customRange.end).endOf("day").toISOString(),
        };
      }
      // fallback to default range
      return {
        start_time: now.subtract(1, "month").toISOString(),
        end_time: now.add(1, "month").toISOString(),
      };
    case "all":
    default:
      // 預設查詢前後各一個月的資料
      return {
        start_time: now.subtract(1, "month").toISOString(),
        end_time: now.add(1, "month").toISOString(),
      };
  }
}

/**
 * 將前端 sortBy 對應到後端 sort 參數
 */
function mapSortOption(sortBy: SortOption): string {
  switch (sortBy) {
    case "startTime":
    case "time":
      return "start";
    case "endTime":
      return "end";
    default:
      return "start";
  }
}

/**
 * Booking Calendar 業務邏輯 Hook
 *
 * @returns 包含 tasks、filters、filteredBookings、loading/error 狀態及操作函數
 */
export function useBookingCalendar() {
  // Filter 狀態
  const [filters, setFilters] = useState<FilterState>({
    timeRange: "all",
    sortBy: "time",
    allowedOverlap: false,
  });

  // 計算 API 查詢參數
  const queryParams = useMemo(() => {
    const timeRange = getCalendarTimeRange(filters);
    return {
      ...timeRange,
      sort: mapSortOption(filters.sortBy),
    };
  }, [filters.timeRange, filters.customRange, filters.sortBy]);

  // API 狀態 - 使用新的 getCalendar API
  const { data: bookings = [], isLoading, error } = useGetCalendarQuery(queryParams);

  // 篩選邏輯（後端已處理時間範圍和排序，這裡只處理前端篩選）
  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    // 重疊狀態篩選
    if (!filters.allowedOverlap) {
      result = result.filter((booking) => booking.status !== "overlap");
    }

    // 前端額外排序（如果後端排序不支援 resource）
    if (filters.sortBy === "resource") {
      result.sort((a, b) => a.resourceName.localeCompare(b.resourceName));
    }

    return result;
  }, [bookings, filters.allowedOverlap, filters.sortBy]);

  // 轉換為 Gantt Tasks
  const ganttTasks = useGanttTasks(filteredBookings);

  // 更新 Filter
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return {
    // 資料
    ganttTasks,
    filteredBookings,

    // 狀態
    filters,
    isLoading,
    error,

    // 操作函數
    updateFilter,
  };
}
