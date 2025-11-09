import api from "@/lib/api";
import DataService from "@/lib/DataService";
import FollowerManager from "@/lib/FollowerManager";
import { errorResponse, throwIfUnauthorized } from "@/lib/serverUtils";
import { deleteServiceOnLeader } from "@/lib/serviceUtils";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    await throwIfUnauthorized();

    const { serviceId } = await params;

    const parsed =
      api.services.serviceId.dynamicRouteSchema!.safeParse(serviceId);
    if (!parsed.success) {
      return new Response(parsed.error.message, { status: 400 });
    }

    const service =
      (await DataService.getServiceList()).find(
        (s) => s.name === parsed.data
      ) || null;

    if (!service) {
      throw new Error(`Service with name ${parsed.data} not found`);
    }

    const follower = await FollowerManager.getFollowerById(service.followerId);

    if (!follower) {
      throw new Error(`Follower with ID ${service.followerId} not found`);
    }

    await FollowerManager.forwardRequestToFollower(
      follower,
      `/services/${service.name}`,
      "DELETE"
    );

    await deleteServiceOnLeader(parsed.data);

    return new Response(null, { status: 204 });
  } catch (error: any) {
    if (error instanceof Error) {
      return errorResponse(error);
    }
  }
}
