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

import { useNavigate } from "react-router-dom";
import { Button, Input, Select, Radio, Checkbox, Form, DatePicker } from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  PlusCircleOutlined,
  HomeOutlined,
  DownOutlined,
} from "@ant-design/icons";
import SidebarLayout from "@shared/layouts/SidebarLayout";

const { TextArea } = Input;
const { Option } = Select;

// ============================================================================
// BookingCreate 元件
// ============================================================================

export default function BookingCreate(): JSX.Element {
  const navigate = useNavigate();
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
    <SidebarLayout
      activeId="booking"
      breadcrumbItems={[
        {
          href: "/",
          title: (
            <>
              <HomeOutlined />
            </>
          ),
        },
        {
          title: (
            <>
              <CalendarOutlined />
              <span>Booking</span>
            </>
          ),
        },
        {
          title: "Create Booking",
        },
      ]}
    >
      <div className="w-full min-h-screen bg-gray-100">
        {/* 頁面標題與返回按鈕 */}
        <div className="flex items-center gap-7 px-6 pt-6 md:px-8">
          <button
            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-blue-400 transition-colors"
            aria-label="返回"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftOutlined className="text-xl" />
          </button>
          <h1 className="text-2xl font-bold text-gray-500 leading-6">
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
            <h2 className="text-xl font-medium text-second-blue-400 leading-5 mb-6">
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
                  suffixIcon={<DownOutlined className="text-gray-500" />}
                >
                  <Option value="server1">Server 1</Option>
                  <Option value="server2">Server 2</Option>
                </Select>
              </Form.Item>

              {/* 時間區段 */}
              <div className="flex flex-col min-h-[98px]">
                <label className="text-base text-gray-500 mb-2">
                  <span className="text-error mr-1">*</span>
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
                        <CalendarOutlined className="text-gray-500" />
                      }
                    />
                  </Form.Item>
                  <span className="text-base text-gray-500 leading-8">-</span>
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
                        <CalendarOutlined className="text-gray-500" />
                      }
                    />
                  </Form.Item>
                </div>
              </div>

              {/* 群組設定 */}
              <div className="flex flex-col min-h-[98px]">
                <label className="text-base text-gray-500 mb-2">
                  <span className="text-error mr-1">*</span>
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
                      suffixIcon={<DownOutlined className="text-gray-500" />}
                    >
                      <Option value="config1">Config 1</Option>
                    </Select>
                  </Form.Item>
                  <Button className="bg-blue-400 text-white border-blue-400 hover:bg-blue-500 shrink-0">
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
                  suffixIcon={<DownOutlined className="text-gray-500" />}
                >
                  <Option value="image1">Image 1</Option>
                </Select>
              </Form.Item>

              {/* 允許重疊 */}
              <Form.Item
                label={
                  <span className="flex items-center gap-1">
                    Allow overlap ?
                    <ExclamationCircleOutlined className="text-error ml-1" />
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
            <h2 className="text-xl font-medium text-second-blue-400 leading-5 mb-6">
              Forward Ports Settings
            </h2>

            <div className="flex flex-col gap-4">
              <label className="text-base text-gray-500">
                <span className="text-error mr-1">*</span>
                Forwardports
              </label>

              <div className="flex items-center gap-2">
                <Input placeholder="Host" className="w-44" />
                <span className="text-base text-gray-500">:</span>
                <Input
                  placeholder="Container"
                  className="flex-1 max-w-[296px]"
                />
                <button
                  type="button"
                  className="w-6 h-6 flex items-center justify-center text-blue-400 hover:text-blue-500"
                  aria-label="新增埠對應"
                >
                  <PlusCircleOutlined className="text-xl" />
                </button>
              </div>
            </div>
          </section>

          {/* 磁碟區設定卡片 */}
          <section className="bg-white rounded-lg p-6 mb-6">
            <h2 className="text-xl font-medium text-second-blue-400 leading-5 mb-6">
              Volumes Settings
            </h2>

            <div className="flex flex-col gap-4">
              <label className="text-base text-gray-500">Volumes</label>

              <div className="flex items-center gap-2">
                <Select
                  placeholder="Group"
                  className="w-40"
                  suffixIcon={<DownOutlined className="text-gray-500" />}
                >
                  <Option value="group1">Group 1</Option>
                </Select>
                <Input
                  placeholder="root/g/...."
                  className="flex-1 max-w-[338px]"
                />
                <button
                  type="button"
                  className="w-6 h-6 flex items-center justify-center text-blue-400 hover:text-blue-500"
                  aria-label="新增磁碟區對應"
                >
                  <PlusCircleOutlined className="text-xl" />
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
              className="w-full md:w-44 h-12 bg-blue-100 text-blue-400 border-blue-200 hover:bg-blue-200"
            >
              Cancel
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              className="w-full md:w-44 h-12 bg-blue-400 text-white border-blue-400 hover:bg-blue-500"
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
