/**
 * 測試用 Mock 資料
 */

import type { User, UsersResponse } from '../types/user.types'

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    status: 'active',
    notes: 'Test user 1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    username: 'jane_smith',
    email: 'jane@example.com',
    status: 'inactive',
    notes: 'Test user 2',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    username: 'archived_user',
    email: 'archived@example.com',
    status: 'archived',
    notes: 'Archived test user',
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z',
  },
]

export const mockUsersResponse: UsersResponse = {
  users: mockUsers,
  total: mockUsers.length,
  page: 1,
  pageSize: 10,
}