import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function throwIfUnauthorized() {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
}

export async function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}
