import { NextResponse } from "next/server";
import { readdirSync, readFileSync, statSync, existsSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

const HANDOFFS_BASE = "/Users/bradywilson/Desktop/BDUBB-HQ/handoffs";

interface HandoffFile {
  id: string;
  project: string;
  filename: string;
  path: string;
  status: "COMPLETE" | "INCOMPLETE" | "BLOCKED" | "WIP" | "UNKNOWN";
  date: string;
  slug: string;
  content: string;
  modifiedAt: string;
}

function parseStatus(filename: string): HandoffFile["status"] {
  const lower = filename.toLowerCase();
  if (lower.includes("complete")) return "COMPLETE";
  if (lower.includes("blocked")) return "BLOCKED";
  if (lower.includes("incomplete")) return "INCOMPLETE";
  if (lower.includes("wip")) return "WIP";
  return "UNKNOWN";
}

function parseDate(filename: string): string {
  const match = filename.match(/(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : "unknown";
}

export async function GET() {
  try {
    if (!existsSync(HANDOFFS_BASE)) {
      return NextResponse.json([]);
    }

    const handoffs: HandoffFile[] = [];
    const projects = readdirSync(HANDOFFS_BASE).filter((name) => {
      const p = join(HANDOFFS_BASE, name);
      return statSync(p).isDirectory() && name !== "." && name !== "..";
    });

    for (const project of projects) {
      const projectDir = join(HANDOFFS_BASE, project);
      const files = readdirSync(projectDir).filter(
        (f) => f.endsWith(".md") && f !== "TEMPLATE.md"
      );

      for (const filename of files) {
        const filepath = join(projectDir, filename);
        const stat = statSync(filepath);
        const content = readFileSync(filepath, "utf-8");
        const slug = filename.replace(/\.md$/, "");

        handoffs.push({
          id: `${project}-${slug}`,
          project,
          filename,
          path: filepath,
          status: parseStatus(filename),
          date: parseDate(filename),
          slug,
          content,
          modifiedAt: stat.mtime.toISOString(),
        });
      }
    }

    // Sort: most recent first, BLOCKED/WIP first within same date
    handoffs.sort((a, b) => {
      const priority = { BLOCKED: 0, WIP: 1, INCOMPLETE: 2, UNKNOWN: 3, COMPLETE: 4 };
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return (priority[a.status] ?? 3) - (priority[b.status] ?? 3);
    });

    return NextResponse.json(handoffs);
  } catch (error) {
    console.error("[API /handoffs] Error:", error);
    return NextResponse.json([]);
  }
}
