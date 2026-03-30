/**
 * BookingHistory 頁面元件
 *
 * 預訂歷史記錄查詢與管理頁面
 * - 支援多維度篩選（時間範圍、映像檔、使用者）
 * - 分頁展示預訂記錄列表
 * - 提供詳細資訊查看功能
 *
 * 路由：/booking/history
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  DatePicker,
  Select,
  Input,
  Button,
  Card,
  Empty,
} from "antd";
import {
  SearchOutlined,
  FileTextOutlined,
  HomeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import SidebarLayout from "@shared/layouts/SidebarLayout";
import type {
  BookingHistoryRecord,
  BookingHistoryFilterParams,
  SelectOption,
} from "../types/booking-history.types";
import { useGetBookingHistoryQuery } from "../api/bookingHistoryApi";
import BookingStatusTag from "../components/BookingStatusTag";

const DEFAULT_LIMIT = 10;

/**
 * BookingHistory 主元件
 */
const BookingHistory: React.FC = () => {
  const navigate = useNavigate();

  // ============================================================================
  // State 狀態管理
  // ============================================================================

  /** 篩選參數（對齊後端 BookingHistoryQuery） */
  const [filterParams, setFilterParams] = useState<BookingHistoryFilterParams>({
    start_time: dayjs().subtract(30, "day").toISOString(),
    end_time: dayjs().toISOString(),
    offset: 0,
    limit: DEFAULT_LIMIT,
  });

  /** 開始時間 */
  const [startTime, setStartTime] = useState<Dayjs | null>(
    dayjs().subtract(30, "day"),
  );

  /** 結束時間 */
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs());

  /** 映像檔選項（實際專案中應從 API 取得） */
  const [imageOptions] = useState<SelectOption[]>([
    { value: "worker-jobs", label: "worker-jobs" },
    { value: "app-backend", label: "app-backend" },
    { value: "data-processor", label: "data-processor" },
    { value: "ml-training", label: "ml-training" },
    { value: "api-server", label: "api-server" },
  ]);

  // ============================================================================
  // RTK Query 資料載入
  // ============================================================================

  const { data, isLoading, error } = useGetBookingHistoryQuery(filterParams);

  // ============================================================================
  // 分頁計算（offset/limit → page/pageSize）
  // ============================================================================

  const currentPage = Math.floor((filterParams.offset ?? 0) / (filterParams.limit ?? DEFAULT_LIMIT)) + 1;
  const currentPageSize = filterParams.limit ?? DEFAULT_LIMIT;

  // ============================================================================
  // 事件處理
  // ============================================================================

  /**
   * 處理開始時間變更
   */
  const handleStartTimeChange = (date: Dayjs | null) => {
    setStartTime(date);
    if (date) {
      setFilterParams((prev) => ({
        ...prev,
        start_time: date.toISOString(),
        offset: 0,
      }));
    }
  };

  /**
   * 處理結束時間變更
   */
  const handleEndTimeChange = (date: Dayjs | null) => {
    setEndTime(date);
    if (date) {
      setFilterParams((prev) => ({
        ...prev,
        end_time: date.toISOString(),
        offset: 0,
      }));
    }
  };

  /**
   * 處理映像檔篩選變更
   */
  const handleImageChange = (value: string) => {
    setFilterParams((prev) => ({
      ...prev,
      image_id: value || undefined,
      offset: 0,
    }));
  };

  /**
   * 處理使用者 ID 搜尋
   */
  const handleUserIdSearch = (value: string) => {
    setFilterParams((prev) => ({
      ...prev,
      user_id: value || undefined,
      offset: 0,
    }));
  };

  /**
   * 處理分頁變更（將 page/pageSize 轉換為 offset/limit）
   */
  const handleTableChange = (pagination: TablePaginationConfig) => {
    const page = pagination.current || 1;
    const pageSize = pagination.pageSize || DEFAULT_LIMIT;
    setFilterParams((prev) => ({
      ...prev,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    }));
  };

  /**
   * 處理查看詳細資訊
   */
  const handleViewDetail = (record: BookingHistoryRecord) => {
    if (record.booking_id) {
      navigate(`/booking/history/${record.booking_id}`);
    }
  };

  // ============================================================================
  // 表格欄位定義
  // ============================================================================

  const columns: ColumnsType<BookingHistoryRecord> = [
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
      width: 150,
      fixed: "left",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 150,
    },
    {
      title: "Start Time",
      dataIndex: "start",
      key: "start",
      width: 180,
    },
    {
      title: "End Time",
      dataIndex: "end",
      key: "end",
      width: 180,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => <BookingStatusTag status={status} />,
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <Button
          type="link"
          icon={<FileTextOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          Detail
        </Button>
      ),
    },
  ];

  // ============================================================================
  // 錯誤處理
  // ============================================================================

  if (error) {
    console.error("Failed to fetch booking history:", error);
  }

  // ============================================================================
  // 渲染
  // ============================================================================

  return (
    <SidebarLayout
      activeId="history"
      breadcrumbItems={[
        {
          href: "/",
          title: (
            <>
              <HomeOutlined />
            </>
          ),
        },
        {
          title: (
            <>
              <CalendarOutlined />
              <span>Booking</span>
            </>
          ),
        },
        {
          title: "Booking history",
        },
      ]}
    >
      <div className="min-h-screen bg-gray-100 p-6">
        {/* 頁面標題 */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Booking history
        </h1>

        {/* 主內容卡片 */}
        <Card className="shadow-sm">
          {/* 篩選列 filter */}
          <div className="mb-6 space-y-3">
            {/* 第一行：Start Time - End Time | Image | Search user id */}
            <div className="flex items-center gap-3">
              <DatePicker
                value={startTime}
                onChange={handleStartTimeChange}
                format="YYYY-MM-DD"
                placeholder="Start Time"
                className="w-[200px]"
              />
              <span className="text-gray-500">-</span>
              <DatePicker
                value={endTime}
                onChange={handleEndTimeChange}
                format="YYYY-MM-DD"
                placeholder="End Time"
                className="w-[200px]"
              />
              <Select
                placeholder="Image"
                allowClear
                className="w-[200px]"
                onChange={handleImageChange}
                value={filterParams.image_id}
                options={imageOptions}
              />
              <Input
                placeholder="Search user id..."
                allowClear
                className="flex-1"
                onChange={(e) => handleUserIdSearch(e.target.value)}
                value={filterParams.user_id}
              />
              <Button
                type="primary"
                icon={<SearchOutlined />}
              >
                Search
              </Button>
            </div>
          </div>

          {/* 資料表格 */}
          <Table<BookingHistoryRecord>
            columns={columns}
            dataSource={data?.booking_histories || []}
            rowKey={(record) => `${record.user_id}-${record.start}`}
            loading={isLoading}
            pagination={{
              current: currentPage,
              pageSize: currentPageSize,
              total: data?.booking_histories?.length || 0,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} items`,
              pageSizeOptions: ["10", "20", "50", "100"],
            }}
            onChange={handleTableChange}
            scroll={{ x: 1500 }}
            locale={{
              emptyText: <Empty description="暫無預訂記錄" />,
            }}
          />
        </Card>
      </div>
    </SidebarLayout>
  );
};

export default BookingHistory;
