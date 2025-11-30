/**
 * UserStatusBadge 元件
 *
 * 顯示使用者狀態的語義化 badge（Active / Inactive / Archived）
 * 使用 Tailwind utilities 與 design tokens
 */

import type { UserStatus } from '../types/user.types';

interface UserStatusBadgeProps {
  /** 使用者狀態 */
  status: UserStatus;
}

/**
 * 使用者狀態 Badge 元件
 */
const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ status }) => {
  // 狀態對應的樣式配置
  const config: Record<
    UserStatus,
    { color: string; text: string }
  > = {
    active: {
      color: 'bg-success-light text-success',
      text: 'Active',
    },
    inactive: {
      color: 'bg-error-light text-error',
      text: 'Inactive',
    },
    archived: {
      color: 'bg-gray-200 text-gray-500',
      text: 'Archived',
    },
  };

  const { color, text } = config[status];

  return (
    <span className={`px-2 py-1 rounded text-regular-xs ${color}`}>
      {text}
    </span>
  );
};

export default UserStatusBadge;
