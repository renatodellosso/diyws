import api from "@/lib/api";
import dockerService from "@/lib/dockerService";
import FollowerManager from "@/lib/FollowerManager";
import { errorResponse, throwIfUnauthorized } from "@/lib/serverUtils";
import {
  createServiceOnFollower,
  createServiceOnLeader,
} from "@/lib/serviceUtils";
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

    const follower = await FollowerManager.getFollowerById(config.followerId);
    if (!follower) {
      throw new Error(`Follower with ID ${config.followerId} not found`);
    }

    await createServiceOnLeader(config);
    await FollowerManager.forwardRequestToFollower(
      follower,
      "/services",
      "POST",
      { startContainer, ...config }
    );

    console.log("Created service:", config);

    return NextResponse.json(config, { status: 201 });
  } catch (error: any) {
    if (error instanceof Error) {
      return errorResponse(error);
    }
  }
}
