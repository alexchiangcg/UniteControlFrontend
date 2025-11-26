/**
 * MSW HTTP Request Handlers for Testing
 */

import { http, HttpResponse } from 'msw'
import { mockUsersResponse } from '@features/maintainer-manager/test/mockData'

export const handlers = [
  // GET /api/users - 取得使用者列表
  http.get('http://140.118.49.22:3000/api/users', () => {
    return HttpResponse.json({
      error_code: '00000',
      data: mockUsersResponse
    })
  }),

  // PATCH /api/users/:id/status - 更新使用者狀態
  http.patch('http://140.118.49.22:3000/api/users/:id/status', async ({ params, request }) => {
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