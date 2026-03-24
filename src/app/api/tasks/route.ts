import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dataPath = join(process.env.HOME || "", "Desktop/BDUBB-HQ/data/tasks.json");
    const data = readFileSync(dataPath, "utf-8");
    const parsed = JSON.parse(data);
    return NextResponse.json(parsed.tasks || []);
  } catch {
    return NextResponse.json({ error: "Failed to read tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const dataPath = join(process.env.HOME || "", "Desktop/BDUBB-HQ/data/tasks.json");
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
  } catch {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
