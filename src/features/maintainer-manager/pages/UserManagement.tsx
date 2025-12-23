/**
 * UserManagement 頁面
 *
 * 使用者管理主頁面，整合所有子元件
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import { HomeOutlined, SafetyOutlined } from "@ant-design/icons";
import SidebarLayout from "@shared/layouts/SidebarLayout";
import UserSearchBar from "../components/UserSearchBar";
import UserTable from "../components/UserTable";
import UserFormModal from "../components/UserFormModal";
import ImportUsersModal from "../components/ImportUsersModal";
import { useUserFilters } from "../hooks/useUserFilters";
import type { User } from "../types/user.types";

/**
 * 使用者管理頁面元件
 */
const UserManagement: React.FC = () => {
  const navigate = useNavigate();

  // 搜尋與篩選狀態（使用 custom hook）
  const { searchKeyword, statusFilter, setSearchKeyword, setStatusFilter } =
    useUserFilters();

  // Tab 狀態
  const [activeTab, setActiveTab] = useState<"general" | "capability">(
    "general"
  );

  // 編輯使用者 Modal 狀態
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  // 匯入 Modal 狀態
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);

  /**
   * 跳轉到建立使用者頁面
   */
  const handleCreateClick = () => {
    navigate("/maintainer/users/create");
  };

  /**
   * 開啟編輯使用者 Modal
   */
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditModalVisible(true);
  };

  /**
   * 開啟匯入 Modal
   */
  const handleImportClick = () => {
    setIsImportModalVisible(true);
  };

  /**
   * 關閉編輯 Modal
   */
  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setSelectedUser(undefined);
  };

  /**
   * 關閉匯入 Modal
   */
  const handleImportModalClose = () => {
    setIsImportModalVisible(false);
  };

  /**
   * 編輯提交成功處理（刷新列表已由 RTK Query 自動處理）
   */
  const handleEditSubmitSuccess = () => {
    // RTK Query 的 invalidatesTags 會自動刷新列表
  };

  /**
   * 匯入成功處理（刷新列表已由 RTK Query 自動處理）
   */
  const handleImportSuccess = () => {
    // RTK Query 的 invalidatesTags 會自動刷新列表
  };

  return (
    <SidebarLayout
      activeId="users"
      breadcrumbItems={[
        {
          href: "/",
          title: <HomeOutlined />,
        },
        {
          href: "/maintainer",
          title: (
            <>
              <SafetyOutlined />
              <span>Maintainer Manager</span>
            </>
          ),
        },
        {
          title: "User Management",
        },
      ]}
    >
      {/* 頁面內容區域 */}
      <div className="flex flex-col h-full bg-gray-100">
        {/* 主內容區域 */}
        <div className="flex-grow overflow-auto p-6">
          <div className="mx-auto">
            {/* 頁面標題 */}
            <h1 className="text-2xl font-bold text-gray-500 mb-6">
              User Management
            </h1>

            {/* Tabs 切換 */}
            <Tabs
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key as "general" | "capability")}
              items={[
                {
                  key: "general",
                  label: "General Settings",
                  children: (
                    <div className="space-y-4">
                      {/* 搜尋與操作列 */}
                      <UserSearchBar
                        onSearchChange={setSearchKeyword}
                        onStatusFilterChange={setStatusFilter}
                        onImportClick={handleImportClick}
                        onCreateClick={handleCreateClick}
                      />

                      {/* 使用者列表表格 */}
                      <UserTable
                        searchKeyword={searchKeyword}
                        statusFilter={statusFilter}
                        onEdit={handleEditClick}
                      />
                    </div>
                  ),
                },
                {
                  key: "capability",
                  label: "Capability Settings",
                  children: (
                    <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                      <p className="text-gray-400">
                        Capability Settings 功能開發中...
                      </p>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* 編輯使用者 Modal */}
      <UserFormModal
        visible={isEditModalVisible}
        mode="edit"
        initialValues={selectedUser}
        onClose={handleEditModalClose}
        onSubmitSuccess={handleEditSubmitSuccess}
      />

      {/* 匯入使用者 Modal */}
      <ImportUsersModal
        visible={isImportModalVisible}
        onClose={handleImportModalClose}
        onImportSuccess={handleImportSuccess}
      />
    </SidebarLayout>
  );
};

export default UserManagement;
