import Docker from "dockerode";
import { ContainerDetails } from "./types";

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

  async createImage(imageName: string) {
    this.docker.createImage({ fromImage: imageName });
  }
}

export default new DockerService();
