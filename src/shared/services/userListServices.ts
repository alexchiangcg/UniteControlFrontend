/**
 * ⚠️ 範例檔案 - API Service 開發參考
 *
 * 這是一個示範如何使用 RTK Query 建立 API service 的範例檔案。
 * 當需要新增 API 功能時，可以參考此檔案的結構：
 *
 * 1. 使用 createApi 建立 API slice
 * 2. 定義 TypeScript 介面
 * 3. 配置 endpoints (query/mutation)
 * 4. 導出自動生成的 hooks
 *
 * 實際專案中建議使用 @shared/services/baseQueryWithErrorHandler
 * 來統一處理錯誤和認證。
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// 定義使用者的類型
export interface User {
  id: number;
  username: string;
  email: string;
}

export const userListApi = createApi({
  reducerPath: 'userListApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3004/' }),
  endpoints: (builder) => ({
    // < 返回類型, 請求參數類型 >
    getUsers: builder.query<User[], void>({
      query: () => 'users',
    }),
  }),
});

export const { useGetUsersQuery } = userListApi;
export default userListApi;
