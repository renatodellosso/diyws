import Docker from "dockerode";

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
}

export default new DockerService();
