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
};

export type ServiceConfig = {
  name: string;
  image: string;
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
