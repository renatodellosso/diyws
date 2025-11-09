import {
  ContainerInfo,
  ContainerInspectInfo,
  ContainerStats,
  ImageInfo,
  ImageInspectInfo,
  VolumeInspectInfo,
} from "dockerode";

export type ServerState = {
  followers: Follower[];
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

export type VolumeConfig = {
  volumeName: string;
  containerDestination: string;
};

export type ServiceConfig = {
  name: string;
  image: string;
  env: Record<string, string>;
  ports: PortMapping[];
  volumes: VolumeConfig[];
};

export type Service = {
  config: ServiceConfig;
  container?: ContainerInfo | ContainerInspectInfo;
  image?: ImageInfo | ImageInspectInfo;
  volumes?: VolumeInspectInfo[];
};

export type ContainerDetails = Omit<
  ContainerInspectInfo,
  keyof ContainerInfo
> & { stats?: ContainerStats } & ContainerInfo;

export type Follower = {
  id: string;
  name: string;
};
