import { DeskAgent, DocEntry, MemoryEntry, Task, TeamMember } from "@/lib/types";

export const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Refactor agent routing",
    description: "Rebuild delegation flow so AP can shard workload cleanly.",
    priority: "High",
    assignee: "AP",
    createdAt: "2026-03-20",
    status: "Backlog",
    scheduledFor: "2026-03-25",
  },
  {
    id: "task-2",
    title: "Ship investor dashboard",
    description: "Deliver elite telemetry cards and live signal charts.",
    priority: "High",
    assignee: "Nova",
    createdAt: "2026-03-18",
    status: "In Progress",
    scheduledFor: "2026-03-23",
  },
  {
    id: "task-3",
    title: "Audit memory compaction",
    description: "Validate archival thresholds in MEMORY.md snapshots.",
    priority: "Med",
    assignee: "Kite",
    createdAt: "2026-03-19",
    status: "In Review",
    scheduledFor: "2026-03-24",
  },
  {
    id: "task-4",
    title: "Deploy synthesis cron",
    description: "Nightly 03:15 ET sync for reports and plans.",
    priority: "Low",
    assignee: "Echo",
    createdAt: "2026-03-17",
    status: "Done",
    scheduledFor: "2026-03-28",
  },
  {
    id: "task-5",
    title: "Research stealth GTM",
    description: "Compile competitor signal board and pricing deltas.",
    priority: "Med",
    assignee: "Rune",
    createdAt: "2026-03-16",
    status: "Backlog",
    scheduledFor: "2026-03-27",
  },
  {
    id: "task-6",
    title: "Review codegen patchset",
    description: "Inspect Codex branch diffs before production cutover.",
    priority: "High",
    assignee: "AP",
    createdAt: "2026-03-21",
    status: "In Progress",
    scheduledFor: "2026-03-26",
  },
];

export const deskAgents: DeskAgent[] = [
  { id: "desk-1", name: "AP", task: "Routing BDUBB priorities", glow: "#00d4ff", deskTone: "#14213d" },
  { id: "desk-2", name: "Nova", task: "Tuning launch metrics", glow: "#8b5cf6", deskTone: "#1b263b" },
  { id: "desk-3", name: "Kite", task: "Parsing memory logs", glow: "#2dd4bf", deskTone: "#1c2541" },
  { id: "desk-4", name: "Rune", task: "Scanning market intel", glow: "#f472b6", deskTone: "#2b2d42" },
];

export const memoryEntries: MemoryEntry[] = [
  {
    id: "mem-1",
    title: "AxonPoe daily synthesis",
    date: "2026-03-23 08:10 ET",
    category: "Operations",
    content: `# MEMORY.md
[2026-03-23 08:10 ET] [Operations]
AP aligned task queues with BDUBB priorities.
- Focus: Mission Control launch
- Risk: calendar cron overlap on Thursday
- Next: finalize org chart visibility`,
  },
  {
    id: "mem-2",
    title: "Research pulse",
    date: "2026-03-22 21:42 ET",
    category: "Research",
    content: `# MEMORY.md
[2026-03-22 21:42 ET] [Research]
Competitor pricing heatmap updated.
- Premium tiers remain vulnerable above $399/mo
- Strongest differentiator: autonomous reporting cadence`,
  },
  {
    id: "mem-3",
    title: "Code review trace",
    date: "2026-03-21 14:26 ET",
    category: "Engineering",
    content: `# MEMORY.md
[2026-03-21 14:26 ET] [Engineering]
Codex patch review complete.
- Fixed state hydration mismatch
- Deferred streaming telemetry until next sprint`,
  },
];

export const docs: DocEntry[] = [
  {
    id: "doc-1",
    folder: "PRDs",
    title: "Mission Control MVP",
    type: "PRD",
    createdAt: "2026-03-19",
    content: "A premium command center for AP with six core operating surfaces, shared state, and real-time situational awareness.",
  },
  {
    id: "doc-2",
    folder: "Code",
    title: "agent-routing.ts",
    type: "TS",
    createdAt: "2026-03-18",
    content: "export const assignAgent = (task) => task.priority === 'High' ? 'AP' : 'Nova';",
  },
  {
    id: "doc-3",
    folder: "Research",
    title: "Competitive Signals",
    type: "MD",
    createdAt: "2026-03-20",
    content: "Top-tier AI ops tools lean enterprise gray. Opportunity exists for a premium cyberpunk operator UI.",
  },
  {
    id: "doc-4",
    folder: "Reports",
    title: "Weekly Ops Digest",
    type: "PDF",
    createdAt: "2026-03-22",
    content: "Velocity up 18%. Agent idle time down 11%. Highest leverage work remains proactive synthesis.",
  },
  {
    id: "doc-5",
    folder: "Plans",
    title: "Q2 Autonomy Roadmap",
    type: "PLAN",
    createdAt: "2026-03-15",
    content: "Phase 1: visibility. Phase 2: autonomous scheduling. Phase 3: closed-loop delivery.",
  },
  {
    id: "doc-6",
    folder: "Other",
    title: "Founder Notes",
    type: "TXT",
    createdAt: "2026-03-14",
    content: "BDUBB wants the command center to feel expensive, sharp, and unmistakably agent-native.",
  },
];

export const team: TeamMember[] = [
  {
    id: "agent-1",
    name: "AP",
    role: "Lead Agent",
    aiSystem: "Codex",
    status: "Commanding",
    specialty: "Execution orchestration",
  },
  {
    id: "agent-2",
    name: "Nova",
    role: "Growth Analyst",
    aiSystem: "GPT-4",
    status: "Active",
    specialty: "Forecasting and market signals",
    leadId: "agent-1",
  },
  {
    id: "agent-3",
    name: "Kite",
    role: "Memory Architect",
    aiSystem: "Claude Opus",
    status: "Active",
    specialty: "Context pruning and retrieval",
    leadId: "agent-1",
  },
  {
    id: "agent-4",
    name: "Rune",
    role: "Research Operator",
    aiSystem: "GPT-4",
    status: "Scanning",
    specialty: "Competitor intelligence",
    leadId: "agent-1",
  },
  {
    id: "agent-5",
    name: "Echo",
    role: "Report Synthesist",
    aiSystem: "Claude Opus",
    status: "Scheduled",
    specialty: "Digest generation",
    leadId: "agent-1",
  },
];
