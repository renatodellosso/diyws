import api from "@/lib/api";
import { errorResponse } from "@/lib/serverUtils";
import { deleteServiceOnFollower } from "@/lib/serviceUtils";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const { serviceId } = await params;

    const parsed =
      api.follower.services.serviceId.dynamicRouteSchema!.safeParse(serviceId);
    if (!parsed.success) {
      return new Response(parsed.error.message, { status: 400 });
    }

    await deleteServiceOnFollower(parsed.data);

    return new Response(null, { status: 204 });
  } catch (error: any) {
    if (error instanceof Error) {
      return errorResponse(error);
    }
  }
}
