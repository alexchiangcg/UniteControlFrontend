/**
 * Booking Calendar Services
 *
 * RTK Query API endpoints for Booking Calendar功能
 * 使用 baseQueryWithErrorHandler 統一處理錯誤
 */

import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithErrorHandler from "@shared/services/baseQueryWithErrorHandler";
import type { BookingTask } from "../types/booking.types";

/**
 * 行事曆查詢參數
 * 對應 swagger: GET /calendar 的 query parameters
 */
export interface CalendarQueryParams {
  /** 開始時間 (ISO 8601 格式) */
  start_time: string;
  /** 結束時間 (ISO 8601 格式) */
  end_time: string;
  /** 排序方法，預設為 'start' */
  sort?: string;
}

/**
 * 建立預約請求介面
 * 對應 swagger: UserBookingRequest
 */
export interface CreateBookingRequest {
  /** 開始時間 (ISO 8601 date-time) */
  start_time: string;
  /** 結束時間 (ISO 8601 date-time) */
  end_time: string;
  /** 節點 ID */
  node_id: string;
  /** Docker Image 名稱 */
  image: string;
  /** CPU 數量 */
  cpus: number;
  /** 記憶體大小 (MB) */
  memory: number;
  /** GPU 數量 */
  gpus: number;
  /** 是否允許重疊 */
  allow_overlap: boolean | null;
  /** Port 轉發設定 */
  forward_ports: Array<Record<string, number | string>>;
  /** Volume 掛載設定 [[host_path, container_path], ...] */
  volumes: Array<[string, string]> | null;
}

type CreateBookingResponse = Record<string, never>;

/**
 * Booking Calendar API
 */
export const bookingCalendarApi = createApi({
  reducerPath: "bookingCalendarApi",
  baseQuery: baseQueryWithErrorHandler,
  tagTypes: ["Booking", "Calendar"],
  endpoints: (builder) => ({
    /**
     * 獲取行事曆資料
     * GET /calendar
     */
    getCalendar: builder.query<BookingTask[], CalendarQueryParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        queryParams.append("start_time", params.start_time);
        queryParams.append("end_time", params.end_time);
        if (params.sort) {
          queryParams.append("sort", params.sort);
        }
        return {
          url: `/calendar?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Calendar"],
      transformResponse: (response: BookingTask[]) => response || [],
    }),

    /**
     * 建立新的預約
     * POST /bookings
     */
    createBooking: builder.mutation<CreateBookingResponse, CreateBookingRequest>({
      query: (body) => ({
        url: "/bookings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Booking", "Calendar"],
    }),

    /**
     * 獲取所有預約資料 (舊版 API，保留相容性)
     * @deprecated 請使用 getCalendar
     */
    getBookings: builder.query<BookingTask[], void>({
      query: () => "/api/bookings",
      providesTags: ["Booking"],
      transformResponse: (response: BookingTask[]) => response || [],
    }),
  }),
});

/**
 * Auto-generated hooks
 */
export const {
  useGetCalendarQuery,
  useCreateBookingMutation,
  useGetBookingsQuery,
} = bookingCalendarApi;
