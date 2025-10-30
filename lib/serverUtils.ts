import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { cpus, freemem, totalmem } from "os";
import { ServerResourceUsage } from "./types";

export async function throwIfUnauthorized() {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
}

export async function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown error";
  const status = error instanceof Error ? 500 : 400;
  return NextResponse.json({ error: message }, { status });
}

export function getResourceUsage(): ServerResourceUsage {
  const totalMemory = totalmem();

  return {
    cpuPercent: cpus().map(
      (cpu) =>
        cpu.times.user /
        (cpu.times.user +
          cpu.times.nice +
          cpu.times.sys +
          cpu.times.idle +
          cpu.times.irq)
    ),
    memoryUsageBytes: totalMemory - freemem(),
    memoryLimitBytes: totalMemory,
  };
}
