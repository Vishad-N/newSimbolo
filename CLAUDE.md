<!-- SKILLGOD:START v1.1 -->
# SkillGod Project Memory (auto-generated — do not edit; updated 2026-09-02 15:54)

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
- last inject: 2026-09-02T15:54:22 (runtime)
- last capture: never (-)
- markers: SKILLGOD:START v1.1

## Project memory

## Decisions
- {"stdout": "diff --git a/apps/landing/src/components/auth/auth-modals.tsx b/apps/landing/src/components/auth/auth-modals.tsx\nindex 24bf091..c6f406e 100644\n--- a/apps/landing/src/
- {"filePath": "C:\\Users\\visha\\simbolonew\\apps\\landing\\src\\components\\auth\\auth-modals.tsx", "oldString": " const payload = await response.json();\n\n if (!response.ok) {\n 
- {"stdout": "â–² Next.js 16.2.11 (Turbopack)\n- Environments: .env.local\n\nâš The \"middleware\" file convention is deprecated. Please use \"proxy\" instead. Learn more: https://ne
- {"filePath": "C:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": " getAll: async () => fetchFromApi('/video-catalog?status=ALL', { method: 'GET' }),", 
- {"filePath": "C:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": " testimonials: {", "newString": " videoCatalog: {\n getAll: async () => fetchFromApi(
- {"filePath": "C:\\Users\\visha\\simbolonew\\backend\\prisma\\schema.prisma", "oldString": "// ==========================================\n// VIDEO EDITING SERVICE CATALOG\n// =====
- {"filePath": "C:\\Users\\visha\\simbolonew\\backend\\prisma\\schema.prisma", "oldString": "enum PackageTypeEnum {\n STARTER\n PROFESSIONAL\n ENTERPRISE\n CUSTOM\n}\n\nenum VideoPre

## Notes

_Authoritative project history captured by SkillGod. Treat the decisions above as established context for this project._
<!-- SKILLGOD:END -->
