/**
 * useGanttTasks Hook
 * 
 * BookingTask[] → gantt-task-react Task[] adapter
 * 負責型別轉換，隔離 components 對 gantt-task-react 的直接依賴
 */

import { useMemo } from 'react';
import dayjs from 'dayjs';
import type { Task } from '../types/gantt.types';
import type { BookingTask } from '../types/booking.types';

/**
 * 將 BookingTask 陣列轉換為 gantt-task-react 的 Task 陣列
 * 
 * @param bookings - BookingTask 陣列
 * @returns gantt-task-react Task 陣列
 */
export function useGanttTasks(bookings: BookingTask[]): Task[] {
  return useMemo(() => {
    if (!bookings || bookings.length === 0) {
      return [];
    }

    return bookings.map((booking) => ({
      id: booking.id,
      name: booking.resourceName,
      start: dayjs(booking.startTime).toDate(),
      end: dayjs(booking.endTime).toDate(),
      progress: 100,
      type: 'task' as const,
      assignees: [], // gantt-task-react required field
      styles: {
        // 使用設計系統的藍色作為預設 bar 顏色
        backgroundColor:
          booking.status === 'overlap'
            ? 'var(--color-warning)'
            : 'var(--color-blue-400)',
        progressColor: 'var(--color-blue-300)',
        progressSelectedColor: 'var(--color-blue-500)',
      },
    }));
  }, [bookings]);
}
