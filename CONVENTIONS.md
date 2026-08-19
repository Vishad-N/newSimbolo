# Project conventions

> SkillGod manages the memory block below.

<!-- SKILLGOD:START v1.1 -->
# SkillGod Project Memory (auto-generated — do not edit; updated 2026-08-19 17:51)

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
- last inject: 2026-08-19T17:51:47 (runtime)
- last capture: never (-)
- markers: SKILLGOD:START v1.1

## Project memory

## Decisions
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": " commissionCalculationBasis: 'ORDER_SUBTOTAL',", "newString": " commissionCalculation
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": " getCommissions: async (filters: AffiliateCommissionFilters = {}) => {\n const query 
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": " getEmployees: async (page = 1, pageSize = 50) =>\n fetchFromApi<Paginated<AffiliateE
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": "const emptyPage = <T,>(pageSize: number): Paginated<T> => ({ items: [], total: 0, pag
- {"filePath": "C:/Users/visha/simbolonew/apps/client/src/components/checkout/RazorpayCheckout.tsx", "oldString": " } catch (err: any) {\n console.error(err);\n setError(\"An unexpec
- {"filePath": "C:/Users/visha/simbolonew/apps/client/src/components/checkout/RazorpayCheckout.tsx", "oldString": " const orderRes = await fetch(\"/api/checkout\", {\n method: \"POST
- {"isAsync": true, "status": "async_launched", "agentId": "a186a7b122c44bae7", "description": "Implement affiliate commission backend system", "resolvedModel": "claude-opus-5", "pro

## Notes

_Authoritative project history captured by SkillGod. Treat the decisions above as established context for this project._
<!-- SKILLGOD:END -->
