import { ImageInfo, ImageInspectInfo } from "dockerode";
import { ServiceConfig, Service, ContainerDetails } from "./types";
import dockerService from "./dockerService";
import DataService from "./DataService";
import { tagsToName } from "./utils";

export function isValidServiceName(name: string): boolean {
  const regex = /^[a-zA-Z0-9-_]+$/;
  return regex.test(name);
}

export function populateServices(
  services: ServiceConfig[],
  containers: ContainerDetails[],
  images: (ImageInfo | ImageInspectInfo)[]
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

export async function createService(config: ServiceConfig): Promise<Service> {
  console.log("Creating service with config:", config);

  const image = await dockerService.createImage(config.image);
  console.log("Created image:", tagsToName(image));

  console.log("Creating container for service:", config.name);
  const container = await dockerService.createContainer(
    tagsToName(image),
    config.name
  );
  console.log("Created container:", container.Name);

  DataService.createService(config);

  return Promise.resolve({
    config,
    container: container!,
    image: image!,
  });
}
