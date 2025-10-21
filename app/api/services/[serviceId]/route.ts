import api from "@/lib/api";
import DataService from "@/lib/DataService";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  const { serviceId } = await params;

  const parsed =
    api.services.serviceId.dynamicRouteSchema!.safeParse(serviceId);
  if (!parsed.success) {
    return new Response(parsed.error.message, { status: 400 });
  }

  try {
    await DataService.deleteService(parsed.data);

    return new Response(null, { status: 204 });
  } catch (error: any) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }
  }
}
