# SkillGod project memory

> Auto-managed digest for Aider and other CLIs that `read:` this file. Your notes above the markers are safe.

<!-- SKILLGOD:START v1.1 -->
# SkillGod Project Memory (auto-generated — do not edit; updated 2026-09-01 16:29)

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
- last inject: 2026-09-01T16:28:38 (runtime)
- last capture: never (-)
- markers: SKILLGOD:START v1.1

## Project memory

## Decisions
- {"stdout": " const json = await res.json();\n // The backend's global TransformInterceptor wraps every response in\n // { success, message, data }. Unwrap it here, once, so every c
- {"content":"---\ntitle: Controlling GitHub Autodeploys\ndescription: Learn how to configure GitHub autodeployments.\n---\n\n[Services linked to a GitHub repository](/services#deplo
- {"stdout": "\nVercel CLI 59.5.0 (Node.js 22.18.0)\n\n â–² vercel rollback url|deploymentId [options]\n\n Quickly revert back to a previous deployment \n\n Commands:
- {"results":[{"breadcrumb":"Build & deploy > Deployment Actions > Rollback","content":"A deployment rollback will revert to the previously successful deployment. Both the Docker\nim
- {"stdout": "Redeploy the latest deployment of a service\n\nUsage: railway.exe redeploy [OPTIONS]\n\nOptions:\n -s, --service <SERVICE> The service ID/name to redeploy from\n -e, --
- {"filePath": "c:\\Users\\visha\\simbolonew\\backend\\src\\ai\\ai.service.ts", "oldString": " async search(dto: AiSearchDto) {\n const query = dto.query.toLowerCase();\n const cache
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": " packages: {\n getAll: async () => fetchFromApi('/packages', { method: 'GET' }),\n cr

## Notes

_Authoritative project history captured by SkillGod. Treat the decisions above as established context for this project._
<!-- SKILLGOD:END -->
