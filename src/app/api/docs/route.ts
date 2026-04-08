import { NextResponse } from "next/server";
import { readdirSync, readFileSync, statSync, existsSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

// Agency2 workspace on VPS
const WORKSPACE = "/home/deployer/.openclaw/workspace-agency2";

// Key files we always want surfaced
const PINNED_FILES: Array<{ path: string; folder: string; title: string }> = [
  { path: `${WORKSPACE}/MASTER-CONTEXT.md`, folder: "SOPs", title: "MASTER-CONTEXT" },
  { path: `${WORKSPACE}/AGENTS.md`, folder: "SOPs", title: "AGENTS — Agent Roster" },
  { path: `${WORKSPACE}/BA-CONSTITUTION.md`, folder: "SOPs", title: "BA Constitution" },
  { path: `${WORKSPACE}/BA-PREFERENCES.md`, folder: "SOPs", title: "BA Preferences" },
  { path: `${WORKSPACE}/USER.md`, folder: "SOPs", title: "USER — BDUBB Standard" },
  { path: `${WORKSPACE}/PROJECTS-CONTEXT.md`, folder: "Projects", title: "Projects Context" },
  { path: `${WORKSPACE}/TASK-STATE.md`, folder: "SOPs", title: "Task State" },
  { path: `${WORKSPACE}/MEMORY.md`, folder: "SOPs", title: "Long-term Memory" },
  { path: `${WORKSPACE}/SYSTEM-MEMORY.md`, folder: "SOPs", title: "System Memory" },
  { path: `${WORKSPACE}/PREFERENCE-LEARNINGS.md`, folder: "SOPs", title: "Preference Learnings" },
  { path: `${WORKSPACE}/HEARTBEAT.md`, folder: "SOPs", title: "Heartbeat Protocol" },
  { path: `${WORKSPACE}/CONTEXT-MAINTENANCE.md`, folder: "SOPs", title: "Context Maintenance" },
  { path: `${WORKSPACE}/SESSION-SUMMARY-PROTOCOL.md`, folder: "SOPs", title: "Session Summary Protocol" },
  { path: `${WORKSPACE}/HANDOFF-TEMPLATE.md`, folder: "SOPs", title: "Handoff Template" },
];

// Directories to scan for additional docs
const SCAN_DIRS: Array<{ base: string; folder: string }> = [
  { base: `${WORKSPACE}/memory`, folder: "Memory" },
  { base: `${WORKSPACE}/projects`, folder: "Projects" },
  { base: `${WORKSPACE}/ops`, folder: "Infra" },
];

interface DocEntry {
  id: string;
  folder: string;
  title: string;
  type: string;
  createdAt: string;
  content: string;
  path: string;
}

export async function GET() {
  const docs: DocEntry[] = [];
  const seen = new Set<string>();

  const addFile = (filepath: string, folder: string, titleOverride?: string) => {
    if (seen.has(filepath) || !existsSync(filepath)) return;
    seen.add(filepath);
    try {
      const stat = statSync(filepath);
      const content = readFileSync(filepath, "utf-8");
      const filename = filepath.split("/").pop() ?? filepath;
      const title = titleOverride ?? filename.replace(/\.md$/, "").replace(/-/g, " ");
      docs.push({
        id: Buffer.from(filepath).toString("base64").slice(0, 20),
        folder,
        title,
        type: "md",
        createdAt: stat.mtime.toISOString().slice(0, 10),
        content,
        path: filepath,
      });
    } catch {
      // skip unreadable files
    }
  };

  // Add pinned files first
  for (const f of PINNED_FILES) {
    addFile(f.path, f.folder, f.title);
  }

  // Scan directories
  for (const { base, folder } of SCAN_DIRS) {
    if (!existsSync(base)) continue;
    try {
      const files = readdirSync(base).filter((f) => f.endsWith(".md") && !f.startsWith("."));
      for (const file of files.slice(0, 20)) {
        addFile(join(base, file), folder);
      }
    } catch {
      // skip unreadable dirs
    }
  }

  return NextResponse.json(docs);
}
