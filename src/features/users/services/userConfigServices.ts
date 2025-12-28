/**
 * User Config Services
 *
 * RTK Query API endpoints for 使用者配置功能
 * 使用 baseQueryWithErrorHandler 統一處理錯誤
 */

import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithErrorHandler from "@shared/services/baseQueryWithErrorHandler";

/**
 * 單一配置項目
 */
export interface UserConfigItem {
  /** 配置 ID */
  id: string;
  /** 配置名稱 */
  name: string;
  /** CPU 數量 */
  cpus?: number;
  /** 記憶體大小 (MB) */
  memory?: number;
  /** GPU 數量 */
  gpus?: number;
  /** Docker Image */
  image?: string;
  /** 是否為預設配置 */
  is_default?: boolean;
}

/**
 * 使用者配置回應
 */
export interface UserConfigResponse {
  /** 配置列表 */
  configs: UserConfigItem[];
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
