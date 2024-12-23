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
