import api from '@/lib/api';
import dockerService from '@/lib/dockerService';
import { throwIfUnauthorized, errorResponse } from '@/lib/serverUtils';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ containerId: string }> }
) {
  try {
    await throwIfUnauthorized();
    const { containerId: rawId } = await params;
    const parsedContainerId =
      api.containers.containerId.dynamicRouteSchema.safeParse(rawId);

    if (!parsedContainerId.success) {
      return new Response(parsedContainerId.error.message, { status: 400 });
    }

    const containerId = parsedContainerId.data;

    const requestBody = await request.json();
    const parsedBody = api.containers
      .containerId(containerId)
      .state.update.bodySchema!.safeParse(requestBody);

    if (!parsedBody.success) {
      return new Response(parsedBody.error.message, { status: 400 });
    }

    await dockerService.setContainerState(containerId, parsedBody.data.running);

    const containerInfo = await dockerService.getContainerInfo(containerId);
    if (!containerInfo) {
      return new Response('Container not found after state change', {
        status: 404,
      });
    }

    return NextResponse.json(containerInfo);
  } catch (error: any) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
  }
}
