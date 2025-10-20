import dockerService from "@/lib/dockerService";
import { NextResponse } from "next/server";

export async function GET() {
  const isDockerUp = await dockerService.isDockerRunning();

  console.log("Docker running:", isDockerUp);

  return NextResponse.json({ dockerRunning: isDockerUp });
}
