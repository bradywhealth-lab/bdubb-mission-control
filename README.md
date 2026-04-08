# Mission Control — Agency2 Dashboard

Mission Control is the centralized operations and governance platform for Agency2.
It reflects the live operating docs in `~/.openclaw/workspace-agency2/` — not drift from them.

## Live Document References

Mission Control exposes these live documents clearly:

- `~/.openclaw/workspace-agency2/MASTER-CONTEXT.md`
- `~/.openclaw/workspace-agency2/AGENTS.md`
- `~/.openclaw/workspace-agency2/BA-CONSTITUTION.md`
- `~/.openclaw/workspace-agency2/BA-PREFERENCES.md`
- `~/.openclaw/workspace-agency2/USER.md`
- `~/.openclaw/workspace-agency2/PROJECTS-CONTEXT.md`
- `~/.openclaw/workspace-agency2/TASK-STATE.md`
- `~/.openclaw/workspace-agency2/memory/` (daily logs)

## The 9 Agency2 Agents

| Agent | Role | Model |
|-------|------|-------|
| **BA** | Front-door Operator | Claude Sonnet 4.6 |
| **Scout** | Creative Engine | Kimi K2.5 |
| **Sentinel** | Anti-Drift Watchdog | Kimi K2.5 |
| **Blacksmith** | Complex Lead Builder | Claude Sonnet 4.6 |
| **Borealis** | Medium Builder | GPT-5.1 Codex Mini |
| **Blitz** | Quick Builder | GPT-5 Mini |
| **Inspector** | QA and Release Gate | GPT-5.1 |
| **Curator** | Knowledge Manager | Kimi K2.5 |
| **Upgrader** | Optimization | Kimi K2.5 |

## Philosophy

Mission Control is a window into Agency2, not a second source of truth.
If docs change in the workspace, Mission Control should show the updated docs.

- Keep docs page aligned with Agency2 canonical files
- Keep handoffs/audits visible
- Keep deploys, agent state, and cron state visible
- Never let dashboard content lag behind operating reality

## Running Locally

```bash
cd /home/deployer/bdubb-mission-control
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Data Files

All data files are in `./data/`:

- `tasks.json` — Kanban tasks
- `agent-status.json` — Agent live state
- `cron-status.json` — Scheduled jobs
- `deploy-log.json` — Deployment history
- `event-log.json` — Activity feed
