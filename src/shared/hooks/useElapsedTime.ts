import { useEffect, useState } from "react";
import dayjs from "dayjs";

/**
 * 格式化已過時間（秒數 → H:MM:SS）
 */
function formatElapsed(totalSeconds: number): string {
  if (totalSeconds < 0) return "0:00:00";
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${hours}:${pad(mins)}:${pad(secs)}`;
}

/**
 * 即時計時 hook：根據 start_at 每秒更新已過時間
 */
export function useElapsedTime(startAt: string | undefined): string {
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
