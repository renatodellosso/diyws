import {
  ContainerInfo,
  ContainerInspectInfo,
  ContainerStats,
  ImageInfo,
  ImageInspectInfo,
  Volume,
  VolumeInspectInfo,
} from "dockerode";

export type ServerState = {
  dockerRunning: boolean;
  images: ImageInfo[];
  containers: ContainerDetails[];
  volumes: VolumeInspectInfo[];
  services: Service[];
  resourceUsage?: ServerResourceUsage;
};

export type ServerResourceUsage = {
  cpuPercent: number[];
  memoryUsageBytes: number;
  memoryLimitBytes: number;
};

export type PortMapping = {
  containerPort: number;
  hostPort: number;
  protocol: "tcp" | "udp" | "sctp";
};

export type ServiceConfig = {
  name: string;
  image: string;
  env: Record<string, string>;
  ports: PortMapping[];
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
