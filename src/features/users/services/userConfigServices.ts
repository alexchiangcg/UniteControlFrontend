/**
 * User Config Services
 *
 * RTK Query API endpoints for 使用者配置功能
 * 使用 baseQueryWithErrorHandler 統一處理錯誤
 */

import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithErrorHandler from "@shared/services/baseQueryWithErrorHandler";

/**
 * 使用者配置回應
 * 注意：swagger 未定義具體回應結構，可能需要根據實際 API 回應調整
 */
export interface UserConfigResponse {
  [key: string]: unknown;
}

/**
 * User Config API
 *
 * GET /users/config - 獲取使用者配置
 */
export const userConfigApi = createApi({
  reducerPath: "userConfigApi",
  baseQuery: baseQueryWithErrorHandler,
  tagTypes: ["UserConfig"],
  endpoints: (builder) => ({
    /**
     * 獲取使用者配置
     */
    getUserConfig: builder.query<UserConfigResponse, void>({
      query: () => ({
        url: "/users/config",
        method: "GET",
      }),
      providesTags: ["UserConfig"],
    }),
  }),
});

export const { useGetUserConfigQuery } = userConfigApi;
export default userConfigApi;
