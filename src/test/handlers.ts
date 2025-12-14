/**
 * MSW HTTP Request Handlers for Testing
 */

import { http, HttpResponse } from 'msw'
import { mockUsersResponse } from '@features/maintainer-manager/test/mockData'
import type { BookingTask } from '@features/booking/types/booking.types'

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

export const handlers = [
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