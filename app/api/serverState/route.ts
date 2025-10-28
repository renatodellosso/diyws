import DataService from "@/lib/DataService";
import dockerService from "@/lib/dockerService";
import {
  errorResponse,
  getResourceUsage,
  throwIfUnauthorized,
} from "@/lib/serverUtils";
import { populateServices } from "@/lib/serviceUtils";
import { ServerState } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await throwIfUnauthorized();

    const isDockerUp = await dockerService.isDockerRunning();

    if (!isDockerUp) {
      const state: ServerState = {
        dockerRunning: false,
        images: [],
        containers: [],
        volumes: [],
        services: [],
      };
      return NextResponse.json(state);
    }

    const [images, containers, volumes] = await Promise.all([
      dockerService.getImages(),
      dockerService.getContainers(),
      dockerService.getVolumes(),
    ]);

    const serviceConfigs = await DataService.getServiceList();
    const services = populateServices(serviceConfigs, containers, images, volumes);

    const state: ServerState = {
      dockerRunning: true,
      images,
      containers,
      volumes,
      services,
      resourceUsage: getResourceUsage(),
    };

    return NextResponse.json(state);
  } catch (error: any) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
  }
}
