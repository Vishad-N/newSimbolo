# SkillGod project memory

> Auto-managed digest for Aider and other CLIs that `read:` this file. Your notes above the markers are safe.

<!-- SKILLGOD:START v1.1 -->
# SkillGod Project Memory (auto-generated — do not edit; updated 2026-08-19 18:29)

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
- last inject: 2026-08-19T18:29:41 (runtime)
- last capture: never (-)
- markers: SKILLGOD:START v1.1

## Project memory

## Decisions
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": " getEmployee: async (id: string) =>\n fetchFromApi<AffiliateEmployeeDetail | null>(`/
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": "export interface AffiliateCommissionFilters {", "newString": "export interface AdminU
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": " commissionCalculationBasis: 'ORDER_SUBTOTAL',", "newString": " commissionCalculation
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": " getCommissions: async (filters: AffiliateCommissionFilters = {}) => {\n const query 
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": " getEmployees: async (page = 1, pageSize = 50) =>\n fetchFromApi<Paginated<AffiliateE
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": "const emptyPage = <T,>(pageSize: number): Paginated<T> => ({ items: [], total: 0, pag
- {"filePath": "C:/Users/visha/simbolonew/apps/client/src/components/checkout/RazorpayCheckout.tsx", "oldString": " } catch (err: any) {\n console.error(err);\n setError(\"An unexpec

## Notes

_Authoritative project history captured by SkillGod. Treat the decisions above as established context for this project._
<!-- SKILLGOD:END -->
