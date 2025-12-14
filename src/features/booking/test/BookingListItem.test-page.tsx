/**
 * BookingListItem 測試頁面
 * 用於視覺驗證與 Figma 設計的一致性
 */
import { BookingListItem } from "../components/BookingListItem";
import type { BookingTask } from "../types/booking.types";

const mockBookings: BookingTask[] = [
  {
    id: "1",
    resourceName: "Robert0808",
    startTime: "2024-01-01T10:00:00Z",
    endTime: "2024-01-01T12:00:00Z",
    status: "pending",
    dataRoom: "Data room Left",
    utilization: {
      leftCapacity: "5%",
      bookingStatus: "Booking Now",
    },
    server: {
      name: "Robert0808",
      type: "analytics",
      gpu: 20,
      dataUsed: 60,
    },
  },
  {
    id: "2",
    resourceName: "Robert0808",
    startTime: "2024-01-01T13:00:00Z",
    endTime: "2024-01-01T15:00:00Z",
    status: "running",
    dataRoom: "Data room Left",
    utilization: {
      leftCapacity: "5%",
      bookingStatus: "Booking Now",
    },
    server: {
      name: "Robert0808",
      type: "analytics",
      gpu: 20,
      dataUsed: 60,
    },
  },
  {
    id: "3",
    resourceName: "Robert0808",
    startTime: "2024-01-01T16:00:00Z",
    endTime: "2024-01-01T18:00:00Z",
    status: "completed",
    dataRoom: "Data room Left",
    utilization: {
      leftCapacity: "5%",
      bookingStatus: "Booking Now",
    },
    server: {
      name: "Robert0808",
      type: "analytics",
      gpu: 20,
      dataUsed: 60,
    },
  },
  {
    id: "4",
    resourceName: "Robert0808",
    startTime: "2024-01-01T19:00:00Z",
    endTime: "2024-01-01T21:00:00Z",
    status: "overlap",
    dataRoom: "Data room Left",
    utilization: {
      leftCapacity: "5%",
      bookingStatus: "Booking Now",
    },
    server: {
      name: "Robert0808",
      type: "analytics",
      gpu: 20,
      dataUsed: 60,
    },
  },
  {
    id: "5",
    resourceName: "Robert0808",
    startTime: "2024-01-01T22:00:00Z",
    endTime: "2024-01-01T23:00:00Z",
    status: "running",
    dataRoom: "Data room Left",
    utilization: {
      leftCapacity: "5%",
      bookingStatus: "Booking Now",
    },
    server: {
      name: "Robert0808",
      type: "analytics",
      gpu: 20,
      dataUsed: 60,
    },
  },
];

export default function BookingListItemTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-500">
          BookingListItem 組件測試
        </h1>

        <div className="grid grid-cols-2 gap-6">
          {/* Pending 狀態 */}
          <div>
            <h2 className="text-xl font-medium mb-4 text-gray-500">
              Pending 狀態
            </h2>
            <div className="bg-white rounded-lg shadow">
              <BookingListItem
                booking={mockBookings[0]}
                onShowMore={(id) => console.log("Show more:", id)}
              />
            </div>
          </div>

          {/* Running 狀態 */}
          <div>
            <h2 className="text-xl font-medium mb-4 text-gray-500">
              Running 狀態
            </h2>
            <div className="bg-white rounded-lg shadow">
              <BookingListItem
                booking={mockBookings[1]}
                onShowMore={(id) => console.log("Show more:", id)}
              />
            </div>
          </div>

          {/* Completed 狀態 */}
          <div>
            <h2 className="text-xl font-medium mb-4 text-gray-500">
              Completed 狀態
            </h2>
            <div className="bg-white rounded-lg shadow">
              <BookingListItem
                booking={mockBookings[2]}
                onShowMore={(id) => console.log("Show more:", id)}
              />
            </div>
          </div>

          {/* Overlap 狀態（帶 Allowed Overlap tag）*/}
          <div>
            <h2 className="text-xl font-medium mb-4 text-gray-500">
              Overlap 狀態（Pending + 藍色 tag）
            </h2>
            <div className="bg-white rounded-lg shadow">
              <BookingListItem
                booking={mockBookings[3]}
                onShowMore={(id) => console.log("Show more:", id)}
              />
            </div>
          </div>

          {/* Running + Overlap（綠色 tag）*/}
          <div>
            <h2 className="text-xl font-medium mb-4 text-gray-500">
              Running + Overlap（綠色 tag）
            </h2>
            <div className="bg-white rounded-lg shadow">
              <BookingListItem
                booking={mockBookings[4]}
                onShowMore={(id) => console.log("Show more:", id)}
                allowedOverlap={true}
              />
            </div>
          </div>
        </div>

        {/* Figma 參考設計 */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-500">
            Figma 設計規範
          </h2>
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-medium mb-3">Status Badge 規範：</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <strong>Pending:</strong> 黃色背景 (#fff6da)，灰色文字
                (#2e2e2e)
              </li>
              <li>
                <strong>Running:</strong> 藍色背景 (#d8e7f2)，灰色文字
                (#2e2e2e)，進度圓圈圖標
              </li>
              <li>
                <strong>Completed:</strong> 綠色背景 (#e0f4ef)，綠色文字
                (#3fa796)
              </li>
            </ul>
            <h3 className="font-medium mt-4 mb-3">Allowed Overlap Tag 規範：</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <strong>Pending 時：</strong> 白色背景，藍色邊框 (#5a7684)，藍色文字
              </li>
              <li>
                <strong>Running 時：</strong> 白色背景，綠色邊框 (#3fa796)，綠色文字
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
