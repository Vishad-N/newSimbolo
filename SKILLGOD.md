# SkillGod project memory

> Auto-managed digest for Aider and other CLIs that `read:` this file. Your notes above the markers are safe.

<!-- SKILLGOD:START v1.1 -->
# SkillGod Project Memory (auto-generated — do not edit; updated 2026-09-01 19:39)

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
- last inject: 2026-09-01T19:39:13 (runtime)
- last capture: never (-)
- markers: SKILLGOD:START v1.1

## Project memory

## Decisions
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": " caseStudies: {\n getAll: async () => fetchFromApi('/case-studies', { method: 'GET' }
- {"stdout": "0b97f99 Happy diwali fools\n651980f Rascals\nf93bac0 new\n41e9a1f op\n801da72 feat(landing): redesign package cards into premium SaaS preview tiles and complete Phase 5
- {"filePath": "c:\\Users\\visha\\simbolonew\\.github\\workflows\\production-ci.yml", "oldString": " npx vercel pull --yes --environment=production --token=\"$VERCEL_TOKEN\"\n npx ve
- {"bytes": 346708, "code": 200, "codeText": "OK", "result": "# Vercel's Upload Rate Limit Explanation\n\nBased on the discussion, the \"5000\" in Vercel's `api-upload-free` rate lim
- {"stdout": " const json = await res.json();\n // The backend's global TransformInterceptor wraps every response in\n // { success, message, data }. Unwrap it here, once, so every c
- {"content":"---\ntitle: Controlling GitHub Autodeploys\ndescription: Learn how to configure GitHub autodeployments.\n---\n\n[Services linked to a GitHub repository](/services#deplo
- {"stdout": "\nVercel CLI 59.5.0 (Node.js 22.18.0)\n\n â–² vercel rollback url|deploymentId [options]\n\n Quickly revert back to a previous deployment \n\n Commands:

## Notes

_Authoritative project history captured by SkillGod. Treat the decisions above as established context for this project._
<!-- SKILLGOD:END -->
