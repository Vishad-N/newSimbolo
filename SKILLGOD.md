# SkillGod project memory

> Auto-managed digest for Aider and other CLIs that `read:` this file. Your notes above the markers are safe.

<!-- SKILLGOD:START v1.1 -->
# SkillGod Project Memory (auto-generated — do not edit; updated 2026-08-24 18:18)

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
- last inject: 2026-08-24T18:15:34 (runtime)
- last capture: never (-)
- markers: SKILLGOD:START v1.1

## Project memory

## Decisions
- {"stdout": "added 8 packages, removed 1 package, changed 5 packages, and audited 1272 packages in 15s\n\n314 packages are looking for funding\n run `npm fund` for details\n\n# npm 
- {"stdout": "npm warn config production Use `--omit=dev` instead.\n# npm audit report\n\nbrace-expansion 4.0.0 - 5.0.8\nSeverity: high\nbrace-expansion: DoS via unbounded intermedia
- {"stdout": "Upload and deploy project from the current directory.\n\nIf you're not signed in, signs you in or creates a Railway account (single unified OAuth flow â€” new accounts 
- {"questions": [{"question": "How do you want deploys to work going forward?", "header": "Deploy gating", "options": [{"label": "Add CI deploy step, keep auto-deploy too", "descript
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\client\\src\\services\\api.ts", "oldString": " if (!res.ok) {\n throw new Error(`API error: ${res.status}`);\n }\n return res.json
- {"filePath": "c:\\Users\\visha\\simbolonew\\backend\\src\\main.ts", "oldString": " const app = await NestFactory.create(AppModule, {\n bufferLogs: true,\n rawBody: true,\n });\n\n 
- {"filePath": "c:\\Users\\visha\\simbolonew\\backend\\src\\config\\auth.config.ts", "oldString": "import { registerAs } from '@nestjs/config';\nimport { AuthConfig } from './configu

## Notes

_Authoritative project history captured by SkillGod. Treat the decisions above as established context for this project._
<!-- SKILLGOD:END -->
