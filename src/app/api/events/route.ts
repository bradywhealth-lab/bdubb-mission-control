import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

// Try multiple possible paths for the data directory
function getDataPath(filename: string): string | null {
  const paths = [
    // Absolute fallback path
    "/Users/bradywilson/Desktop/BDUBB-HQ/data",
    // Process home
    process.env.HOME ? join(process.env.HOME, "Desktop/BDUBB-HQ/data") : null,
    // Current working directory based
    join(process.cwd(), "..", "data"),
    join(process.cwd(), "data"),
  ].filter(Boolean) as string[];

  for (const basePath of paths) {
    const fullPath = join(basePath, filename);
    if (existsSync(fullPath)) {
      return fullPath;
    }
  }
  return null;
}

export async function GET() {
  try {
    const dataPath = getDataPath("event-log.json");
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
