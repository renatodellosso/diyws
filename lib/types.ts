import { ContainerInfo, ImageInfo } from "dockerode";

export type ServerState = {
  dockerRunning: boolean;
  images: ImageInfo[];
  containers: ContainerInfo[];
};
