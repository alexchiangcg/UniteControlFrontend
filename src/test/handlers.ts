/**
 * MSW HTTP Request Handlers for Testing
 */

import { http, HttpResponse } from 'msw'
import { mockUsersResponse } from '@features/maintainer-manager/test/mockData'
import type { BookingTask } from '@features/booking/types/booking.types'
import type { BookingHistoryRecord } from '@features/booking/types/booking-history.types'

// Mock Booking Calendar Data - 符合 Figma 設計
const mockBookings: BookingTask[] = [
  {
    id: '1',
    resourceName: 'Robert08000',
    startTime: '2025-12-14T02:00:00Z',
    endTime: '2025-12-14T10:00:00Z',
    status: 'running',
    dataRoom: 'Data room Left',
    utilization: {
      leftCapacity: '5%',
      bookingStatus: 'Booking Now',
    },
    server: {
      name: 'Robert0808',
      type: 'analytics',
      gpu: 20,
      dataUsed: 60,
    },
  },
  {
    id: '2',
    resourceName: 'Robert08001',
    startTime: '2025-12-14T04:00:00Z',
    endTime: '2025-12-14T08:00:00Z',
    status: 'pending',
    dataRoom: 'Data room Left',
    utilization: {
      leftCapacity: '10%',
      bookingStatus: 'Pending',
    },
    server: {
      name: 'Robert0809',
      type: 'analytics',
      gpu: 20,
      dataUsed: 45,
    },
  },
  {
    id: '3',
    resourceName: 'Robert08002',
    startTime: '2025-12-14T01:00:00Z',
    endTime: '2025-12-14T12:00:00Z',
    status: 'running',
    dataRoom: 'Data room Left',
    utilization: {
      leftCapacity: '3%',
      bookingStatus: 'Booking Now',
    },
    server: {
      name: 'Robert0810',
      type: 'analytics',
      gpu: 20,
      dataUsed: 75,
    },
  },
  {
    id: '4',
    resourceName: 'Robert08003',
    startTime: '2025-12-14T06:00:00Z',
    endTime: '2025-12-14T11:00:00Z',
    status: 'overlap',
    dataRoom: 'Data room Left',
    utilization: {
      leftCapacity: '0%',
      bookingStatus: 'Overlap Detected',
    },
    server: {
      name: 'Robert0811',
      type: 'analytics',
      gpu: 20,
      dataUsed: 90,
    },
  },
];

// Mock Booking History Data - 用於測試預訂歷史頁面
const mockBookingHistory: BookingHistoryRecord[] = [
  {
    start: '2025-08-09 09:00',
    end: '2025-08-14 09:00',
    user_id: 'Robert0808',
    image: 'worker-jobs',
    status: 'Running',
  },
  {
    start: '2025-08-29 09:00',
    end: '2025-08-30 18:00',
    user_id: 'Robert',
    image: 'app-backend',
    status: 'Pending',
  },
  {
    start: '2025-09-01 10:00',
    end: '2025-09-05 18:00',
    user_id: 'Alice2024',
    image: 'data-processor',
    status: 'Terminated',
  },
  {
    start: '2025-09-10 08:00',
    end: '2025-09-15 20:00',
    user_id: 'Bob123',
    image: 'ml-training',
    status: 'Pending',
  },
  {
    start: '2025-09-20 06:00',
    end: '2025-09-25 22:00',
    user_id: 'Charlie999',
    image: 'api-server',
    status: 'Running',
  },
];

export const handlers = [
  // GET /bookings/history - 取得預訂歷史記錄（對齊後端 BookingHistoryQuery）
  http.get('http://140.118.49.22:30000/bookings/history', ({ request }) => {
    const url = new URL(request.url);
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const paginatedRecords = mockBookingHistory.slice(offset, offset + limit);

    return HttpResponse.json({
      error_code: '00000',
      data: {
        booking_histories: paginatedRecords,
      }
    })
  }),

  // GET /api/bookings - 取得預約資料
  http.get('http://140.118.49.22:30000/api/bookings', () => {
    return HttpResponse.json({
      error_code: '00000',
      data: mockBookings
    })
  }),
  // GET /api/users - 取得使用者列表
  http.get('http://140.118.49.22:30000/api/users', () => {
    return HttpResponse.json({
      error_code: '00000',
      data: mockUsersResponse
    })
  }),

  // PATCH /api/users/:id/status - 更新使用者狀態
  http.patch('http://140.118.49.22:30000/api/users/:id/status', async ({ params, request }) => {
    const { id } = params
    const body = await request.json() as { status: string }

    const user = mockUsersResponse.users.find(u => u.id === id)
    if (!user) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json({
      error_code: '00000',
      data: {
        ...user,
        status: body.status,
        updatedAt: new Date().toISOString(),
      }
    })
  }),

  // DELETE /api/users/:id - 歸檔使用者
  http.delete('http://140.118.49.22:3000/api/users/:id', ({ params }) => {
    const { id } = params
    const user = mockUsersResponse.users.find(u => u.id === id)

    if (!user) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json({
      error_code: '00000',
      data: null
    }, { status: 200 })
  }),
]