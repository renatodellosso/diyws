import api from "@/lib/api";
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

    const service = await createService(parsed.data);

    console.log("Created service:", service.config);

    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    if (error instanceof Error) {
      return errorResponse(error);
    }
  }
}
