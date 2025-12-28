/**
 * Resource Limit Services
 *
 * RTK Query API endpoints for 資源限制功能
 * 使用 baseQueryWithErrorHandler 統一處理錯誤
 */

import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithErrorHandler from "@shared/services/baseQueryWithErrorHandler";

/**
 * 資源限制查詢參數
 */
export interface ResourceLimitParams {
  /** 節點 ID */
  node_id: string;
}

/**
 * 資源限制回應
 * 注意：swagger 未定義具體回應結構，可能需要根據實際 API 回應調整
 */
export interface ResourceLimitResponse {
  [key: string]: unknown;
}

/**
 * Resource Limit API
 *
 * GET /users/resource-limit - 獲取使用者的資源限制
 */
export const resourceLimitApi = createApi({
  reducerPath: "resourceLimitApi",
  baseQuery: baseQueryWithErrorHandler,
  tagTypes: ["ResourceLimit"],
  endpoints: (builder) => ({
    /**
     * 獲取使用者的資源限制
     */
    getResourceLimit: builder.query<ResourceLimitResponse, ResourceLimitParams>({
      query: (params) => ({
        url: `/users/resource-limit`,
        method: "GET",
        params: { node_id: params.node_id },
      }),
      providesTags: ["ResourceLimit"],
    }),
  }),
});

export const { useGetResourceLimitQuery } = resourceLimitApi;
export default resourceLimitApi;
