/**
 * BookingHistory 頁面元件
 *
 * 預訂歷史記錄查詢與管理頁面
 * - 支援多維度篩選（時間範圍、節點、群組、狀態、關鍵字）
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
import OverlapStatusTag from "../components/OverlapStatusTag";

/**
 * BookingHistory 主元件
 */
const BookingHistory: React.FC = () => {
  const navigate = useNavigate();

  // ============================================================================
  // State 狀態管理
  // ============================================================================

  /** 篩選參數 */
  const [filterParams, setFilterParams] = useState<BookingHistoryFilterParams>({
    page: 1,
    pageSize: 10,
  });

  /** 開始時間 */
  const [startTime, setStartTime] = useState<Dayjs | null>(null);

  /** 結束時間 */
  const [endTime, setEndTime] = useState<Dayjs | null>(null);

  /** 節點選項（實際專案中應從 API 取得） */
  const [nodeOptions] = useState<SelectOption[]>([
    { value: "10.0.1.11", label: "10.0.1.11" },
    { value: "10.0.1.12", label: "10.0.1.12" },
    { value: "10.0.1.13", label: "10.0.1.13" },
  ]);

  /** 群組選項（實際專案中應從 API 取得） */
  const [groupOptions] = useState<SelectOption[]>([
    { value: "analytics", label: "analytics" },
    { value: "development", label: "development" },
    { value: "production", label: "production" },
  ]);

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
        startDate: date.format("YYYY-MM-DD"),
        page: 1,
      }));
    } else {
      setFilterParams((prev) => {
        const { startDate, ...rest } = prev;
        return { ...rest, page: 1 };
      });
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
        endDate: date.format("YYYY-MM-DD"),
        page: 1,
      }));
    } else {
      setFilterParams((prev) => {
        const { endDate, ...rest } = prev;
        return { ...rest, page: 1 };
      });
    }
  };

  /**
   * 處理節點篩選變更
   */
  const handleNodeChange = (value: string) => {
    setFilterParams((prev) => ({
      ...prev,
      node: value || undefined,
      page: 1,
    }));
  };

  /**
   * 處理群組篩選變更
   */
  const handleGroupChange = (value: string) => {
    setFilterParams((prev) => ({
      ...prev,
      group: value || undefined,
      page: 1,
    }));
  };

  /**
   * 處理映像檔篩選變更
   */
  const handleImageChange = (value: string) => {
    setFilterParams((prev) => ({
      ...prev,
      image: value || undefined,
      page: 1,
    }));
  };

  /**
   * 處理關鍵字搜尋
   */
  const handleSearch = (value: string) => {
    setFilterParams((prev) => ({
      ...prev,
      keyword: value || undefined,
      page: 1,
    }));
  };

  /**
   * 處理分頁變更
   */
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setFilterParams((prev) => ({
      ...prev,
      page: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    }));
  };

  /**
   * 處理查看詳細資訊
   */
  const handleViewDetail = (record: BookingHistoryRecord) => {
    navigate(`/booking/history/${record.id}`);
  };

  // ============================================================================
  // 表格欄位定義
  // ============================================================================

  const columns: ColumnsType<BookingHistoryRecord> = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      width: 150,
      fixed: "left",
    },
    {
      title: "Node",
      dataIndex: "node",
      key: "node",
      width: 120,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 150,
    },
    {
      title: "Group",
      dataIndex: "group",
      key: "group",
      width: 120,
    },
    {
      title: "Account",
      dataIndex: "account",
      key: "account",
      width: 120,
    },
    {
      title: "Overlap",
      dataIndex: "overlapStatus",
      key: "overlapStatus",
      width: 130,
      render: (overlapStatus) => (
        <OverlapStatusTag overlapStatus={overlapStatus} />
      ),
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      width: 180,
      render: (time: string) => dayjs(time).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      width: 180,
      render: (time: string) => dayjs(time).format("YYYY-MM-DD HH:mm:ss"),
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
          {/* 篩選列 filter - 按照 Figma 設計 */}
          <div className="mb-6 space-y-3">
            {/* 第一行：Start Time - End Time | Group | Search account id */}
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
                placeholder="Group"
                allowClear
                className="w-[200px]"
                onChange={handleGroupChange}
                value={filterParams.group}
                options={groupOptions}
              />
              <Input
                placeholder="Search account id..."
                allowClear
                className="flex-1"
                onChange={(e) => handleSearch(e.target.value)}
                value={filterParams.keyword}
              />
            </div>

            {/* 第二行：Node | Image | [空白] | Search 按鈕 */}
            <div className="flex items-center gap-3">
              <Select
                placeholder="Node"
                allowClear
                className="w-[200px]"
                onChange={handleNodeChange}
                value={filterParams.node}
                options={nodeOptions}
              />
              <Select
                placeholder="Image"
                allowClear
                className="w-full"
                onChange={handleImageChange}
                value={filterParams.image}
                options={imageOptions}
              />
              <div className="flex-1" />
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => handleSearch(filterParams.keyword || "")}
              >
                Search
              </Button>
            </div>
          </div>

          {/* 資料表格 */}
          <Table<BookingHistoryRecord>
            columns={columns}
            dataSource={data?.records || []}
            rowKey="id"
            loading={isLoading}
            pagination={{
              current: filterParams.page,
              pageSize: filterParams.pageSize,
              total: data?.total || 0,
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
