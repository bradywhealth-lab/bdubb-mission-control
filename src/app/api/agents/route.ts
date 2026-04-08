import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

function getDataFile(filename: string): string | null {
  const candidates = [
    join(process.cwd(), "data", filename),
  ].filter(Boolean) as string[];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

export async function GET() {
  try {
    const p = getDataFile("agent-status.json");
    if (!p) return NextResponse.json({});
    const data = JSON.parse(readFileSync(p, "utf-8"));
    return NextResponse.json(data.agents || {});
  } catch {
    return NextResponse.json({});
  }
}
