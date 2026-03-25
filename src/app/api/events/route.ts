import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

// Try multiple possible paths for the data directory
function getDataFile(filename: string): string | null {
  const candidates = [
    join(process.cwd(), "data", filename),
    join(process.cwd(), "..", "data", filename),
    process.env.HOME ? join(process.env.HOME, "Desktop/BDUBB-HQ/data", filename) : null,
  ].filter(Boolean) as string[];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

export async function GET() {
  try {
    const dataPath = getDataFile("event-log.json");
    if (!dataPath) {
      console.error("[API /events] Could not find event-log.json in any known location");
      return NextResponse.json([]); // Return empty array, not error object
    }
    const data = readFileSync(dataPath, "utf-8");
    const parsed = JSON.parse(data);
    const events = parsed.events || [];
    return NextResponse.json(events.slice(0, 50));
  } catch (error) {
    console.error("[API /events] Error:", error);
    return NextResponse.json([]); // Return empty array, not error object
  }
}
