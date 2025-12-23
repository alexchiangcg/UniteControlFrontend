/**
 * CreateUser 頁面
 *
 * 建立新使用者頁面
 */

import {
  HomeOutlined,
  SafetyOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import SidebarLayout from "@shared/layouts/SidebarLayout";

/**
 * 建立使用者頁面元件
 */
const CreateUser: React.FC = () => {
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
          href: "/maintainer/users",
          title: "User Management",
        },
        {
          title: (
            <>
              <UserAddOutlined />
              <span>Create User</span>
            </>
          ),
        },
      ]}
    >
      {/* 頁面內容區域 */}
      <div className="flex flex-col h-full bg-gray-100">
        {/* 主內容區域 */}
        <div className="flex-grow overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-500 mb-6">
              Create New User
            </h1>

            {/* 這裡之後放建立使用者的表單 */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <p className="text-gray-400">建立使用者表單（開發中...）</p>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default CreateUser;
