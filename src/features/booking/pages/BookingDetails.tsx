import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Select, DatePicker, Button, Spin } from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  FileTextOutlined,
  DownOutlined,
  HourglassOutlined,
  Loading3QuartersOutlined,
  PauseOutlined,
  StopFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import SidebarLayout from "@shared/layouts/SidebarLayout";
import {
  useGetBookingDetailQuery,
  useGetContainerStatusQuery,
} from "../api/bookingHistoryApi";
import { useElapsedTime } from "@shared/hooks/useElapsedTime";

const STATUS_ICON: Record<string, React.ReactNode> = {
  pending: <HourglassOutlined className="text-sm text-gray-500" />,
  running: <Loading3QuartersOutlined spin className="text-sm text-gray-500" />,
  paused: <PauseOutlined className="text-sm text-gray-500" />,
  stopped: <StopFilled className="text-sm text-gray-500" />,
  terminated: <StopFilled className="text-sm text-gray-500" />,
};

const { TextArea } = Input;

export default function BookingDetails(): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();

  const { data, isLoading } = useGetBookingDetailQuery(id!, { skip: !id });
  const { data: containerStatus } = useGetContainerStatusQuery(id!, {
    skip: !id,
    pollingInterval: 30000, // 每 30 秒輪詢最新狀態
  });

  // TODO: 移除 fallback — 等後端 container_status API 補上 start_at 後刪除此區塊
  // --- FALLBACK START ---
  const fallbackStartAt = useMemo(
    () => dayjs().subtract(2, "hour").subtract(37, "minute").toISOString(),
    [],
  );
  const fallbackStatus = { status: "running", start_at: fallbackStartAt };
  const resolvedContainerStatus = containerStatus ?? fallbackStatus;
  // --- FALLBACK END ---

  const elapsed = useElapsedTime(resolvedContainerStatus.start_at);
  const liveStatus = resolvedContainerStatus.status;

  useEffect(() => {
    if (!data) return;

    form.setFieldsValue({
      startTime: dayjs(data.start),
      endTime: dayjs(data.end),
      userId: data.user_id,
      cpu: String(data.cpus),
      mem: String(data.memory),
      gpus: data.gpus?.join(", ") ?? "",
      image: data.image,
      extraCommand: data.extra_command ?? "",
      forwardPorts:
        data.forward_ports?.map((p) => ({
          host_port: String(p.host_port),
          container_port: String(p.container_port),
        })) ?? [],
    });
  }, [data, form]);

  return (
    <SidebarLayout
      activeId="history"
      breadcrumbItems={[
        {
          title: (
            <>
              <CalendarOutlined />
              <span>Booking</span>
            </>
          ),
        },
        {
          title: "Booking Details",
        },
      ]}
    >
      <div className="w-full min-h-screen bg-gray-100">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-4 px-6 pt-6 md:px-8">
              <button
                className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-blue-400 transition-colors"
                aria-label="Go back"
                onClick={() => navigate(-1)}
              >
                <ArrowLeftOutlined className="text-xl" />
              </button>
              <h1 className="text-2xl font-bold text-gray-500 leading-6">
                {data?.booking_id
                  ? `${data.booking_id} Booking Details`
                  : "Booking Details"}
              </h1>

              {/* Status bar — 即時狀態 + 計時 */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-base font-medium text-gray-500">
                  Status
                </span>
                <div className="flex items-center h-7 rounded overflow-hidden bg-white">
                  <div className="flex items-center gap-1 px-3 h-full bg-blue-100 rounded-l">
                    {liveStatus && STATUS_ICON[liveStatus]}
                    <span className="text-sm text-gray-500">
                      {liveStatus
                        ? liveStatus.charAt(0).toUpperCase() +
                          liveStatus.slice(1)
                        : ""}
                    </span>
                  </div>
                  {elapsed && (
                    <span className="w-20 px-3 text-sm text-gray-500 text-center tabular-nums">
                      {elapsed}
                    </span>
                  )}
                </div>
                <Button
                  icon={<FileTextOutlined />}
                  className="ml-2"
                  onClick={() => navigate(`/booking/history/${id}/log`)}
                >
                  View Log
                </Button>
              </div>
            </div>

            {/* Form (all disabled) */}
            <Form
              form={form}
              layout="vertical"
              disabled
              className="px-6 pt-5 pb-8 md:px-8"
            >
              {/* Basic Settings */}
              <section className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-xl font-medium text-second-blue-400 leading-5 mb-6">
                  Basic Settings
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {/* User ID */}
                  <Form.Item
                    label={
                      <span>
                        <span className="text-error mr-1">*</span>User ID
                      </span>
                    }
                    name="userId"
                  >
                    <Input />
                  </Form.Item>

                  {/* Time Slot */}
                  <div className="flex flex-col">
                    <label className="text-base text-gray-500 mb-2">
                      <span className="text-error mr-1">*</span>
                      Time Slot
                    </label>
                    <div className="flex items-start gap-2">
                      <Form.Item name="startTime" className="flex-1 mb-0">
                        <DatePicker
                          showTime
                          format="YYYY-M-DD HH:mm"
                          className="w-full"
                          suffixIcon={
                            <CalendarOutlined className="text-gray-500" />
                          }
                        />
                      </Form.Item>
                      <span className="text-base text-gray-500 leading-8">
                        -
                      </span>
                      <Form.Item name="endTime" className="flex-1 mb-0">
                        <DatePicker
                          showTime
                          format="YYYY-M-DD HH:mm"
                          className="w-full"
                          suffixIcon={
                            <CalendarOutlined className="text-gray-500" />
                          }
                        />
                      </Form.Item>
                    </div>
                  </div>

                  {/* CPU/Mem/GPUs */}
                  <div className="grid grid-cols-3 gap-4">
                    <Form.Item
                      label={
                        <span>
                          <span className="text-error mr-1">*</span>CPU
                        </span>
                      }
                      name="cpu"
                    >
                      <Input className="w-full" />
                    </Form.Item>
                    <Form.Item
                      label={
                        <span>
                          <span className="text-error mr-1">*</span>Mem
                        </span>
                      }
                      name="mem"
                    >
                      <Input suffix="GB" className="w-full" />
                    </Form.Item>
                    <Form.Item
                      label={
                        <span>
                          <span className="text-error mr-1">*</span>GPUs
                        </span>
                      }
                      name="gpus"
                    >
                      <Input className="w-full" />
                    </Form.Item>
                  </div>

                  {/* Image */}
                  <Form.Item
                    label={
                      <span>
                        <span className="text-error mr-1">*</span>Image
                      </span>
                    }
                    name="image"
                  >
                    <Select
                      placeholder="Select Image"
                      suffixIcon={<DownOutlined className="text-gray-500" />}
                    />
                  </Form.Item>

                  {/* Extra command — full width */}
                  <div className="col-span-1 md:col-span-2">
                    <Form.Item label="Extra command" name="extraCommand">
                      <TextArea rows={3} className="w-full" />
                    </Form.Item>
                  </div>
                </div>
              </section>

              {/* Forward Ports Settings */}
              <section className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-xl font-medium text-second-blue-400 leading-5 mb-6">
                  Forward Ports Settings
                </h2>

                <div className="flex flex-col gap-4">
                  <label className="text-base text-gray-500">
                    <span className="text-error mr-1">*</span>
                    Forwardports
                  </label>

                  <Form.List name="forwardPorts">
                    {(fields) => (
                      <>
                        <div className="flex flex-wrap items-center gap-6">
                          {fields.map(({ key, name, ...restField }) => (
                            <div
                              key={key}
                              className="flex items-center gap-2"
                            >
                              <Form.Item
                                {...restField}
                                name={[name, "host_port"]}
                                className="mb-0"
                              >
                                <Input placeholder="Host" className="w-24" />
                              </Form.Item>
                              <span className="text-base text-gray-500">
                                :
                              </span>
                              <Form.Item
                                {...restField}
                                name={[name, "container_port"]}
                                className="mb-0"
                              >
                                <Input
                                  placeholder="Container"
                                  className="w-36"
                                />
                              </Form.Item>
                            </div>
                          ))}
                        </div>
                        {fields.length === 0 && (
                          <span className="text-gray-400">
                            No forward ports configured
                          </span>
                        )}
                      </>
                    )}
                  </Form.List>
                </div>
              </section>
            </Form>
          </>
        )}
      </div>
    </SidebarLayout>
  );
}
