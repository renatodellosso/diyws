import { ContainerInfo, ImageInfo } from "dockerode";
import dockerService from "./dockerService";
import { ServiceConfig, Service, ContainerDetails } from "./types";

export function populateServices(
  services: ServiceConfig[],
  containers: ContainerDetails[],
  images: ImageInfo[]
): Service[] {
  return services.map((config) => {
    const container = containers.find((c) =>
      c.Names.some((name) => name === `/${config.name}`)
    );
    const image = images.find((img) => img.RepoTags?.includes(config.image));

    return {
      config,
      container,
      image,
    };
  });
}
