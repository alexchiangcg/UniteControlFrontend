/**
 * SidebarLayout 元件
 *
 * 包裝頁面的響應式側邊欄佈局元件
 * - 桌面版 (>= md / 768px): 左側固定側邊欄
 * - 手機版 (< md): 漢堡選單開啟抽屜
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer } from "antd";
import {
  CalendarOutlined,
  HistoryOutlined,
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  SafetyOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import Sidebar, { SidebarItem } from "../components/Sidebar";

// ============================================================================
// 範例選單項目資料
// ============================================================================

const sampleSidebarItems: SidebarItem[] = [
  {
    id: "booking",
    label: "Booking",
    icon: <CalendarOutlined />,
    href: "/booking/create",
  },
  {
    id: "history",
    label: "Booking History",
    icon: <HistoryOutlined />,
    href: "/booking/history",
  },
  {
    id: "resources",
    label: "Resources Management",
    icon: <DashboardOutlined />,
    children: [
      { id: "space", label: "Space", href: "/resources/space" },
      {
        id: "dataset-allocate",
        label: "Dataset Allocate",
        href: "/resources/dataset-allocate",
      },
      { id: "dataset", label: "Dataset", href: "/resources/dataset" },
      { id: "group", label: "Group", href: "/resources/group" },
      { id: "others", label: "Others", href: "/resources/others" },
    ],
  },
  {
    id: "my-account",
    label: "My Account",
    icon: <UserOutlined />,
    href: "/my-account",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <SettingOutlined />,
    href: "/settings",
  },
  {
    id: "logout",
    label: "Logout",
    icon: <LogoutOutlined />,
    href: "/logout",
  },
  {
    id: "maintainer",
    label: "Maintainer manager",
    icon: <SafetyOutlined />,
    children: [
      { id: "node", label: "Node", href: "/maintainer/node" },
      { id: "users", label: "Users", href: "/maintainer/users" },
      { id: "maintainer-group", label: "Group", href: "/maintainer/group" },
    ],
  },
];

// ============================================================================
// SidebarLayout Props
// ============================================================================

interface SidebarLayoutProps {
  children: React.ReactNode;
  sidebarItems?: SidebarItem[];
  activeId?: string;
}

// ============================================================================
// SidebarLayout 元件
// ============================================================================

export default function SidebarLayout({
  children,
  sidebarItems = sampleSidebarItems,
  activeId,
}: SidebarLayoutProps): JSX.Element {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSelect = (id: string) => {
    // 找到被選中的選單項目
    const findItem = (items: SidebarItem[]): SidebarItem | null => {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.children) {
          const found = findItem(item.children);
          if (found) return found;
        }
      }
      return null;
    };

    const selectedItem = findItem(sidebarItems);

    // 如果有 href，則進行路由跳轉
    if (selectedItem?.href) {
      navigate(selectedItem.href);
    }

    // 手機版選擇後自動關閉抽屜
    setDrawerOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* 桌面版側邊欄 - 固定，僅在 md+ 顯示 */}
      <div className="hidden md:block">
        <Sidebar
          items={sidebarItems}
          onSelect={handleSelect}
          defaultWidth="w-[302px]"
          activeId={activeId}
        />
      </div>

      {/* 主內容區域 */}
      <div className="flex flex-col flex-grow min-w-0">
        {/* 手機版標題列（漢堡選單） - 僅在 md 以下顯示 */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center">
          <button
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => setDrawerOpen(true)}
            aria-label="開啟選單"
          >
            <MenuOutlined className="text-gray-500 text-xl" />
          </button>
          <h1 className="ml-4 text-xl font-bold text-gray-500">Unite Slave</h1>
        </header>

        {/* 主內容 - 桌面版無左側 padding（側邊欄已分離） */}
        <main className="flex-grow overflow-auto md:pl-0">{children}</main>
      </div>

      {/* 手機版抽屜 - 僅在 md 以下顯示 */}
      <Drawer
        placement="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className="md:hidden"
        width={302}
        closeIcon={null}
        styles={{
          header: { display: "none" }, // 取代 headerStyle
          body: { padding: 0 }, // 取代 bodyStyle
        }}
      >
        <Sidebar
          items={sidebarItems}
          onSelect={handleSelect}
          onClose={() => setDrawerOpen(false)}
          defaultWidth="w-full"
          activeId={activeId}
          showMobileHeader={true}
        />
      </Drawer>
    </div>
  );
}

/**
 * md (768px) 斷點的響應式 Tailwind Class 建議：
 *
 * Container:
 * - 桌面版: flex h-screen w-full
 * - 手機版: 相同
 *
 * Sidebar:
 * - 桌面版: hidden md:block (固定寬度 w-[302px])
 * - 手機版: hidden (顯示在 Drawer 內)
 *
 * Header (僅手機版):
 * - 桌面版: md:hidden (不顯示)
 * - 手機版: 顯示, flex items-center px-4 py-3
 *
 * Main Content:
 * - 桌面版: md:pl-0 (無 padding，側邊欄已分離)
 * - 手機版: 全寬，無左側 padding
 *
 * Drawer:
 * - 桌面版: md:hidden (不需要)
 * - 手機版: 全高, w-[302px]
 */
