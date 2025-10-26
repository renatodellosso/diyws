import * as fs from "fs/promises";
import { ServiceConfig } from "./types";
import { isValidServiceName } from "./serviceUtils";

namespace DataService {
  const FILE_PATH = "./data/";
  const SERVICES_PATH = FILE_PATH + "services/";

  function getServiceFilePath(name: string) {
    return SERVICES_PATH + name + ".json";
  }

  async function writeServiceFile(service: ServiceConfig) {
    const filePath = getServiceFilePath(service.name);
    await fs.mkdir(SERVICES_PATH, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(service, null, 2), "utf-8");

    console.log(`Service file written: ${filePath}`);
  }

  async function getService(name: string): Promise<ServiceConfig | null> {
    try {
      const data = await fs.readFile(getServiceFilePath(name), "utf-8");
      return JSON.parse(data) as ServiceConfig;
    } catch (e) {
      console.error("Error reading service file:", e);
      return null;
    }
  }

  export async function getServiceList(): Promise<ServiceConfig[]> {
    try {
      const files = await fs.readdir(SERVICES_PATH);
      const services: ServiceConfig[] = (
        await Promise.all(
          files.map((file) => getService(file.replace(".json", "")))
        )
      ).filter((service): service is ServiceConfig => service !== null);

      return services;
    } catch (e) {
      console.error("Error reading service list:", e);
      return [];
    }
  }

  /**
   * Throws if service name is invalid or already in use.
   */
  export async function createService(config: ServiceConfig) {
    if (!isValidServiceName(config.name)) {
      throw new Error("Invalid service name.");
    }

    const services = await getServiceList();

    if (await isServiceNameInUse(config.name)) {
      throw new Error("Service with that name already exists");
    }

    services.push(config);

    await writeServiceFile(config);

    return config;
  }

  export async function deleteService(name: string) {
    const filePath = getServiceFilePath(name);
    try {
      await fs.unlink(filePath);
    } catch (e) {
      console.error("Error deleting service file:", e);
      throw new Error("Service not found");
    }
  }

  export async function isServiceNameInUse(name: string): Promise<boolean> {
    const fileName = getServiceFilePath(name);
    try {
      await fs.access(fileName);
      return true;
    } catch {
      return false;
    }
  }
}

export default DataService;
