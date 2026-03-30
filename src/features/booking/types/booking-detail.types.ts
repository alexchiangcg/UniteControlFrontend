export interface ForwardPort {
  host_port: number | string;
  container_port: number | string;
}

export interface Volume {
  group: string;
  path: string;
}

export interface ContainerStatusResponse {
  status: string;
  start_at: string;
}

export interface ContainerLogResponse {
  logs: string;
}

/**
 * 預約詳細資料（對齊後端 BookingDetailResponse）
 */
export interface BookingDetailRecord {
  booking_id: string;
  start: string;
  end: string;
  user_id: string;
  cpus: number;
  memory: number;
  gpus: number[];
  forward_ports: ForwardPort[];
  image: string | null;
  extra_command: string | null;
}
