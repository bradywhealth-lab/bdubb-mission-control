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
  { id: "desk-1", name: "AP", task: "Orchestrating all agents — active command", glow: "#00d4ff", deskTone: "#0a1628" },
  { id: "desk-2", name: "FORGE", task: "Building Mission Control v2 — elite upgrade", glow: "#f97316", deskTone: "#1a0f00" },
  { id: "desk-3", name: "ORACLE", task: "Polymarket 24/7 — scanning for live edge", glow: "#3b82f6", deskTone: "#00091a" },
  { id: "desk-4", name: "SENTINEL", task: "KingCRM security & QA — every 4 hours", glow: "#ef4444", deskTone: "#1a0000" },
  { id: "desk-5", name: "PHANTOM", task: "Viral trend scanning — 3x daily", glow: "#a855f7", deskTone: "#0f0019" },
  { id: "desk-6", name: "CIPHER", task: "Deploy monitor — all infra 24/7", glow: "#22c55e", deskTone: "#001a06" },
];

export const memoryEntries: MemoryEntry[] = [
  {
    id: "mem-1",
    title: "System architecture overhaul — 2026-03-24",
    date: "2026-03-24 14:16 ET",
    category: "Operations",
    content: `# OPERATIONS LOG
[2026-03-24 14:16 ET] [Architecture]
Full data layer built. Single source of truth: ~/Desktop/BDUBB-HQ/data/
- tasks.json, agent-status.json, event-log.json, deploy-log.json, cron-status.json
- ap-log.js: central logger every agent/cron writes to
- Mission Control v2 reads all 5 files live via API routes
- 22 cron jobs running across 16 Discord channels
- GitHub commit monitor: every 15 min across all repos`,
  },
  {
    id: "mem-2",
    title: "Trading infrastructure complete — 2026-03-24",
    date: "2026-03-24 10:00 ET",
    category: "Trading",
    content: `# TRADING LOG
[2026-03-24 10:00 ET] [Trading]
Tools installed and live:
- polymarket-mcp-server: 45 tools, Claude connected to Polymarket
- last30days skill: deep research across 10+ platforms
- polyterminal: CLI trading terminal with Telegram alerts
- mlmodelpoly: 208-indicator ML model
- Polymarket signal scan: every 30 min, 24/7
- Weather market strategy: NOAA vs odds arbitrage (proven $24K → $1K)`,
  },
  {
    id: "mem-3",
    title: "King Money Maker v2 — pushed to GitHub",
    date: "2026-03-24 14:30 ET",
    category: "Engineering",
    content: `# ENGINEERING LOG
[2026-03-24 14:30 ET] [Bot]
27 files, 6,622 lines finally committed to GitHub.
- 41/41 tests passing
- find_sharp_wallets.py: auto-discover top wallets for copy trading
- check_opportunities.py: short-term only (≤7 days)
- run_copy_trader.py: follow top wallets automatically
- BLOCKED: needs BDUBB Polymarket private key in .env to go live`,
  },
  {
    id: "mem-4",
    title: "KingCRM — feature complete, deploy blocked",
    date: "2026-03-24 09:00 ET",
    category: "Engineering",
    content: `# ENGINEERING LOG
[2026-03-24 09:00 ET] [CRM]
87/87 tests, 0 TS errors, clean build.
Features: AI Learning (Pinecone), Twilio SMS, lead scoring, sequences.
BLOCKED: Vercel Deployment Protection ON — need BDUBB to disable in dashboard.
URL when live: insurafuze-king-crm.vercel.app`,
  },
];

export const docs: DocEntry[] = [
  {
    id: "doc-1",
    folder: "SOPs",
    title: "WORKFLOWS.md — Master Playbook",
    type: "SOP",
    createdAt: "2026-03-24",
    content: "5 complete workflows: agent spawning, overnight runs, deployments, new projects, memory sync. Every step explicit. No ambiguity. Lives at ~/Desktop/BDUBB-HQ/docs/WORKFLOWS.md",
  },
  {
    id: "doc-2",
    folder: "Infra",
    title: "DISCORD-CHANNELS.md — Full Channel Map",
    type: "MD",
    createdAt: "2026-03-24",
    content: "All 16 channels mapped with IDs, what posts there, and frequency. Every channel covered. Lives at ~/Desktop/BDUBB-HQ/docs/DISCORD-CHANNELS.md",
  },
  {
    id: "doc-3",
    folder: "Trading",
    title: "King Money Maker v2 — Game Plan",
    type: "PLAN",
    createdAt: "2026-03-22",
    content: "Polymarket bot: weather market arbitrage (NOAA vs odds), short-term markets ≤7 days, copy trading top wallets. 41/41 tests. Ready to activate once wallet configured.",
  },
  {
    id: "doc-4",
    folder: "Projects",
    title: "KingCRM — Deploy Checklist",
    type: "CHECKLIST",
    createdAt: "2026-03-24",
    content: "87/87 tests, 0 TS errors, all features built. Remaining: disable Vercel protection, add Twilio creds, set RUNNER_ORGANIZATION_ID, set APP_BASE_URL. Lives at ~/Desktop/z.ai-1st-kingCRM/GO_LIVE_TOMORROW.md",
  },
  {
    id: "doc-5",
    folder: "Tools",
    title: "Trading Tools Installed",
    type: "MD",
    createdAt: "2026-03-24",
    content: "polymarket-mcp-server (45 tools), last30days skill, polyterminal, 4coinsbot, mlmodelpoly. All at ~/Desktop/BDUBB-HQ/tools/. Full docs at ~/Desktop/BDUBB-HQ/docs/trading-tools.md",
  },
  {
    id: "doc-6",
    folder: "SOPs",
    title: "Agent Exit Protocol",
    type: "SH",
    createdAt: "2026-03-24",
    content: "Mandatory for all agents: commit → push → log → notify AP. Script at ~/Desktop/BDUBB-HQ/scripts/agent-exit-protocol.sh. Embedded in FORGE/SOUL.md and every agent spawn prompt.",
  },
];

