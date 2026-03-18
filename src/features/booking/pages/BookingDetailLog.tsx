import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Spin } from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  DownloadOutlined,
  HourglassOutlined,
  Loading3QuartersOutlined,
  PauseOutlined,
  ReloadOutlined,
  StopFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import SidebarLayout from "@shared/layouts/SidebarLayout";
import {
  useGetContainerLogQuery,
  useGetContainerStatusQuery,
} from "../api/bookingHistoryApi";

const STATUS_ICON: Record<string, React.ReactNode> = {
  pending: <HourglassOutlined className="text-sm text-gray-500" />,
  running: <Loading3QuartersOutlined spin className="text-sm text-gray-500" />,
  paused: <PauseOutlined className="text-sm text-gray-500" />,
  stopped: <StopFilled className="text-sm text-gray-500" />,
  terminated: <StopFilled className="text-sm text-gray-500" />,
};

function formatElapsed(totalSeconds: number): string {
  if (totalSeconds < 0) return "0:00:00";
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${hours}:${pad(mins)}:${pad(secs)}`;
}

function useElapsedTime(startAt: string | undefined): string {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    if (!startAt) {
      setElapsed("");
      return;
    }

    const calculate = () => {
      const diffSec = dayjs().diff(dayjs(startAt), "second");
      setElapsed(formatElapsed(diffSec));
    };

    calculate();
    const timer = setInterval(calculate, 1000);

    return () => clearInterval(timer);
  }, [startAt]);

  return elapsed;
}

export default function BookingDetailLog(): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: containerStatus } = useGetContainerStatusQuery(id!, {
    skip: !id,
    pollingInterval: 30000,
  });

  const {
    data: logData,
    isLoading: logLoading,
    refetch,
  } = useGetContainerLogQuery(id!, { skip: !id });

  // TODO: 移除 fallback — 等 container_status API 就緒後刪除下方 FALLBACK 區塊
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

  const handleExport = () => {
    const content = logData?.log ?? "";
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `booking-${id}-container.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
        {
          title: "View Log",
        },
      ]}
    >
      <div className="w-full min-h-screen bg-gray-100">
        {/* Header */}
        <div className="flex items-center gap-4 px-6 pt-6 md:px-8">
          <button
            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-blue-400 transition-colors"
            aria-label="Go back"
            onClick={() => navigate(`/booking/history/${id}`)}
          >
            <ArrowLeftOutlined className="text-xl" />
          </button>
          <h1 className="text-2xl font-bold text-gray-500 leading-6">
            View Log
          </h1>

          {/* Status bar */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-base font-medium text-gray-500">Status</span>
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
          </div>
        </div>

        {/* Info Alert */}
        <div className="px-6 pt-5 md:px-8">
          <Alert
            message="This is a read-only view of the container log. Use Refresh to fetch the latest log or Export to download."
            type="info"
            closable
            banner
          />
        </div>

        {/* Docker Log Card */}
        <div className="px-6 pt-5 pb-8 md:px-8">
          <section className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium text-second-blue-400 leading-5">
                Docker Log
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => refetch()}
                >
                  Refresh
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                >
                  Export
                </Button>
              </div>
            </div>

            {logLoading ? (
              <div className="flex items-center justify-center h-96 bg-gray-900 rounded">
                <Spin size="large" />
              </div>
            ) : (
              <pre className="bg-gray-900 text-green-400 text-sm font-mono p-4 rounded min-h-[24rem] max-h-[36rem] overflow-auto whitespace-pre-wrap break-all">
                {logData?.log || "No log available."}
              </pre>
            )}
          </section>
        </div>
      </div>
    </SidebarLayout>
  );
}
