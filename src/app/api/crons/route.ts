import { NextResponse } from "next/server";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

function getDataFile(filename: string): string | null {
  const candidates = [
    join(process.cwd(), "data", filename),
    join(process.cwd(), "..", "data", filename),
    process.env.HOME ? join(process.env.HOME, "Desktop/BDUBB-HQ/data", filename) : null,
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  return null;
}

export async function GET() {
  try {
    const dataPath = getDataFile("cron-status.json");
    if (!dataPath) {
      console.error("[API /crons] Could not find cron-status.json in any known location");
      return NextResponse.json([]);
    }

    const data = readFileSync(dataPath, "utf-8");
    const parsed = JSON.parse(data);
    return NextResponse.json(parsed.jobs || []);
  } catch (error) {
    console.error("[API /crons] Error:", error);
    return NextResponse.json([]);
  }
}
