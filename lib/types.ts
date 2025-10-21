import {
  ContainerInfo,
  ContainerInspectInfo,
  ContainerStats,
  ImageInfo,
} from "dockerode";

export type ServerState = {
  dockerRunning: boolean;
  images: ImageInfo[];
  containers: ContainerDetails[];
  services: Service[];
};

export type ServiceConfig = {
  name: string;
  image: string;
};

export type Service = {
  config: ServiceConfig;
  container?: ContainerInfo;
  image?: ImageInfo;
};

export type ContainerDetails = Omit<
  ContainerInspectInfo,
  keyof ContainerInfo
> & { stats?: ContainerStats } & ContainerInfo;
