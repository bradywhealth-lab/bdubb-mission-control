import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const dataPath = join(process.env.HOME || "", "Desktop/BDUBB-HQ/data/tasks.json");
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

    // Note: In production, use writeFileSync. For now we return the updated task.
    return NextResponse.json(parsed.tasks[taskIndex]);
  } catch {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
