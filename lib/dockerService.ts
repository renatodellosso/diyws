import Docker from "dockerode";
import {
  ContainerDetails,
  PortMapping,
  ServiceConfig,
  VolumeConfig,
} from "./types";

class DockerService {
  docker: Docker;

  constructor() {
    this.docker = new Docker();
  }

  async isDockerRunning(): Promise<boolean> {
    try {
      await this.docker.ping();
      return true;
    } catch {
      return false;
    }
  }

  async getImages() {
    return this.docker.listImages();
  }

  async getContainers(): Promise<ContainerDetails[]> {
    const containerInfos = await this.docker.listContainers({ all: true });
    const containerDetailsPromises = containerInfos.map((info) =>
      this.getContainerDetails(info)
    );
    return Promise.all(containerDetailsPromises);
  }

  async getContainerInfo(
    containerId: string
  ): Promise<ContainerDetails | null> {
    // I can't find a way to get a single container's info directly,
    // this.docker.getContainer(containerId).inspect() gives different info than listContainers
    const containers = await this.docker.listContainers({ all: true });
    const container = containers.find((c) => c.Id === containerId);
    if (!container) {
      return null;
    }

    return this.getContainerDetails(container);
  }

  private async getContainerDetails(
    containerInfo: Docker.ContainerInfo
  ): Promise<ContainerDetails> {
    const container = this.docker.getContainer(containerInfo.Id);
    const [details, stats] = await Promise.all([
      container.inspect(),
      containerInfo.State === "running"
        ? container.stats({ stream: false })
        : undefined,
    ]);

    return { ...details, stats, ...containerInfo };
  }

  async setContainerState(containerId: string, shouldRun: boolean) {
    const container = this.docker.getContainer(containerId);
    if (shouldRun) {
      await container.start();
    } else {
      await container.stop();
    }
  }

  async getImageInfo(imageName: string, errorOnNotFound = true) {
    try {
      const image = this.docker.getImage(imageName);
      return await image.inspect();
    } catch (err) {
      if (errorOnNotFound) {
        throw err;
      }
      return null;
    }
  }

  /**
   * Does not create a new image if it already exists
   */
  async createImage(imageName: string) {
    const existing = await this.getImageInfo(imageName, false);
    if (existing) {
      console.log(`Image ${imageName} already exists.`);
      return existing;
    }

    let state: "waiting" | "finished" | "error" = "waiting";

    console.log(`Pulling image: ${imageName}`);
    this.docker.pull(imageName, {}, (err, stream) => {
      if (err) {
        console.error("Error pulling image:", err);
        state = "error";
        return;
      }
      this.docker.modem.followProgress(stream!, (pullErr, output) => {
        if (pullErr) {
          console.error("Error during image pull:", pullErr);
          state = "error";
          return;
        }
        console.log(`Successfully pulled image: ${imageName}`);
        state = "finished";
      });
    });

    // Wait for the pull to finish
    while (state === "waiting") {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    if (state === "error") {
      throw new Error(`Failed to pull image: ${imageName}`);
    }

    return this.docker.getImage(imageName).inspect();
  }

  async createContainer(
    imageName: string,
    containerName: string,
    env: Record<string, string>,
    ports: PortMapping[],
    volumes: VolumeConfig[]
  ) {
    const container = await this.docker.createContainer({
      Image: imageName,
      name: containerName,
      Env: Object.entries(env).map(([key, value]) => `${key}=${value}`),
      ExposedPorts: ports.reduce((acc, port) => {
        acc[port.hostPort] = {};
        return acc;
      }, {} as Record<string, {}>),
      HostConfig: {
        PortBindings: ports.reduce((acc, port) => {
          acc[`${port.containerPort}/${port.protocol}`] = [
            { HostPort: port.hostPort.toString() },
          ];
          return acc;
        }, {} as Record<string, { HostPort: string }[]>),
        Binds: volumes.map(
          (vol) => `${vol.volumeName}:${vol.containerDestination}`
        ),
      },
    });

    console.log(`Created container: ${containerName}`);
    return container.inspect();
  }

  async getVolumes() {
    const volumes = await this.docker
      .listVolumes()
      .then((res) => res.Volumes || []);

    return volumes;
  }

  /**
   * Does nothing if the volume already exists
   */
  async createVolume(volumeName: string) {
    const existing = await this.docker
      .getVolume(volumeName)
      .inspect()
      .catch(() => null);

    if (existing) {
      console.log(`Volume ${volumeName} already exists.`);
      return existing;
    }

    const volume = await this.docker.createVolume({ Name: volumeName });
    console.log(`Created volume: ${volumeName}`);
    return volume;
  }
}

const dockerService = new DockerService();

export default dockerService;
