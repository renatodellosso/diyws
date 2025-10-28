import api from '@/lib/api';
import DataService from '@/lib/DataService';
import { errorResponse, throwIfUnauthorized } from '@/lib/serverUtils';
import { deleteService } from '@/lib/serviceUtils';

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

    await deleteService(parsed.data);

    return new Response(null, { status: 204 });
  } catch (error: any) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
  }
}
