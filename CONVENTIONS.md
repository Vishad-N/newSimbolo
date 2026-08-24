<!-- SKILLGOD:START v1.1 -->
# SkillGod Project Memory (auto-generated — do not edit; updated 2026-08-24 17:57)

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
- last inject: 2026-08-24T17:57:40 (runtime)
- last capture: never (-)
- markers: SKILLGOD:START v1.1

## Project memory

## Decisions
- {"stdout": "Upload and deploy project from the current directory.\n\nIf you're not signed in, signs you in or creates a Railway account (single unified OAuth flow â€” new accounts 
- {"questions": [{"question": "How do you want deploys to work going forward?", "header": "Deploy gating", "options": [{"label": "Add CI deploy step, keep auto-deploy too", "descript
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\client\\src\\services\\api.ts", "oldString": " if (!res.ok) {\n throw new Error(`API error: ${res.status}`);\n }\n return res.json
- {"filePath": "c:\\Users\\visha\\simbolonew\\backend\\src\\main.ts", "oldString": " const app = await NestFactory.create(AppModule, {\n bufferLogs: true,\n rawBody: true,\n });\n\n 
- {"filePath": "c:\\Users\\visha\\simbolonew\\backend\\src\\config\\auth.config.ts", "oldString": "import { registerAs } from '@nestjs/config';\nimport { AuthConfig } from './configu
- {"stdout": "Severity: high\nbrace-expansion: DoS via unbounded intermediate arrays, bypassing the CVE-2026-14257 mitigation - https://github.com/advisories/GHSA-rgw5-rvv9-x895\nfix
- {"isAsync": true, "status": "async_launched", "agentId": "aa04c52963ba341dc", "description": "Production-readiness audit of backend", "resolvedModel": "claude-sonnet-5", "prompt": 

## Notes

_Authoritative project history captured by SkillGod. Treat the decisions above as established context for this project._
<!-- SKILLGOD:END -->
