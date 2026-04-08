import { DeskAgent, DocEntry, MemoryEntry, Task, TeamMember } from "@/lib/types";

export const initialTasks: Task[] = [];

export const deskAgents: DeskAgent[] = [
  { id: "desk-1", name: "BA", task: "Front-door operator — routing and command center", glow: "#00d4ff", deskTone: "#0a1628" },
  { id: "desk-2", name: "Blacksmith", task: "Complex lead builder — architecture and deep implementation", glow: "#f97316", deskTone: "#1a0f00" },
  { id: "desk-3", name: "Borealis", task: "Medium builder — features and integrations", glow: "#06b6d4", deskTone: "#001a1f" },
  { id: "desk-4", name: "Blitz", task: "Quick builder — fast fixes and scripts", glow: "#eab308", deskTone: "#1a1a00" },
  { id: "desk-5", name: "Inspector", task: "QA and release gate — verification before ship", glow: "#ef4444", deskTone: "#1a0000" },
  { id: "desk-6", name: "Scout", task: "Creative engine — ideas, enhancements, revenue discovery", glow: "#a855f7", deskTone: "#0f0019" },
  { id: "desk-7", name: "Sentinel", task: "Anti-drift watchdog — health and governance", glow: "#22c55e", deskTone: "#001a06" },
  { id: "desk-8", name: "Curator", task: "Knowledge manager — docs, memory, research synthesis", glow: "#3b82f6", deskTone: "#00091a" },
  { id: "desk-9", name: "Upgrader", task: "Optimization — benchmarking and cost tuning", glow: "#ec4899", deskTone: "#1a000f" },
];

export const memoryEntries: MemoryEntry[] = [
  {
    id: "mem-1",
    title: "Mission Control Agency2 Overhaul — 2026-04-08",
    date: "2026-04-08 01:40 UTC",
    category: "Operations",
    content: `# MISSION CONTROL OVERHAUL
[2026-04-08 01:40 UTC] [Agency2]
Full overhaul initiated. All old BDUBB-HQ references replaced with Agency2 workspace.
- 9 Agency2 agents: BA, Scout, Sentinel, Blacksmith, Borealis, Blitz, Inspector, Curator, Upgrader
- Workspace: ~/.openclaw/workspace-agency2/
- Data layer wiped and restructured
- API routes rewired for live data`,
  },
];

export const docs: DocEntry[] = [
  {
    id: "doc-1",
    folder: "SOPs",
    title: "AGENTS.md — Agent Roster",
    type: "MD",
    createdAt: "2026-04-08",
    content: "9-agent roster with roles, models, skills, tools, boundaries, routing rules, and handoff protocol. Lives at ~/.openclaw/workspace-agency2/AGENTS.md",
  },
  {
    id: "doc-2",
    folder: "SOPs",
    title: "BA-CONSTITUTION.md",
    type: "MD",
    createdAt: "2026-04-08",
    content: "BA's operational doctrine — behavior rules, routing authority, verification standards. Lives at ~/.openclaw/workspace-agency2/BA-CONSTITUTION.md",
  },
  {
    id: "doc-3",
    folder: "Projects",
    title: "PROJECTS-CONTEXT.md",
    type: "MD",
    createdAt: "2026-04-08",
    content: "Active project context: King Money Maker / Trading Bot, KingCRM, Viral Content Engine, Mission Control. Lives at ~/.openclaw/workspace-agency2/PROJECTS-CONTEXT.md",
  },
  {
    id: "doc-4",
    folder: "SOPs",
    title: "MASTER-CONTEXT.md",
    type: "MD",
    createdAt: "2026-04-08",
    content: "Master context file for Agency2 operations. Lives at ~/.openclaw/workspace-agency2/MASTER-CONTEXT.md",
  },
  {
    id: "doc-5",
    folder: "SOPs",
    title: "USER.md — BDUBB Standard",
    type: "MD",
    createdAt: "2026-04-08",
    content: "Owner identity and expectations. Elite execution standard, precision first, no wasted motion, zero tolerance for mediocrity. Lives at ~/.openclaw/workspace-agency2/USER.md",
  },
];

export const team: TeamMember[] = [
  {
    id: "agent-1",
    name: "BA — Blaze Apex",
    role: "Front-door Operator",
    aiSystem: "Claude Sonnet 4.6",
    status: "Online",
    specialty: "Receives all tasks. Routes to specialists. Delivers outcomes. The control room operator.",
  },
  {
    id: "agent-2",
    name: "Scout",
    role: "Creative Engine",
    aiSystem: "Kimi K2.5",
    status: "Idle",
    specialty: "Ideas, enhancements, revenue discovery. Research and creative exploration. Never builds directly.",
  },
  {
    id: "agent-3",
    name: "Sentinel",
    role: "Anti-Drift Watchdog",
    aiSystem: "Kimi K2.5",
    status: "Monitoring",
    specialty: "Health, governance, drift detection. Reports anomalies. No silent fixes.",
  },
  {
    id: "agent-4",
    name: "Blacksmith",
    role: "Complex Lead Builder",
    aiSystem: "Claude Sonnet 4.6",
    status: "Building",
    specialty: "Hardest builds, architecture, major refactors, deep debugging. Plans first. Inspector before ship.",
  },
  {
    id: "agent-5",
    name: "Borealis",
    role: "Medium Builder",
    aiSystem: "GPT-5.1 Codex Mini",
    status: "Idle",
    specialty: "Standard features, integrations, medium build work. Escalates to Blacksmith if scope grows.",
  },
  {
    id: "agent-6",
    name: "Blitz",
    role: "Quick Builder",
    aiSystem: "GPT-5 Mini",
    status: "Idle",
    specialty: "Quick fixes, scripts, cleanup, tactical execution. Announces exact files touched.",
  },
  {
    id: "agent-7",
    name: "Inspector",
    role: "QA and Release Gate",
    aiSystem: "GPT-5.1",
    status: "On-Call",
    specialty: "Universal verification gate. Nothing meaningful ships without Inspector pass. Never rubber-stamps.",
  },
  {
    id: "agent-8",
    name: "Curator",
    role: "Knowledge Manager",
    aiSystem: "Kimi K2.5",
    status: "Idle",
    specialty: "Docs, memory, research synthesis. No primary code building. Conflicting research must be surfaced.",
  },
  {
    id: "agent-9",
    name: "Upgrader",
    role: "Optimization",
    aiSystem: "Kimi K2.5",
    status: "Idle",
    specialty: "Benchmarking, cost tuning, model routing. Proposes only. No installs without approval.",
  },
];
