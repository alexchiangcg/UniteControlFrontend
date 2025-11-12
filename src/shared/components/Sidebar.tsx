/**
 * Sidebar 元件
 *
 * 可重用的側邊欄導航元件，支援展開/收合功能
 * 支援受控和非受控模式、鍵盤導航和子選單展開
 *
 * @example
 * ```tsx
 * const items = [
 *   { id: 'home', label: 'Home', icon: 'home', href: '/' },
 *   { id: 'settings', label: 'Settings', icon: 'settings', href: '/settings' }
 * ];
 *
 * <Sidebar
 *   items={items}
 *   collapsed={false}
 *   onSelect={(id) => console.log(id)}
 *   defaultWidth="w-[302px]"
 * />
 * ```
 */

import { useState, useEffect, KeyboardEvent } from "react";
import { RightOutlined, CloseOutlined } from "@ant-design/icons";

// ============================================================================
// 型別定義
// ============================================================================

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode; // 可以是任何 React 元素（Ant Design Icons 或其他）
  href?: string;
  badge?: number | string;
  disabled?: boolean;
  children?: SidebarItem[];
}

export interface SidebarProps {
  items: SidebarItem[];
  onSelect?: (id: string) => void;
  onClose?: () => void; // 手機版關閉 Drawer 用
  defaultWidth?: string;
  className?: string;
  activeId?: string;
  showMobileHeader?: boolean; // 是否顯示手機版頂部（僅 Drawer 內需要）
}

// ============================================================================
// Sidebar 元件
// ============================================================================

export default function Sidebar(props: SidebarProps): JSX.Element {
  const {
    items,
    onSelect,
    onClose,
    defaultWidth = "w-[302px]",
    className = "",
    activeId,
    showMobileHeader = false,
  } = props;

  // 狀態管理 - 只保留子選單展開和 active 狀態
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [internalActiveId, setInternalActiveId] = useState<string | undefined>(
    activeId
  );

  const currentActiveId = activeId !== undefined ? activeId : internalActiveId;

  useEffect(() => {
    if (activeId !== undefined) {
      setInternalActiveId(activeId);
    }
  }, [activeId]);

  // 切換子選單展開狀態
  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  // 處理選單項目點擊
  const handleItemClick = (item: SidebarItem) => {
    if (item.disabled) return;

    if (item.children && item.children.length > 0) {
      toggleExpanded(item.id);
    } else {
      setInternalActiveId(item.id);
      onSelect?.(item.id);
    }
  };

  // 鍵盤導航處理
  const handleKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    item: SidebarItem
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleItemClick(item);
    }
  };

  // 渲染個別選單項目
  const renderMenuItem = (item: SidebarItem, level: number = 0) => {
    const isActive = currentActiveId === item.id;
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    const paddingLeft = level === 0 ? "pl-6" : "pl-12";

    return (
      <li key={item.id} className="w-full">
        <button
          className={`
            w-full flex items-center gap-2.5 h-10 pr-6 ${paddingLeft}
            transition-colors duration-200
            ${isActive ? "bg-[#2f6f9f] border-r-[3px] border-white" : "bg-[#2e2e2e]"}
            ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[#3a3a3a]"}
          `}
          onClick={() => handleItemClick(item)}
          onKeyDown={(e) => handleKeyDown(e, item)}
          disabled={item.disabled}
          aria-label={item.label}
          aria-current={isActive ? "page" : undefined}
          aria-expanded={hasChildren ? isExpanded : undefined}
          tabIndex={0}
        >
          {/* 圖標 */}
          {item.icon && (
            <div className="flex items-center justify-center shrink-0 w-3.5 h-3.5 text-white text-sm">
              {item.icon}
            </div>
          )}

          {/* 標籤 */}
          <span className="flex-grow text-white text-base font-normal leading-4 text-left">
            {item.label}
          </span>

          {/* 徽章 */}
          {item.badge && (
            <span className="bg-[#e85d75] text-white text-xs px-2 py-0.5 rounded-full">
              {item.badge}
            </span>
          )}

          {/* 子選單箭頭 */}
          {hasChildren && (
            <RightOutlined
              className={`text-white text-xs transition-transform duration-200 ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          )}
        </button>

        {/* 子選單 */}
        {hasChildren && isExpanded && (
          <ul className="bg-[#2e2e2e] flex flex-col gap-2 w-full mt-1">
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside
      className={`
        bg-[#2e2e2e] h-full flex flex-col relative
        ${defaultWidth}
        ${className}
      `}
      role="navigation"
      aria-label="Sidebar"
    >
      {/* 手機版頂部標題（僅在 Drawer 內顯示） */}
      {showMobileHeader && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#3a3a3a]">
          <h1 className="text-white text-xl font-bold">Unite Slave</h1>
          <button
            className="p-2 hover:bg-[#3a3a3a] rounded transition-colors"
            onClick={onClose}
            aria-label="關閉選單"
          >
            <CloseOutlined className="text-white text-xl" />
          </button>
        </div>
      )}

      {/* Logo 區域 */}
      <header className="flex items-center gap-2.5 px-6 pt-9 pb-7 shrink-0">
        <div className="w-6 h-6 shrink-0">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 4H10V10H4V4ZM14 4H20V10H14V4ZM4 14H10V20H4V14ZM14 14H20V20H14V14Z"
              fill="white"
            />
          </svg>
        </div>
        <h1 className="text-white text-2xl font-bold leading-6">Unite Slave</h1>
      </header>

      {/* 選單項目 */}
      <nav className="flex-grow overflow-y-auto">
        <ul className="flex flex-col gap-2 w-full">
          {items.map((item) => renderMenuItem(item))}
        </ul>
      </nav>

      {/* 頁尾區域 */}
      <footer className="px-6 py-4 text-[#ced4da] text-xs leading-3 text-center shrink-0">
        copyright © uniteslave
      </footer>
    </aside>
  );
}
