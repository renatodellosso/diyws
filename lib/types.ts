import {
  ContainerInfo,
  ContainerInspectInfo,
  ContainerStats,
  ImageInfo,
  ImageInspectInfo,
} from "dockerode";

export type ServerState = {
  dockerRunning: boolean;
  images: ImageInfo[];
  containers: ContainerDetails[];
  services: Service[];
  resourceUsage?: ServerResourceUsage;
};

export type ServerResourceUsage = {
  cpuPercent: number[];
  memoryUsageBytes: number;
  memoryLimitBytes: number;
};

export type ServiceConfig = {
  name: string;
  image: string;
  env: Record<string, string>;
  ports: `${number}/${"tcp" | "udp" | "sctp"}`[];
};

export type Service = {
  config: ServiceConfig;
  container?: ContainerInfo | ContainerInspectInfo;
  image?: ImageInfo | ImageInspectInfo;
};

export type ContainerDetails = Omit<
  ContainerInspectInfo,
  keyof ContainerInfo
> & { stats?: ContainerStats } & ContainerInfo;
