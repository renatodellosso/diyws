import api from "@/lib/api";
import dockerService from "@/lib/dockerService";
import { errorResponse, throwIfUnauthorized } from "@/lib/serverUtils";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ volumeName: string }> }
) {
  try {
    await throwIfUnauthorized();

    const parsed = api.volumes.volumeName.dynamicRouteSchema.safeParse(
      (await params).volumeName
    );

    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }

    const volumeName = parsed.data;

    const volumeInfo = await dockerService.getVolume(volumeName);
    if (!volumeInfo) {
      return NextResponse.json({}, { status: 404 });
    }

    return NextResponse.json(volumeInfo);
  } catch (error) {
    return errorResponse(error);
  }
}
