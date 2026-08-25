# SkillGod project memory

> Auto-managed digest for Aider and other CLIs that `read:` this file. Your notes above the markers are safe.

<!-- SKILLGOD:START v1.1 -->
# SkillGod Project Memory (auto-generated — do not edit; updated 2026-08-25 13:05)

# SkillGod Active

Before any **non-trivial coding** task (implement, fix, refactor, debug, wire integrations):
1. Prefer shell: `sg inject "<task>"` (stdout only; exit 0 = success)
2. Or MCP `sg_inject_context` with the user task — if it stalls >5s, cancel and use CLI/digests
3. Digests in this block are the insurance policy when tools are skipped

After completing **meaningful** work (decisions, architecture, non-obvious fixes):
1. Shell: `sg capture --task "..." --output "..."`  **or**
2. MCP `sg_capture_turn` with task + short summary
3. Or `sg remember "decision: ..."`

**Also:** `sg find "<task>"` · `sg timeline` · `sg events --last 20` · `sg doctor`

## SkillGod health
- version: 1.0.1+794a995
- project_id: `visha-90fc8883`
- last inject: 2026-08-25T13:05:23 (runtime)
- last capture: never (-)
- markers: SKILLGOD:START v1.1

## Project memory

## Decisions
- {"stdout": "\u001b[33m[Nest] 29304 - \u001b[39m25/08/2026, 12:28:58 pm \u001b[33m WARN\u001b[39m \u001b[38;5;3m[OrdersService] \u001b[39m\u001b[33mOrder with identifier \"missing-i
- {"isAsync": true, "status": "async_launched", "agentId": "a525eea760a7e12a5", "description": "Audit frontend for waterfalled API calls", "resolvedModel": "claude-sonnet-5", "prompt
- {"filePath": "c:\\Users\\visha\\simbolonew\\backend\\src\\cms\\cms.service.ts", "oldString": " for (const [key, content] of Object.entries(sections)) {\n await this.updateSection(c
- {"isAsync": true, "status": "async_launched", "agentId": "ac99328ebfe322f35", "description": "Audit services for real N+1 query patterns", "resolvedModel": "claude-sonnet-5", "prom
- {"filePath": "c:\\Users\\visha\\simbolonew\\backend\\src\\prisma\\prisma.service.ts", "oldString": "import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/commo
- {"stdout": "added 8 packages, removed 1 package, changed 5 packages, and audited 1272 packages in 15s\n\n314 packages are looking for funding\n run `npm fund` for details\n\n# npm 
- {"stdout": "npm warn config production Use `--omit=dev` instead.\n# npm audit report\n\nbrace-expansion 4.0.0 - 5.0.8\nSeverity: high\nbrace-expansion: DoS via unbounded intermedia

## Notes

_Authoritative project history captured by SkillGod. Treat the decisions above as established context for this project._
<!-- SKILLGOD:END -->
