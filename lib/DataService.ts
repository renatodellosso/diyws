import * as fs from "fs/promises";
import { ServiceConfig } from "./types";

namespace DataService {
  const FILE_PATH = "./data/";
  const SERVICES_FILE = FILE_PATH + "services.json";

  export async function getServiceList(): Promise<ServiceConfig[]> {
    try {
      const data = await fs.readFile(SERVICES_FILE, "utf-8");
      return JSON.parse(data) as ServiceConfig[];
    } catch (e) {
      return [];
    }
  }

  export async function createService(config: ServiceConfig) {
    const services = await getServiceList();

    if (services.find((s) => s.name === config.name)) {
      throw new Error("Service with that name already exists");
    }

    services.push(config);

    await fs.mkdir(FILE_PATH, { recursive: true });
    await fs.writeFile(
      SERVICES_FILE,
      JSON.stringify(services, null, 2),
      "utf-8"
    );
  }
}

export default DataService;
