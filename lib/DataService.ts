import * as fs from "fs/promises";
import { ServiceConfig } from "./types";

namespace DataService {
  const FILE_PATH = "./data/";
  const SERVICES_FILE = FILE_PATH + "services.json";

  async function writeServiceList(services: ServiceConfig[]) {
    await fs.mkdir(FILE_PATH, { recursive: true });
    await fs.writeFile(
      SERVICES_FILE,
      JSON.stringify(services, null, 2),
      "utf-8"
    );
  }

  export async function getServiceList(): Promise<ServiceConfig[]> {
    try {
      const data = await fs.readFile(SERVICES_FILE, "utf-8");
      return JSON.parse(data) as ServiceConfig[];
    } catch (e) {
      console.error("Error reading service list:", e);
      return [];
    }
  }

  export async function createService(config: ServiceConfig) {
    const services = await getServiceList();

    if (services.find((s) => s.name === config.name)) {
      throw new Error("Service with that name already exists");
    }

    services.push(config);

    await writeServiceList(services);

    return config;
  }

  export async function deleteService(name: string) {
    const services = await getServiceList();
    const filteredServices = services.filter((s) => s.name !== name);

    if (services.length === filteredServices.length) {
      throw new Error("Service not found");
    }

    await writeServiceList(filteredServices);
  }
}

export default DataService;
