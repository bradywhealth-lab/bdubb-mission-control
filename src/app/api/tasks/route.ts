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
    const dataPath = getDataPath("tasks.json");
    if (!dataPath) {
      console.error("[API /tasks] Could not find tasks.json in any known location");
      return NextResponse.json([]); // Return empty array, not error object
    }
    const data = readFileSync(dataPath, "utf-8");
    const parsed = JSON.parse(data);
    return NextResponse.json(parsed.tasks || []);
  } catch (error) {
    console.error("[API /tasks] Error:", error);
    return NextResponse.json([]); // Return empty array, not error object
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const dataPath = getDataPath("tasks.json");
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

    // Note: In production, use writeFileSync. For now we return the task.
    return NextResponse.json(newTask);
  } catch (error) {
    console.error("[API /tasks POST] Error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
