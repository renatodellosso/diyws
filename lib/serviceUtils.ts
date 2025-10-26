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

export async function isServiceNameInUse(name: string): Promise<boolean> {
  const services = await DataService.getServiceList();
  return services.some((service) => service.name === name);
}

/**
 * Throws if service name is invalid or already in use.
 */
export async function createService(config: ServiceConfig): Promise<Service> {
  console.log("Creating service with config:", config);

  await DataService.createService(config);

  const image = await dockerService.createImage(config.image);

  const container = await dockerService.createContainer(
    tagsToName(image),
    config.name
  );

  console.log(`Created service '${config.name}' successfully!`);
  return {
    config,
    container: container!,
    image: image!,
  };
}

export async function deleteService(serviceId: string): Promise<void> {
  console.log("Deleting service with ID:", serviceId);

  await DataService.deleteService(serviceId);
  console.log("Deleted service config from data store.");

  try {
    const container = dockerService.docker.getContainer(serviceId);
    await container.remove({ force: true });
    console.log("Deleted container:", serviceId);
  } catch (err: any) {
    if (err.statusCode === 404) {
      console.log("Container not found, skipping deletion:", serviceId);
    } else {
      throw err;
    }
  }
}
