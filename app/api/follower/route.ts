import api from "@/lib/api";
import FollowerManager from "@/lib/FollowerManager";
import { errorResponse } from "@/lib/serverUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.IS_LEADER || process.env.IS_LEADER !== "true") {
      throw new Error("This node is not configured as a leader");
    }

    const rawIp =
      req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");
    const splitIp = rawIp ? rawIp.split(":") : [];
    const ip =
      rawIp == "::1"
        ? "127.0.0.1"
        : splitIp.length > 0
          ? splitIp[splitIp.length - 1]
          : undefined;

    console.log(`Registering follower from IP: ${ip}`);

    if (!ip) {
      throw new Error("Could not determine follower IP address");
    }

    const body = await req.json();
    const parsed = api.follower.post.bodySchema!.safeParse(body);
    if (!parsed.success) {
      throw new Error(parsed.error.message);
    }

    await FollowerManager.addFollower({
      id: parsed.data.id,
      name: parsed.data.name,
      ip,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
