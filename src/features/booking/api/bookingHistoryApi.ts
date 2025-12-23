/**
 * Booking History API Service
 *
 * 使用 RTK Query 建立預訂歷史記錄 API service
 * - 提供統一的 API 呼叫介面
 * - 自動處理快取、重新驗證與錯誤狀態
 * - 支援分頁與多維度篩選
 */

import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithErrorHandler from "@shared/services/baseQueryWithErrorHandler";
import type {
  BookingHistoryFilterParams,
  BookingHistoryResponse,
} from "../types/booking-history.types";

/**
 * Booking History API
 *
 * 定義預訂歷史記錄相關的 API endpoints
 */
export const bookingHistoryApi = createApi({
  reducerPath: "bookingHistoryApi",
  baseQuery: baseQueryWithErrorHandler,
  tagTypes: ["BookingHistory"],
  endpoints: (builder) => ({
    /**
     * 查詢預訂歷史記錄
     *
     * @param {BookingHistoryFilterParams} params - 篩選參數
     * @returns {BookingHistoryResponse} 分頁資料回應
     */
    getBookingHistory: builder.query<
      BookingHistoryResponse,
      BookingHistoryFilterParams
    >({
      query: (params) => {
        // 建立 query parameters（過濾掉 undefined 的值）
        const queryParams = new URLSearchParams();

        if (params.startDate) queryParams.append("startDate", params.startDate);
        if (params.endDate) queryParams.append("endDate", params.endDate);
        if (params.node) queryParams.append("node", params.node);
        if (params.group) queryParams.append("group", params.group);
        if (params.image) queryParams.append("image", params.image);
        if (params.keyword) queryParams.append("keyword", params.keyword);
        queryParams.append("page", params.page.toString());
        queryParams.append("pageSize", params.pageSize.toString());

        return {
          url: `/booking/history?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.records.map(({ id }) => ({
                type: "BookingHistory" as const,
                id,
              })),
              { type: "BookingHistory", id: "LIST" },
            ]
          : [{ type: "BookingHistory", id: "LIST" }],
    }),
  }),
});

/**
 * Export hooks for usage in components
 */
export const { useGetBookingHistoryQuery } = bookingHistoryApi;

export default bookingHistoryApi;
