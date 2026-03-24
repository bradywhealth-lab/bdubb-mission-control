import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dataPath = join(process.env.HOME || "", "Desktop/BDUBB-HQ/data/event-log.json");
    const data = readFileSync(dataPath, "utf-8");
    const parsed = JSON.parse(data);
    const events = parsed.events || [];
    return NextResponse.json(events.slice(0, 50));
  } catch {
    return NextResponse.json({ error: "Failed to read event log" }, { status: 500 });
  }
}
