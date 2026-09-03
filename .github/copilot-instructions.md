<!-- SKILLGOD:START v1.1 -->
# SkillGod Project Memory (auto-generated — do not edit; updated 2026-09-03 13:29)

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
- last inject: 2026-09-03T13:29:37 (runtime)
- last capture: never (-)
- markers: SKILLGOD:START v1.1

## Project memory

## Decisions
- {"stdout": "âš The \"middleware\" file convention is deprecated. Please use \"proxy\" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy\n Creating an optimi
- {"stdout": "âš The \"middleware\" file convention is deprecated. Please use \"proxy\" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy\n Creating an optimi
- {"filePath": "C:\\Users\\visha\\simbolonew\\backend\\prisma\\schema.prisma", "oldString": " status CaseStudyStatusEnum @default(DRAFT)\n publishDate DateTime?\n clientName String\n
- {"stdout": "âš The \"middleware\" file convention is deprecated. Please use \"proxy\" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy\n Creating an optimi
- {"filePath": "C:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": " addMetric: async (data: { label: string; value: string; changePercentage?: string; p
- {"filePath": "C:\\Users\\visha\\simbolonew\\backend\\src\\case-studies\\dto\\create-before-after.dto.ts", "oldString": " @ApiProperty({ example: 'c0a80123-4567-89ab-cdef-0123456789
- {"filePath": "C:\\Users\\visha\\simbolonew\\backend\\prisma\\schema.prisma", "oldString": "model BeforeAfterComparison {\n id String @id @default(uuid()) @db.Uuid\n title String

## Notes

_Authoritative project history captured by SkillGod. Treat the decisions above as established context for this project._
<!-- SKILLGOD:END -->
