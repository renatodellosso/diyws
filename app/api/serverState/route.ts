import dockerService from "@/lib/dockerService";
import { ServerState } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {
  const isDockerUp = await dockerService.isDockerRunning();

  if (!isDockerUp) {
    const state: ServerState = {
      dockerRunning: false,
      images: [],
      containers: [],
    };
    return NextResponse.json(state);
  }

  const state: ServerState = {
    dockerRunning: true,
    images: await dockerService.getImages(),
    containers: await dockerService.getContainers(),
  };

  return NextResponse.json(state);
}