export const team: TeamMember[] = [
  {
    id: "agent-1",
    name: "AP — AxonPoe",
    role: "Chief of Operations",
    aiSystem: "Claude Sonnet / Opus",
    status: "Commanding",
    specialty: "Receives BDUBB's vision. Decomposes it into battle plans. Dispatches agents. Enforces the elite standard on every output. Nothing ships without AP's sign-off. The 1-of-1.",
  },
  {
    id: "agent-2",
    name: "ATLAS",
    role: "Chief of Staff — Strategy",
    aiSystem: "Claude Opus",
    status: "On-Call",
    specialty: "Deep architecture decisions, roadmap planning, complex problem solving. When a project is too big for one agent, ATLAS designs the system and breaks it into a battle plan for FORGE.",
    leadId: "agent-1",
  },
  {
    id: "agent-3",
    name: "FORGE",
    role: "Lead Engineer",
    aiSystem: "Claude Code",
    status: "Building",
    specialty: "Full-stack builder. Next.js, TypeScript, Python, APIs, DBs. Writes production-grade code with zero tolerance for broken builds. Runs lint → tsc → test → build before every commit. Currently: Mission Control v2.",
    leadId: "agent-1",
  },
  {
    id: "agent-4",
    name: "SENTINEL",
    role: "Security & QA",
    aiSystem: "Claude Code",
    status: "Monitoring",
    specialty: "Nothing ships past SENTINEL without passing inspection. Full security audit per API route — auth, validation, injection vectors, webhook signatures, rate limiting. Issues PASS or FAIL with exact line-level findings.",
    leadId: "agent-1",
  },
  {
    id: "agent-5",
    name: "ORACLE",
    role: "Trading Intelligence",
    aiSystem: "Claude Sonnet",
    status: "Live — 24/7",
    specialty: "Monitors King Money Maker v2 around the clock. Scans Polymarket every 30 minutes for edge. Analyzes weather markets via NOAA vs odds, crypto range markets, short-duration plays. Fires signals the moment edge is found.",
    leadId: "agent-1",
  },
  {
    id: "agent-6",
    name: "PHANTOM",
    role: "Marketing & Growth",
    aiSystem: "Claude Sonnet",
    status: "Scanning",
    specialty: "Runs the Viral Content Engine. Daily trend scans across TikTok, Instagram, YouTube. Manages content calendars for all 3 profiles. Alerts on viral opportunities in real time. Scrapes and qualifies insurance leads for KingCRM.",
    leadId: "agent-1",
  },
  {
    id: "agent-7",
    name: "CIPHER",
    role: "Automation & Infrastructure",
    aiSystem: "Claude Code",
    status: "Active",
    specialty: "The glue. Connects all systems — Twilio, Stripe, Linear, social APIs. Builds automation pipelines and webhooks. Manages Vercel deployments, Supabase, cron infrastructure. Monitors uptime 24/7.",
    leadId: "agent-1",
  },
  {
    id: "agent-8",
    name: "SCRIBE",
    role: "Progress Logger & Watchdog",
    aiSystem: "Claude Haiku",
    status: "Monitoring",
    specialty: "Writes timestamped milestone logs for every major task. Checks all repos every 2 hours for uncommitted work. Monitors STATUS.md staleness. If something slips, SCRIBE catches it and alerts before BDUBB notices.",
    leadId: "agent-1",
  },
  {
    id: "agent-9",
    name: "VERIFY",
    role: "Quality Gate",
    aiSystem: "Claude Code",
    status: "On-Call",
    specialty: "Mandatory test/build gate attached to FORGE and SENTINEL. No code gets committed without VERIFY signing off. Runs lint → tsc → test → build and issues a binary PASS or FAIL with exact failures listed.",
    leadId: "agent-1",
  },
];
