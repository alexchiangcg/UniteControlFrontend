/**
 * CalendarFilterBar Component
 *
 * 篩選與排序 UI(Controlled Component)
 * 對應 Figma 設計,所有 filters 與 Book Now 按鈕在同一行
 */

import { Select, Checkbox, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { TimeRangeOption, SortOption } from "../types/booking.types";

const { Option } = Select;

interface CalendarFilterBarProps {
  timeRange: TimeRangeOption;
  onTimeRangeChange: (value: TimeRangeOption) => void;
  sortBy: SortOption;
  onSortByChange: (value: SortOption) => void;
  allowedOverlap: boolean;
  onAllowedOverlapChange: (checked: boolean) => void;
}

export function CalendarFilterBar({
  timeRange,
  onTimeRangeChange,
  sortBy,
  onSortByChange,
  allowedOverlap,
  onAllowedOverlapChange,
}: CalendarFilterBarProps) {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/booking/create");
  };

  return (
    <>
      <div className="flex flex-wrap justify-end items-center gap-4 mb-4">
        {/* Time Range Select */}
        <Select
          value={timeRange}
          onChange={onTimeRangeChange}
          placeholder="Time Range"
          className="w-[162px] h-[40px]"
        >
          <Option value="all">All</Option>
          <Option value="today">Today</Option>
          <Option value="week">This Week</Option>
          <Option value="month">This Month</Option>
        </Select>

        {/* Sort By Select */}
        <Select
          value={sortBy}
          onChange={onSortByChange}
          placeholder="Sort by"
          className="w-[224px] h-[40px] mr-12"
        >
          <Option value="resource">Resource Name</Option>
          <Option value="time">Start Time</Option>
        </Select>

        {/* Book Now Button */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleBookNow}
          className="h-[40px] bg-blue-400 border-blue-400 hover:bg-blue-500 hover:border-blue-500"
        >
          Book Now
        </Button>
      </div>
      <div>
        {/* Allowed Overlap Checkbox */}
        <Checkbox
          checked={allowedOverlap}
          onChange={(e) => onAllowedOverlapChange(e.target.checked)}
        >
          <span className="text-regular-sm text-gray-500">Allowed Overlap</span>
        </Checkbox>
      </div>
    </>
  );
}
