import api from "@/lib/api";
import DataService from "@/lib/DataService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const jsonRaw = await request.json();

  const parsed = api.services.create.bodySchema!.safeParse(jsonRaw);
  if (!parsed.success) {
    return new Response(parsed.error.message, { status: 400 });
  }

  const service = await DataService.createService(parsed.data);

  return NextResponse.json(service, { status: 201 });
}
