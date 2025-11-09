import dockerService from "@/lib/dockerService";
import { errorResponse, getResourceUsage } from "@/lib/serverUtils";
import { LocalFollowerState } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const isDockerUp = await dockerService.isDockerRunning();

    if (!isDockerUp) {
      const state: LocalFollowerState = {
        dockerRunning: false,
        images: [],
        containers: [],
        volumes: [],
      };
      return NextResponse.json(state);
    }

    const [images, containers, volumes] = await Promise.all([
      dockerService.getImages(),
      dockerService.getContainers(),
      dockerService.getVolumes(),
    ]);

    const state: LocalFollowerState = {
      dockerRunning: true,
      images,
      containers,
      volumes,
      resourceUsage: getResourceUsage(),
    };

    return NextResponse.json(state);
  } catch (error) {
    return errorResponse(error);
  }
}
