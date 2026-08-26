# SkillGod project memory

> Auto-managed digest for Aider and other CLIs that `read:` this file. Your notes above the markers are safe.

<!-- SKILLGOD:START v1.1 -->
# SkillGod Project Memory (auto-generated — do not edit; updated 2026-08-26 17:15)

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
- last inject: 2026-08-26T17:15:30 (runtime)
- last capture: never (-)
- markers: SKILLGOD:START v1.1

## Project memory

## Decisions
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\landing\\src\\components\\shared\\ServiceCard.tsx", "oldString": " {service.startingPrice && (\n <div className=\"relative mt-5 bo
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\landing\\src\\components\\shared\\ServiceCard.tsx", "oldString": "export type ServiceCardData = {\n id: string;\n title: string;\n
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": " getCategories: async () => fetchFromApi('/blogs/categories', { method: 'GET' }),", "
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": " clients: {\n getAll: async () => fetchFromApi('/clients', { method: 'GET' }),\n crea
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": "export interface AdminUserSearchResult {\n id: string;\n email: string;\n firstName?:
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": " getAuthors: async () => fetchFromApi('/blogs/authors', { method: 'GET' }),\n create:
- {"stdout": "\nVercel CLI 59.5.0 (Node.js 22.18.0)\nDeploying simbolo-admin\nUploading [--------------------] (0.0B/6.9MB)\nUploading [=====---------------] (1.7MB/6.9MB)\nUploading

## Notes

_Authoritative project history captured by SkillGod. Treat the decisions above as established context for this project._
<!-- SKILLGOD:END -->
