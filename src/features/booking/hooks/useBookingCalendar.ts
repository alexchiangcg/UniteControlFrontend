/**
 * useBookingCalendar Hook
 * 
 * 業務邏輯層：整合 API、篩選邏輯
 * components 只需呼叫此 hook 即可取得所有所需狀態與邏輯
 */

import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useGetBookingsQuery } from '../services/bookingCalendarServices';
import { useGanttTasks } from './useGanttTasks';
import type { FilterState } from '../types/booking.types';

// 啟用 dayjs plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

/**
 * Booking Calendar 業務邏輯 Hook
 * 
 * @returns 包含 tasks、filters、filteredBookings、loading/error 狀態及操作函數
 */
export function useBookingCalendar() {
  // API 狀態
  const { data: bookings = [], isLoading, error } = useGetBookingsQuery();

  // Filter 狀態
  const [filters, setFilters] = useState<FilterState>({
    timeRange: 'all',
    sortBy: 'time',
    allowedOverlap: false,
  });

  // 篩選與排序邏輯
  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    // 時間範圍篩選
    if (filters.timeRange !== 'all') {
      const now = dayjs();
      let startDate: dayjs.Dayjs;

      switch (filters.timeRange) {
        case 'today':
          startDate = now.startOf('day');
          break;
        case 'week':
          startDate = now.startOf('week');
          break;
        case 'month':
          startDate = now.startOf('month');
          break;
        case 'custom':
          if (filters.customRange) {
            startDate = dayjs(filters.customRange.start);
            const endDate = dayjs(filters.customRange.end);
            result = result.filter(
              (booking) =>
                dayjs(booking.startTime).isSameOrAfter(startDate) &&
                dayjs(booking.endTime).isSameOrBefore(endDate)
            );
          }
          return result;
        default:
          return result;
      }

      result = result.filter((booking) => dayjs(booking.startTime).isSameOrAfter(startDate));
    }

    // 重疊狀態篩選
    if (!filters.allowedOverlap) {
      result = result.filter((booking) => booking.status !== 'overlap');
    }

    // 排序
    if (filters.sortBy === 'time') {
      result.sort((a, b) => dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf());
    } else if (filters.sortBy === 'resource') {
      result.sort((a, b) => a.resourceName.localeCompare(b.resourceName));
    }

    return result;
  }, [bookings, filters]);

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
