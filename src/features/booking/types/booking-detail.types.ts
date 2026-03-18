import type { BookingHistoryRecord } from "./booking-history.types";

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
  log: string;
}

export interface BookingDetailRecord extends BookingHistoryRecord {
  groupConfig: string;
  cpus: number;
  memory: number;
  gpus: number;
  allowOverlap: boolean;
  extraCommand: string | null;
  forwardPorts: ForwardPort[];
  volumes: Volume[] | null;
}
