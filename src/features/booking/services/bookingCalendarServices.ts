/**
 * Booking Calendar Services
 * 
 * RTK Query API endpoints for Booking Calendar功能
 * 使用 baseQueryWithErrorHandler 統一處理錯誤
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithErrorHandler from '@shared/services/baseQueryWithErrorHandler';
import type { BookingTask } from '../types/booking.types';

/**
 * Booking Calendar API
 */
export const bookingCalendarApi = createApi({
  reducerPath: 'bookingCalendarApi',
  baseQuery: baseQueryWithErrorHandler,
  tagTypes: ['Booking'],
  endpoints: (builder) => ({
    /**
     * 獲取所有預約資料
     */
    getBookings: builder.query<BookingTask[], void>({
      query: () => '/api/bookings',
      providesTags: ['Booking'],
      // baseQueryWithErrorHandler 已提取 data,這裡直接使用
      transformResponse: (response: BookingTask[]) => response || [],
    }),
  }),
});

/**
 * Auto-generated hooks
 */
export const { useGetBookingsQuery } = bookingCalendarApi;
