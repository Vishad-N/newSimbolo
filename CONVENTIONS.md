# Project conventions

> SkillGod manages the memory block below.

<!-- SKILLGOD:START v1.1 -->
# SkillGod Project Memory (auto-generated — do not edit; updated 2026-08-21 16:03)

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
- last inject: 2026-08-21T16:03:14 (runtime)
- last capture: never (-)
- markers: SKILLGOD:START v1.1

## Project memory

## Decisions
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": "export interface CreateAffiliateEmployeePayload {\n userId: string;\n commissionRate?
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": " activateEmployee: async (id: string) =>\n fetchFromApi(`/admin/affiliate/employees/$
- {"stdout": "- Environments: .env.local\n\nâš The \"middleware\" file convention is deprecated. Please use \"proxy\" instead. Learn more: https://nextjs.org/docs/messages/middleware
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": " getEmployee: async (id: string) =>\n fetchFromApi<AffiliateEmployeeDetail | null>(`/
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": "export interface AffiliateCommissionFilters {", "newString": "export interface AdminU
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": " commissionCalculationBasis: 'ORDER_SUBTOTAL',", "newString": " commissionCalculation
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": " getCommissions: async (filters: AffiliateCommissionFilters = {}) => {\n const query 

## Notes

_Authoritative project history captured by SkillGod. Treat the decisions above as established context for this project._
<!-- SKILLGOD:END -->
