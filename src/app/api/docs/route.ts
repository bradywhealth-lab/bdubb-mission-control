import { NextResponse } from "next/server";
import { readdirSync, readFileSync, statSync, existsSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

const HOME = "/Users/bradywilson";

// Key files we always want surfaced
const PINNED_FILES: Array<{ path: string; folder: string; title: string }> = [
  { path: `${HOME}/Desktop/BDUBB-HQ/MASTER-CONTEXT.md`, folder: "SOPs", title: "MASTER-CONTEXT — The Bible" },
  { path: `${HOME}/Desktop/BDUBB-HQ/CONTEXT.md`, folder: "SOPs", title: "CONTEXT — Agent Context" },
  { path: `${HOME}/.openclaw/workspace/MEMORY.md`, folder: "SOPs", title: "AP MEMORY.md" },
  { path: `${HOME}/Desktop/BDUBB-HQ/docs/WORKFLOWS.md`, folder: "SOPs", title: "Workflows" },
  { path: `${HOME}/Desktop/BDUBB-HQ/docs/DISCORD-CHANNELS.md`, folder: "Infra", title: "Discord Channels" },
  { path: `${HOME}/Desktop/BDUBB-HQ/docs/trading-tools.md`, folder: "Trading", title: "Trading Tools" },
  { path: `${HOME}/Desktop/BDUBB-HQ/handoffs/TEMPLATE.md`, folder: "SOPs", title: "Handoff Template" },
  { path: `${HOME}/.agents/skills/autosave/SKILL.md`, folder: "SOPs", title: "AutoSave Skill" },
];

// Directories to scan for additional docs
const SCAN_DIRS: Array<{ base: string; folder: string }> = [
  { base: `${HOME}/Desktop/BDUBB-HQ/docs`, folder: "SOPs" },
  { base: `${HOME}/Desktop/BDUBB-HQ/tools/ap-skills`, folder: "Tools" },
  { base: `${HOME}/Desktop/viral-engine/docs`, folder: "Projects" },
  { base: `${HOME}/Desktop/z.ai-1st-kingCRM/docs`, folder: "Projects" },
  { base: `${HOME}/Desktop/bot-gawds`, folder: "Trading" },
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
