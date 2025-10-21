import Docker, { ContainerInfo } from "dockerode";

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

  async getContainers() {
    return this.docker.listContainers({ all: true });
  }

  async getContainerInfo(containerId: string): Promise<ContainerInfo | null> {
    // I can't find a way to get a single container's info directly,
    // this.docker.getContainer(containerId).inspect() gives different info than listContainers
    const containers = await this.docker.listContainers({ all: true });
    const container = containers.find((c) => c.Id === containerId);
    if (!container) {
      return null;
    }

    return container;
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
