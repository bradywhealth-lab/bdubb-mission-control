import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dataPath = getDataFile("cron-status.json");
    const data = readFileSync(dataPath, "utf-8");
    const parsed = JSON.parse(data);
    return NextResponse.json(parsed.jobs || []);
  } catch {
    return NextResponse.json({ error: "Failed to read cron status" }, { status: 500 });
  }
}
