import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dataPath = join(process.env.HOME || "", "Desktop/BDUBB-HQ/data/agent-status.json");
    const data = readFileSync(dataPath, "utf-8");
    const parsed = JSON.parse(data);
    return NextResponse.json(parsed.agents || {});
  } catch {
    return NextResponse.json({ error: "Failed to read agent status" }, { status: 500 });
  }
}
