/**
 * BookingCreate 元件
 *
 * 用於建立新預約的頁面，包含完整的表單輸入欄位。
 * 此元件使用 SidebarLayout 提供一致的導航體驗。
 *
 * 表單區段：
 * 1. 基本設定：節點、時間區段、群組設定、CPU/記憶體/GPU、映像檔、允許重疊、額外指令
 * 2. 轉發埠設定：主機:容器埠對應
 * 3. 磁碟區設定：磁碟區群組和路徑對應
 */

import React from "react";
import { Button, Input, Select, Radio, Checkbox, Form, DatePicker } from "antd";
import SidebarLayout from "../../layouts/SidebarLayout";

const { TextArea } = Input;
const { Option } = Select;

// ============================================================================
// 圖示元件
// ============================================================================

const ArrowBackIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
      fill="currentColor"
    />
  </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z"
      fill="currentColor"
    />
  </svg>
);

const ErrorOutlineIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.99999 1.33334C4.31999 1.33334 1.33333 4.32001 1.33333 8.00001C1.33333 11.68 4.31999 14.6667 7.99999 14.6667C11.68 14.6667 14.6667 11.68 14.6667 8.00001C14.6667 4.32001 11.68 1.33334 7.99999 1.33334ZM8.66666 11.3333H7.33333V10H8.66666V11.3333ZM8.66666 8.66668H7.33333V4.66668H8.66666V8.66668Z"
      fill="currentColor"
    />
  </svg>
);

const AddCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z"
      fill="currentColor"
    />
  </svg>
);

const AccountCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"
      fill="currentColor"
    />
  </svg>
);

// ============================================================================
// BookingCreate 元件
// ============================================================================

