import api from "@/lib/api";
import dockerService from "@/lib/dockerService";
import { errorResponse, throwIfUnauthorized } from "@/lib/serverUtils";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ containerId: string }> }
) {
  try {
    await throwIfUnauthorized();

    const { containerId: rawId } = await params;
    const parsedContainerId =
      api.containers.containerId.dynamicRouteSchema.safeParse(rawId);

    if (!parsedContainerId.success) {
      return new Response("Invalid container ID", { status: 400 });
    }

    const containerId = parsedContainerId.data;

    const containerInfo = await dockerService.getContainerInfo(containerId);
    if (!containerInfo) {
      return new Response("Container not found", { status: 404 });
    }

    return new Response(JSON.stringify(containerInfo), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
  }
}
