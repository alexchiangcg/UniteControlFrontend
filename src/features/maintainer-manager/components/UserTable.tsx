/**
 * UserTable 元件
 *
 * 顯示使用者列表表格，包含搜尋、篩選、分頁與操作功能
 */

import { useState } from "react";
import { Table, Switch, Button, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  useArchiveUserMutation,
} from "../services/userManagementServices";
import type { User } from "../types/user.types";
import UserStatusBadge from "./UserStatusBadge";

interface UserTableProps {
  /** 搜尋關鍵字 */
  searchKeyword: string;
  /** 狀態篩選 */
  statusFilter: string;
  /** 編輯使用者回調 */
  onEdit?: (user: User) => void;
}

/**
 * 使用者列表表格元件
 */
const UserTable: React.FC<UserTableProps> = ({
  searchKeyword,
  statusFilter,
  onEdit,
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // RTK Query hooks
  const { data, isLoading, isFetching } = useGetUsersQuery({
    search: searchKeyword || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    page,
    pageSize,
  });

  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [archiveUser] = useArchiveUserMutation();

  /**
   * 處理狀態切換
   */
  const handleStatusToggle = (user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active";

    Modal.confirm({
      title: "確認變更狀態",
      content: `確定要將使用者 "${user.username}" 的狀態從 ${user.status} 變更為 ${newStatus} 嗎？`,
      okText: "確認",
      cancelText: "取消",
      onOk: async () => {
        try {
          await updateUserStatus({ id: user.id, status: newStatus }).unwrap();
          message.success("狀態更新成功");
        } catch (error) {
          // 錯誤由 baseQueryWithErrorHandler 統一處理
          console.error("更新狀態失敗:", error);
        }
      },
    });
  };

  /**
   * 處理歸檔使用者
   */
  const handleArchive = (user: User) => {
    Modal.confirm({
      title: "確認歸檔",
      content: `確定要歸檔使用者 "${user.username}" 嗎？此操作無法復原。`,
      okText: "確認歸檔",
      cancelText: "取消",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await archiveUser(user.id).unwrap();
          message.success("使用者已歸檔");
        } catch (error) {
          // 錯誤由 baseQueryWithErrorHandler 統一處理
          console.error("歸檔失敗:", error);
        }
      },
    });
  };

  /**
   * 表格欄位定義
   */
  const columns: ColumnsType<User> = [
    {
      title: "User Name",
      dataIndex: "username",
      key: "username",
      width: 150,
    },
    {
      title: "Create Time",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (date: string) => new Date(date).toLocaleString("zh-TW"),
    },
    {
      title: "Updated Time",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 180,
      render: (date: string) => new Date(date).toLocaleString("zh-TW"),
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      ellipsis: true,
      render: (notes?: string) => notes || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => <UserStatusBadge status={status} />,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const isArchived = record.status === "archived";

        return (
          <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap">
            {/* 狀態切換開關（archived 狀態不顯示） */}
            {!isArchived && (
              <Switch
                checked={record.status === "active"}
                onChange={() => handleStatusToggle(record)}
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                className="[&.ant-switch-checked]:bg-success flex-shrink-0"
              />
            )}

            {/* 編輯按鈕（archived 狀態不顯示） */}
            {!isArchived && (
              <Button
                type="text"
                icon={<EditOutlined className="text-blue-400" />}
                onClick={() => onEdit?.(record)}
                className="flex items-center gap-1 px-2 hover:bg-blue-50 flex-shrink-0"
              >
                <span className="text-sm whitespace-nowrap">Edit</span>
              </Button>
            )}

            {/* 歸檔按鈕（archived 狀態不顯示） */}
            {!isArchived && (
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleArchive(record)}
                className="flex items-center gap-1 px-2 hover:bg-error-light flex-shrink-0"
              >
                <span className="text-sm whitespace-nowrap">Archive</span>
              </Button>
            )}

            {/* archived 狀態顯示提示文字 */}
            {isArchived && (
              <span className="text-gray-400 text-sm whitespace-nowrap">
                Archived
              </span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Table<User>
        columns={columns}
        dataSource={data?.users || []}
        rowKey="id"
        loading={isLoading || isFetching}
        pagination={{
          current: page,
          pageSize,
          total: data?.total || 0,
          showTotal: (total) => `Total ${total} items`,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize || 10);
          },
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        className="bg-white rounded-lg shadow-sm [&_.ant-table-thead>tr>th]:bg-blue-100 [&_.ant-table-thead>tr>th]:text-gray-400 [&_.ant-table-tbody>tr:nth-child(odd)]:bg-white [&_.ant-table-tbody>tr:nth-child(even)]:bg-blue-50"
      />
    </div>
  );
};

export default UserTable;
