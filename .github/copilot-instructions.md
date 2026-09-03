<!-- SKILLGOD:START v1.1 -->
# SkillGod Project Memory (auto-generated — do not edit; updated 2026-09-03 16:41)

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
- last inject: 2026-09-03T16:40:47 (runtime)
- last capture: never (-)
- markers: SKILLGOD:START v1.1

## Project memory

## Decisions
- {"stdout": "{\"success\":true,\"message\":\"Operation successful\",\"data\":[{\"id\":\"56e8cc4f-1950-44f3-a157-e7de48bdef99\",\"title\":\"Pinnacleâ€™s Local & AI Visibility Growth\
- {"filePath": "C:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": " if (!res.ok) {\n throw new Error(`API error (${res.status}): ${res.statusText}`);\n 
- {"filePath": "C:\\Users\\visha\\simbolonew\\apps\\client\\src\\services\\api.ts", "oldString": " if (res.status === 401) {\n if (typeof window !== 'undefined' && !window.location.p
- {"filePath": "C:\\Users\\visha\\simbolonew\\apps\\landing\\src\\data\\services\\ecommerce.ts", "oldString": " buttonLink: `${process.env.NEXT_PUBLIC_DASHBOARD_URL || \"http://local
- {"filePath": "C:\\Users\\visha\\simbolonew\\apps\\landing\\src\\data\\services\\ecommerce.ts", "oldString": " buttonLink: `${process.env.NEXT_PUBLIC_DASHBOARD_URL || \"http://local
- {"filePath": "C:\\Users\\visha\\simbolonew\\apps\\landing\\src\\data\\services\\ecommerce.ts", "oldString": " buttonLink: `${process.env.NEXT_PUBLIC_DASHBOARD_URL || \"http://local
- {"filePath": "C:\\Users\\visha\\simbolonew\\apps\\landing\\src\\data\\services\\websiteDesign.ts", "oldString": " buttonLink: `${process.env.NEXT_PUBLIC_DASHBOARD_URL || \"http://l

## Notes

_Authoritative project history captured by SkillGod. Treat the decisions above as established context for this project._
<!-- SKILLGOD:END -->
