/**
 * BookingCalendar Component
 *
 * 主容器元件：組合所有子元件並使用 SidebarLayout
 * 管理整體版面佈局與元件間的協調
 */

import SidebarLayout from "@shared/layouts/SidebarLayout";
import { useBookingCalendar } from "../hooks/useBookingCalendar";
import { CalendarFilterBar } from "./CalendarFilterBar";
import { GanttChartView } from "./GanttChartView";
import { BookingListView } from "./BookingListView";
import { ViewMode } from "gantt-task-react";

export function BookingCalendar() {
  // 業務邏輯層
  const {
    ganttTasks,
    filteredBookings,
    filters,
    isLoading,
    error,
    updateFilter,
  } = useBookingCalendar();

  return (
    <SidebarLayout>
      <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold mb-4 text-gray-500">Calendar</h1>

        {/* White Card Container - contains everything */}
        <div className="bg-white rounded-lg p-6">
          {/* Filter Bar */}
          <CalendarFilterBar
            timeRange={filters.timeRange}
            onTimeRangeChange={(value) => updateFilter("timeRange", value)}
            sortBy={filters.sortBy}
            onSortByChange={(value) => updateFilter("sortBy", value)}
            allowedOverlap={filters.allowedOverlap}
            onAllowedOverlapChange={(value) =>
              updateFilter("allowedOverlap", value)
            }
          />

          {/* Gantt Chart + List View - side by side */}
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_309px] gap-4 mt-6">
            {/* Gantt Chart */}
            <div className="min-w-0">
              <GanttChartView
                tasks={ganttTasks}
                isLoading={isLoading}
                error={error ? String(error) : undefined}
                viewMode={ViewMode.Hour}
              />
            </div>

            {/* Booking List View */}
            <BookingListView bookings={filteredBookings} />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
