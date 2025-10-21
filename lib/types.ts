import { ContainerInfo, ImageInfo } from "dockerode";

export type ServerState = {
  dockerRunning: boolean;
  images: ImageInfo[];
  containers: ContainerInfo[];
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
