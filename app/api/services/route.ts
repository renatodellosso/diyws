import api from "@/lib/api";
import dockerService from "@/lib/dockerService";
import { errorResponse, throwIfUnauthorized } from "@/lib/serverUtils";
import { createService } from "@/lib/serviceUtils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await throwIfUnauthorized();

    const jsonRaw = await request.json();

    const parsed = api.services.create.bodySchema!.safeParse(jsonRaw);
    if (!parsed.success) {
      return new Response(parsed.error.message, { status: 400 });
    }

    const { startContainer, ...config } = parsed.data;

    const service = await createService(config);

    console.log("Created service:", service.config);

    if (startContainer && service.container) {
      await dockerService.setContainerState(service.container.Id, true);
      console.log("Started service container:", service.container.Id);
    }

    return NextResponse.json(service.config, { status: 201 });
  } catch (error: any) {
    if (error instanceof Error) {
      return errorResponse(error);
    }
  }
}
