/**
 * User Management API Services
 *
 * 使用 RTK Query 管理使用者管理相關的 API 呼叫與快取
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithErrorHandler from '@shared/services/baseQueryWithErrorHandler';
import type { User, UserFormValues, UsersResponse, ImportUsersResult } from '../types/user.types';

/**
 * 取得使用者列表的查詢參數
 */
interface GetUsersParams {
  /** 搜尋關鍵字（選填） */
  search?: string;
  /** 狀態篩選（選填） */
  status?: string;
  /** 頁碼（選填） */
  page?: number;
  /** 每頁筆數（選填） */
  pageSize?: number;
}

/**
 * 更新使用者狀態的參數
 */
interface UpdateUserStatusParams {
  /** 使用者 ID */
  id: string;
  /** 新狀態 */
  status: string;
}

/**
 * User Management API
 */
export const userManagementApi = createApi({
  reducerPath: 'userManagementApi',
  baseQuery: baseQueryWithErrorHandler,
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    /**
     * 取得使用者列表（支援搜尋、篩選、分頁）
     */
    getUsers: builder.query<UsersResponse, GetUsersParams | void>({
      query: (params = {}) => ({
        url: '/api/users',
        method: 'GET',
        params,
      }),
      providesTags: ['Users'],
    }),

    /**
     * 建立新使用者
     */
    createUser: builder.mutation<User, UserFormValues>({
      query: (body) => ({
        url: '/api/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Users'],
    }),

    /**
     * 更新使用者資訊
     */
    updateUser: builder.mutation<User, { id: string } & Partial<UserFormValues>>({
      query: ({ id, ...body }) => ({
        url: `/api/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Users'],
    }),

    /**
     * 更新使用者狀態（含樂觀更新）
     */
    updateUserStatus: builder.mutation<User, UpdateUserStatusParams>({
      query: ({ id, status }) => ({
        url: `/api/users/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      // 樂觀更新：立即更新 UI，失敗時自動回滾
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userManagementApi.util.updateQueryData('getUsers', undefined, (draft) => {
            const user = draft.users.find((u) => u.id === id);
            if (user) {
              user.status = status as 'active' | 'inactive' | 'archived';
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          // 失敗時自動回滾
          patchResult.undo();
        }
      },
    }),

    /**
     * 歸檔使用者
     */
    archiveUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),

    /**
     * 批次匯入使用者
     */
    importUsers: builder.mutation<ImportUsersResult, FormData>({
      query: (formData) => ({
        url: '/api/users/import',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

// 導出自動生成的 hooks
export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
  useArchiveUserMutation,
  useImportUsersMutation,
} = userManagementApi;
