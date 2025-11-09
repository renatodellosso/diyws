import DataService from "@/lib/DataService";
import dockerService from "@/lib/dockerService";
import FollowerManager from "@/lib/FollowerManager";
import { errorResponse, throwIfUnauthorized } from "@/lib/serverUtils";
import { populateServices } from "@/lib/serviceUtils";
import { FollowerState, MinimalServerState, ServerState } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await throwIfUnauthorized();

    const followerStates = await FollowerManager.getFollowerStates();

    const containers: FollowerState["containers"] = [];
    const images: FollowerState["images"] = [];
    const volumes: FollowerState["volumes"] = [];

    for (const followerState of followerStates) {
      containers.push(...followerState.containers);
      images.push(...followerState.images);
      volumes.push(...followerState.volumes);
    }

    const serviceConfigs = await DataService.getServiceList();
    const services = populateServices(
      serviceConfigs,
      containers,
      images,
      volumes
    );

    const state: MinimalServerState = {
      services,
      followers: followerStates,
    };

    return NextResponse.json(state);
  } catch (error: any) {
    if (error instanceof Error) {
      return errorResponse(error);
    }
  }
}
