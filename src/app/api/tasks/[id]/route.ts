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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const dataPath = getDataFile("tasks.json");
    if (!dataPath) {
      console.error("[API /tasks/[id]] Could not find tasks.json");
      return NextResponse.json({ error: "Data file not found" }, { status: 500 });
    }

    const data = readFileSync(dataPath, "utf-8");
    const parsed = JSON.parse(data);

    const taskIndex = parsed.tasks.findIndex((t: { id: string }) => t.id === id);
    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    parsed.tasks[taskIndex] = {
      ...parsed.tasks[taskIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    parsed.lastUpdated = new Date().toISOString();

    // Write the updated data back
    writeFileSync(dataPath, JSON.stringify(parsed, null, 2));

    return NextResponse.json(parsed.tasks[taskIndex]);
  } catch (error) {
    console.error("[API /tasks/[id]] Error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
