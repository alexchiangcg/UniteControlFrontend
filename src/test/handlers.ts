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
    id: '1',
    bookingId: '#20250810001',
    node: '10.0.1.11',
    image: 'worker-jobs',
    group: 'analytics',
    account: 'Robert0808',
    startTime: '2025-08-09T09:00:00Z',
    endTime: '2025-08-14T09:00:00Z',
    overlapStatus: 'not-allowed',
    status: 'running',
  },
  {
    id: '2',
    bookingId: '#20250810002',
    node: '10.0.1.11',
    image: 'app-backend',
    group: 'analytics',
    account: 'Robert',
    startTime: '2025-08-29T09:00:00Z',
    endTime: '2025-08-30T24:00:00Z',
    overlapStatus: 'allowed',
    status: 'pending',
  },
  {
    id: '3',
    bookingId: '#20250810003',
    node: '10.0.1.12',
    image: 'data-processor',
    group: 'development',
    account: 'Alice2024',
    startTime: '2025-09-01T10:00:00Z',
    endTime: '2025-09-05T18:00:00Z',
    overlapStatus: 'allowed',
    status: 'terminated',
  },
  {
    id: '4',
    bookingId: '#20250810004',
    node: '10.0.1.13',
    image: 'ml-training',
    group: 'production',
    account: 'Bob123',
    startTime: '2025-09-10T08:00:00Z',
    endTime: '2025-09-15T20:00:00Z',
    overlapStatus: 'not-allowed',
    status: 'paused',
  },
  {
    id: '5',
    bookingId: '#20250810005',
    node: '10.0.1.11',
    image: 'api-server',
    group: 'production',
    account: 'Charlie999',
    startTime: '2025-09-20T06:00:00Z',
    endTime: '2025-09-25T22:00:00Z',
    overlapStatus: 'allowed',
    status: 'running',
  },
];

export const handlers = [
  // GET /booking/history - 取得預訂歷史記錄
  http.get('http://140.118.49.22:30000/booking/history', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');

    // 簡單的分頁邏輯
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRecords = mockBookingHistory.slice(startIndex, endIndex);

    return HttpResponse.json({
      error_code: '00000',
      data: {
        records: paginatedRecords,
        total: mockBookingHistory.length,
        page,
        pageSize,
        totalPages: Math.ceil(mockBookingHistory.length / pageSize),
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