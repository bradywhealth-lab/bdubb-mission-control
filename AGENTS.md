# Agency2 Agent Reference

This Mission Control dashboard reflects the live state of Agency2.

For the full agent roster, roles, models, skills, tools, boundaries, routing rules, and handoff protocol, see:

**`~/.openclaw/workspace-agency2/AGENTS.md`**

## Quick Reference

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

## Routing Rules

| Input Type | Route To |
|------------|----------|
| Vague / ambiguous / strategic | BA |
| Ideas / enhancements / monetization | Scout |
| Drift / stale / health / blocked | Sentinel |
| Complex build / architecture | Blacksmith |
| Medium feature / integration | Borealis |
| Quick fix / patch / script | Blitz |
| QA / release / audit | Inspector |
| Docs / memory / research synthesis | Curator |
| Cost / benchmarking / tooling improvements | Upgrader |
