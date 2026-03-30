// src/features/booking/index.ts
// 統一導出 Booking 功能模組的所有內容

// Components
export { default as BookingCreate } from './components/BookingCreate';
export { BookingCalendar } from './components/BookingCalendar';
export { default as BookingHistory } from './pages/BookingHistory';
export { default as BookingDetails } from './pages/BookingDetails';
export { default as BookingDetailLog } from './pages/BookingDetailLog';

// Services
export {
  bookingCalendarApi,
  useGetCalendarQuery,
  useCreateBookingMutation,
} from './services/bookingCalendarServices';
export type {
  CalendarQueryParams,
  CreateBookingRequest,
} from './services/bookingCalendarServices';

// Types
export type { BookingTask, BookingStatus, CalendarRecord, FilterState } from './types/booking.types';
export type { BookingDetailRecord } from './types/booking-detail.types';

// Booking History API
export { useGetBookingDetailQuery } from './api/bookingHistoryApi';
