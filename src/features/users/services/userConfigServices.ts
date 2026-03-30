/**
 * User Config Services
 *
 * RTK Query API endpoints for 使用者配置功能
 * 使用 baseQueryWithErrorHandler 統一處理錯誤
 */

import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithErrorHandler from "@shared/services/baseQueryWithErrorHandler";

/**
 * Forward Port 設定
 */
export interface ForwardPort {
  host_port: number | string;
  container_port: number | string;
}

/**
 * 使用者配置回應（對齊後端 UserConfigResponse）
 */
export interface UserConfigResponse {
  user_id: string;
  unix_id: number;
  password?: string | null;
  forward_ports: ForwardPort[];
  image: string;
  extra_command: string;
  volume_work_dir: string;
  volume_dataset_dir: string;
  volume_backup_dir: string;
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
