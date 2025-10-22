import api from "@/lib/api";
import DataService from "@/lib/DataService";
import { createService, isValidServiceName } from "@/lib/serviceUtils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const jsonRaw = await request.json();

    const parsed = api.services.create.bodySchema!.safeParse(jsonRaw);
    if (!parsed.success) {
      return new Response(parsed.error.message, { status: 400 });
    }

    if (!isValidServiceName(parsed.data.name)) {
      throw new Error(
        "Invalid service name. Only alphanumeric characters, hyphens, and underscores are allowed."
      );
    }
    const service = await createService(parsed.data);

    console.log("Created service:", service.config);

    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 400 }
      );
    }
  }
}
