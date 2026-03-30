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
import type {
  BookingDetailRecord,
  ContainerLogResponse,
  ContainerStatusResponse,
} from "../types/booking-detail.types";

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
     * @param {BookingHistoryFilterParams} params - 篩選參數（對齊後端 BookingHistoryQuery）
     * @returns {BookingHistoryResponse} 分頁資料回應
     */
    getBookingHistory: builder.query<
      BookingHistoryResponse,
      BookingHistoryFilterParams
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        queryParams.append("start_time", params.start_time);
        queryParams.append("end_time", params.end_time);
        if (params.image_id) queryParams.append("image_id", params.image_id);
        if (params.user_id) queryParams.append("user_id", params.user_id);
        if (params.offset != null)
          queryParams.append("offset", params.offset.toString());
        if (params.limit != null)
          queryParams.append("limit", params.limit.toString());

        return {
          url: `/bookings/history?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "BookingHistory", id: "LIST" }],
    }),

    /**
     * 查詢單筆預約詳細資料（對齊後端 GET /bookings/{booking_id}）
     */
    getBookingDetail: builder.query<BookingDetailRecord, string>({
      query: (id) => `/bookings/${id}`,
      providesTags: (_result, _error, id) => [{ type: "BookingHistory", id }],
    }),

    getContainerStatus: builder.query<ContainerStatusResponse, string>({
      query: (bookingId) => `/bookings/${bookingId}/container_status`,
    }),

    getContainerLog: builder.query<ContainerLogResponse, string>({
      query: (bookingId) => `/bookings/${bookingId}/log`,
    }),
  }),
});

/**
 * Export hooks for usage in components
 */
export const {
  useGetBookingHistoryQuery,
  useGetBookingDetailQuery,
  useGetContainerStatusQuery,
  useGetContainerLogQuery,
} = bookingHistoryApi;

export default bookingHistoryApi;
