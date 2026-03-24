import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dataPath = join(process.env.HOME || "", "Desktop/BDUBB-HQ/data/deploy-log.json");
    const data = readFileSync(dataPath, "utf-8");
    const parsed = JSON.parse(data);
    return NextResponse.json(parsed.deploys || []);
  } catch {
    return NextResponse.json({ error: "Failed to read deploy log" }, { status: 500 });
  }
}
