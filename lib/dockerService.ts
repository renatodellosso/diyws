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
}

export default new DockerService();
