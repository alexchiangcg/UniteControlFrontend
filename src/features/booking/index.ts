// src/features/booking/index.ts
// 統一導出 Booking 功能模組的所有內容

// Components
export { default as BookingCreate } from './components/BookingCreate';
export { BookingCalendar } from './components/BookingCalendar';
export { default as BookingHistory } from './pages/BookingHistory';

// Services
export {
  bookingCalendarApi,
  useGetCalendarQuery,
  useCreateBookingMutation,
  useGetBookingsQuery,
} from './services/bookingCalendarServices';
export type {
  CalendarQueryParams,
  CreateBookingRequest,
} from './services/bookingCalendarServices';

// Types
export type { BookingTask, BookingStatus, FilterState } from './types/booking.types';