export default function BookingCreate(): JSX.Element {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log("表單數值:", values);
  };

  const handleCancel = () => {
    form.resetFields();
  };

  // 取得 startTime 的值
  const startTime = Form.useWatch("startTime", form);

  // 禁用過去的日期時間
  const disabledDate = (current: any) => {
    return current && current < Date.now();
  };

  // endTime 不能早於 startTime 的日期
  const disabledEndDate = (current: any) => {
    if (!current) return false;
    // 禁用過去的日期
    if (current < Date.now()) return true;
    // 如果有 startTime，禁用早於 startTime 的日期（不含當天）
    if (startTime) {
      const startDate = startTime.startOf("day");
      const currentDate = current.startOf("day");
      return currentDate < startDate;
    }
    return false;
  };

  // endTime 在同一天時，禁用早於 startTime 的時間
  const disabledEndTime = (current: any) => {
    if (!startTime || !current) return {};

    // 檢查是否為同一天
    const isSameDay = current.isSame(startTime, "day");
    if (!isSameDay) return {};

    const startHour = startTime.hour();
    const startMinute = startTime.minute();

    return {
      disabledHours: () => {
        // 禁用所有早於 startTime 的小時
        return Array.from({ length: startHour }, (_, i) => i);
      },
      disabledMinutes: (selectedHour: number) => {
        // 如果選擇的小時等於 startTime 的小時，禁用早於 startTime 的分鐘
        if (selectedHour === startHour) {
          return Array.from({ length: startMinute }, (_, i) => i);
        }
        return [];
      },
      disabledSeconds: () => [],
    };
  };

  return (
    <SidebarLayout activeId="booking">
      <div className="w-full min-h-screen bg-[#f5f7f9]">
        {/* 頂部列 - 麵包屑和使用者資訊 */}
        <div className="flex items-center justify-between px-6 pt-6 md:px-8 md:pt-8">
          <p className="text-sm font-medium text-[#6b7280] leading-[14px]">
            Booking / Create Booking
          </p>
          <div className="flex items-center gap-2">
            <AccountCircleIcon className="w-6 h-6 text-[#2e2e2e]" />
            <p className="text-base font-medium text-[#2e2e2e] leading-4">
              Admin
            </p>
          </div>
        </div>

        {/* 頁面標題與返回按鈕 */}
        <div className="flex items-center gap-7 px-6 pt-6 md:px-8">
          <button
            className="w-6 h-6 flex items-center justify-center text-[#2e2e2e] hover:text-[#2f6f9f] transition-colors"
            aria-label="返回"
          >
            <ArrowBackIcon className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-[#2e2e2e] leading-6">
            Create Booking
          </h1>
        </div>

        {/* 主要表單 */}
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          className="px-6 pt-5 pb-8 md:px-8"
        >
          {/* 基本設定卡片 */}
          <section className="bg-white rounded-lg p-6 mb-6">
            <h2 className="text-xl font-medium text-[#5a7684] leading-5 mb-6">
              Basic Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {/* 節點選擇 */}
              <Form.Item
                label="Node"
                name="node"
                rules={[{ required: true, message: "Please select a node" }]}
              >
                <Select
                  placeholder="Select Server"
                  className="w-full"
                  suffixIcon={
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 10L12 15L17 10H7Z" fill="#2e2e2e" />
                    </svg>
                  }
                >
                  <Option value="server1">Server 1</Option>
                  <Option value="server2">Server 2</Option>
                </Select>
              </Form.Item>

              {/* 時間區段 */}
              <div className="flex flex-col min-h-[98px]">
                <label className="text-base text-[#2e2e2e] mb-2">
                  <span className="text-[#ff4d4f] mr-1">*</span>
                  Time Slot
                </label>
                <div className="flex items-start gap-2">
                  <Form.Item
                    name="startTime"
                    rules={[{ required: true, message: "請選擇開始時間" }]}
                    className="flex-1 mb-0"
                  >
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm"
                      placeholder="開始時間"
                      className="w-full"
                      disabledDate={disabledDate}
                      suffixIcon={
                        <CalendarIcon className="w-6 h-6 text-[#2e2e2e]" />
                      }
                    />
                  </Form.Item>
                  <span className="text-base text-[#2e2e2e] leading-8">-</span>
                  <Form.Item
                    name="endTime"
                    rules={[{ required: true, message: "請選擇結束時間" }]}
                    className="flex-1 mb-0"
                  >
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm"
                      placeholder="結束時間"
                      className="w-full"
                      disabledDate={disabledEndDate}
                      disabledTime={disabledEndTime}
                      suffixIcon={
                        <CalendarIcon className="w-6 h-6 text-[#2e2e2e]" />
                      }
                    />
                  </Form.Item>
                </div>
              </div>

              {/* 群組設定 */}
              <div className="flex flex-col min-h-[98px]">
                <label className="text-base text-[#2e2e2e] mb-2">
                  <span className="text-[#ff4d4f] mr-1">*</span>
                  Group Config
                </label>
                <div className="flex items-start gap-2">
                  <Form.Item
                    name="groupConfig"
                    rules={[
                      { required: true, message: "Please select group config" },
                    ]}
                    className="flex-1 mb-0"
                  >
                    <Select
                      placeholder="Select Group Config"
                      suffixIcon={
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M7 10L12 15L17 10H7Z" fill="#2e2e2e" />
                        </svg>
                      }
                    >
                      <Option value="config1">Config 1</Option>
                    </Select>
                  </Form.Item>
                  <Button className="bg-[#2f6f9f] text-white border-[#2f6f9f] hover:bg-[#25597f] shrink-0">
                    Own config
                  </Button>
                </div>
              </div>

              {/* CPU、記憶體、GPU - 桌面版三欄式 */}
              <div className="col-span-1 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* CPU */}
                  <Form.Item
                    label="CPU"
                    name="cpu"
                    rules={[{ required: true, message: "Please input CPU" }]}
                    help="CPU max 32"
                  >
                    <Input placeholder="0" className="w-full" />
                  </Form.Item>

                  {/* 記憶體 */}
                  <Form.Item
                    label="Mem"
                    name="mem"
                    rules={[{ required: true, message: "Please input memory" }]}
                    help="Mem max 64"
                  >
                    <Input placeholder="0" suffix="GB" className="w-full" />
                  </Form.Item>

                  {/* GPU */}
                  <Form.Item
                    label="GPUs"
                    name="gpus"
                    rules={[{ required: true, message: "Please input GPUs" }]}
                    help="GPUs max 4"
                  >
                    <Input placeholder="0" className="w-full" />
                  </Form.Item>
                </div>
              </div>

              {/* 映像檔選擇 */}
              <Form.Item
                label="Image"
                name="image"
                rules={[{ required: true, message: "Please select an image" }]}
              >
                <Select
                  placeholder="Select Image"
                  suffixIcon={
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 10L12 15L17 10H7Z" fill="#2e2e2e" />
                    </svg>
                  }
                >
                  <Option value="image1">Image 1</Option>
                </Select>
              </Form.Item>

              {/* 允許重疊 */}
              <Form.Item
                label={
                  <span className="flex items-center gap-1">
                    Allow overlap ?
                    <ErrorOutlineIcon className="w-4 h-4 text-[#e85d75] ml-1" />
                  </span>
                }
                name="allowOverlap"
                rules={[{ required: true, message: "Please select an option" }]}
              >
                <Radio.Group>
                  <Radio value="no">No</Radio>
                  <Radio value="yes">Yes</Radio>
                </Radio.Group>
              </Form.Item>

              {/* 額外指令 - 全寬 */}
              <div className="col-span-1 md:col-span-2">
                <Form.Item label="Extra command" name="extraCommand">
                  <TextArea
                    placeholder="Type something"
                    rows={3}
                    className="w-full"
                  />
                </Form.Item>
              </div>
            </div>
          </section>

          {/* 轉發埠設定卡片 */}
          <section className="bg-white rounded-lg p-6 mb-6">
            <h2 className="text-xl font-medium text-[#5a7684] leading-5 mb-6">
              Forward Ports Settings
            </h2>

            <div className="flex flex-col gap-4">
              <label className="text-base text-[#2e2e2e]">
                <span className="text-[#ff4d4f] mr-1">*</span>
                Forwardports
              </label>

              <div className="flex items-center gap-2">
                <Input placeholder="Host" className="w-44" />
                <span className="text-base text-[#2e2e2e]">:</span>
                <Input
                  placeholder="Container"
                  className="flex-1 max-w-[296px]"
                />
                <button
                  type="button"
                  className="w-6 h-6 flex items-center justify-center text-[#2f6f9f] hover:text-[#25597f]"
                  aria-label="新增埠對應"
                >
                  <AddCircleIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </section>

          {/* 磁碟區設定卡片 */}
          <section className="bg-white rounded-lg p-6 mb-6">
            <h2 className="text-xl font-medium text-[#5a7684] leading-5 mb-6">
              Volumes Settings
            </h2>

            <div className="flex flex-col gap-4">
              <label className="text-base text-[#2e2e2e]">Volumes</label>

              <div className="flex items-center gap-2">
                <Select
                  placeholder="Group"
                  className="w-40"
                  suffixIcon={
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 10L12 15L17 10H7Z" fill="#2e2e2e" />
                    </svg>
                  }
                >
                  <Option value="group1">Group 1</Option>
                </Select>
                <Input
                  placeholder="root/g/...."
                  className="flex-1 max-w-[338px]"
                />
                <button
                  type="button"
                  className="w-6 h-6 flex items-center justify-center text-[#2f6f9f] hover:text-[#25597f]"
                  aria-label="新增磁碟區對應"
                >
                  <AddCircleIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </section>

          {/* 操作按鈕 */}
          <div className="flex flex-col md:flex-row items-center justify-end gap-3 pt-4">
            <Form.Item
              name="changeDefaultConfig"
              valuePropName="checked"
              className="md:mr-auto mb-0"
            >
              <Checkbox>Change the default config</Checkbox>
            </Form.Item>

            <Button
              onClick={handleCancel}
              className="w-full md:w-44 h-12 bg-[#d8e7f2] text-[#2f6f9f] border-[#afcbe1] hover:bg-[#c5dce9]"
            >
              Cancel
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              className="w-full md:w-44 h-12 bg-[#2f6f9f] text-white border-[#2f6f9f] hover:bg-[#25597f]"
            >
              Confirm & Book
            </Button>
          </div>
        </Form>
      </div>
    </SidebarLayout>
  );
}

/**
 * ============================================================================
 * 響應式 Tailwind Class 建議（md 斷點 768px）
 * ============================================================================
 *
 * 容器：
 * - 手機版：px-6 pt-6（較小邊距）
 * - 桌面版：md:px-8 md:pt-8（較大邊距）
 *
 * 表單網格佈局：
 * - 手機版：grid-cols-1（單欄堆疊）
 * - 桌面版：md:grid-cols-2（雙欄並排）
 *
 * CPU/記憶體/GPU 列：
 * - 手機版：grid-cols-1（垂直堆疊）
 * - 桌面版：md:grid-cols-3（三欄並排）
 *
 * 操作按鈕：
 * - 手機版：flex-col w-full（堆疊排列，全寬）
 * - 桌面版：md:flex-row md:w-44（水平排列，固定寬度）
 *
 * 側邊欄整合：
 * - 手機版：內容全寬，側邊欄在抽屜中
 * - 桌面版：內容有固定左側邊距以容納側邊欄
 *
 * 主要內容邊距：
 * - 手機版：px-6（左右各 16px）
 * - 桌面版：md:px-8（左右各 24px）
 */
