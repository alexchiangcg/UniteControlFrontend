/**
 * UserSearchBar 元件
 *
 * 提供搜尋框、狀態篩選器、Import Files 與 Create User 按鈕
 */

import { Input, Select, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

interface UserSearchBarProps {
  /** 搜尋關鍵字變更回調 */
  onSearchChange: (keyword: string) => void;
  /** 狀態篩選變更回調 */
  onStatusFilterChange: (status: string) => void;
  /** Import Files 按鈕點擊回調 */
  onImportClick: () => void;
  /** Create User 按鈕點擊回調 */
  onCreateClick: () => void;
}

/**
 * 使用者搜尋與操作列元件
 */
const UserSearchBar: React.FC<UserSearchBarProps> = ({
  onSearchChange,
  onStatusFilterChange,
  onImportClick,
  onCreateClick,
}) => {
  return (
    <div className="flex gap-4 mb-4">
      {/* 搜尋框 */}
      <Search
        placeholder="Search User name"
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-grow max-w-md"
      />

      {/* 狀態篩選下拉選單 */}
      <Select
        defaultValue="all"
        onChange={onStatusFilterChange}
        className="w-40"
      >
        <Option value="all">All Status</Option>
        <Option value="active">Active</Option>
        <Option value="inactive">Inactive</Option>
        <Option value="archived">Archived</Option>
      </Select>

      {/* Import Files 按鈕 */}
      <Button
        icon={<PlusOutlined />}
        type="primary"
        onClick={onImportClick}
        className="bg-blue-500 hover:bg-blue-600 border-blue-500"
      >
        Import Files
      </Button>

      {/* Create User 按鈕 */}
      <Button
        icon={<PlusOutlined />}
        type="primary"
        onClick={onCreateClick}
        className="bg-blue-500 hover:bg-blue-600 border-blue-500"
      >
        Create User
      </Button>
    </div>
  );
};

export default UserSearchBar;
