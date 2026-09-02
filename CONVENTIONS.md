<!-- SKILLGOD:START v1.1 -->
# SkillGod Project Memory (auto-generated — do not edit; updated 2026-09-02 19:05)

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
- last inject: 2026-09-02T19:05:36 (runtime)
- last capture: never (-)
- markers: SKILLGOD:START v1.1

## Project memory

## Decisions
- {"filePath": "C:\\Users\\visha\\simbolonew\\apps\\landing\\src\\mock\\about.ts", "oldString": " cta: {\n title: \"Ready to Grow Your Business?\",\n subtitle: \"Let's build somethin
- {"stdout": "\"use client\";\n\nimport { aboutData } from \"@/mock/about\";\nimport { AboutHero } from \"@/components/about-us/AboutHero\";\nimport { OurStory } from \"@/components/
- {"stdout": "â–² Next.js 16.2.11 (Turbopack)\n- Environments: .env.local\n\nâš The \"middleware\" file convention is deprecated. Please use \"proxy\" instead. Learn more: https://ne
- {"filePath": "C:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": " caseStudies: {\n getAll: async () => fetchFromApi('/case-studies', { method: 'GET' }
- {"filePath": "C:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": " create: async (data: any) => fetchFromApi('/case-studies', { method: 'POST', body: J
- {"filePath": "C:\\Users\\visha\\simbolonew\\backend\\prisma\\schema.prisma", "oldString": "model CaseStudyMetric {\n id String @id @default(uuid()) @db.Uuid\n label String
- {"stdout": "165:enum CaseStudyStatusEnum {\n166- DRAFT\n167- IN_REVIEW\n168- PUBLISHED\n169- ARCHIVED\n170-}\n171-\n172-enum PortfolioStatusEnum {\n173- DRAFT\n174- PUBLISHED\n175-

## Notes

_Authoritative project history captured by SkillGod. Treat the decisions above as established context for this project._
<!-- SKILLGOD:END -->
