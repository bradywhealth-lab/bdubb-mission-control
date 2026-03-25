import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
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
    const dataPath = getDataFile("tasks.json");
    if (!dataPath) {
      console.error("[API /tasks] Could not find tasks.json in any known location");
      return NextResponse.json([]);
    }
    const data = readFileSync(dataPath, "utf-8");
    const parsed = JSON.parse(data);
    return NextResponse.json(parsed.tasks || []);
  } catch (error) {
    console.error("[API /tasks] Error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const dataPath = getDataFile("tasks.json");
    if (!dataPath) {
      console.error("[API /tasks POST] Could not find tasks.json");
      return NextResponse.json({ error: "Data file not found" }, { status: 500 });
    }
    const data = readFileSync(dataPath, "utf-8");
    const parsed = JSON.parse(data);

    const newTask = {
      id: Date.now().toString(),
      title: body.title,
      assignee: body.assignee || "AP",
      priority: body.priority || "high",
      status: body.status || "backlog",
      description: body.description || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    parsed.tasks.unshift(newTask);
    parsed.lastUpdated = new Date().toISOString();

    // Write the updated data back
    writeFileSync(dataPath, JSON.stringify(parsed, null, 2));

    return NextResponse.json(newTask);
  } catch (error) {
    console.error("[API /tasks POST] Error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
