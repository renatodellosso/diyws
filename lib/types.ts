import {
  ContainerInfo,
  ContainerInspectInfo,
  ContainerStats,
  ImageInfo,
  ImageInspectInfo,
  VolumeInspectInfo,
} from "dockerode";

export type MinimalServerState = {
  followers: FollowerState[];
  services: Service[];
};

export type ServerState = MinimalServerState & {
  containers: ContainerDetails[];
  images: ImageInfo[];
  volumes: VolumeInspectInfo[];
};

export type FollowerState = Follower & LocalFollowerState;

export type LocalFollowerState = {
  dockerRunning: boolean;
  images: ImageInfo[];
  containers: ContainerDetails[];
  volumes: VolumeInspectInfo[];
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
  ip: string;
  id: string;
  name: string;
};

export type FollowerRegistry = {
  [id: string]: Follower;
};
