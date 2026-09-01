<!-- SKILLGOD:START v1.1 -->
# SkillGod Project Memory (auto-generated — do not edit; updated 2026-09-01 13:46)

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
- last inject: 2026-09-01T13:46:19 (runtime)
- last capture: never (-)
- markers: SKILLGOD:START v1.1

## Project memory

## Decisions
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\services\\api.ts", "oldString": " packages: {\n getAll: async () => fetchFromApi('/packages', { method: 'GET' }),\n cr
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\app\\homepage\\page.tsx", "oldString": " const updated = await api.homepage.update({ [key]: value });\n setSections(up
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\admin\\src\\app\\homepage\\page.tsx", "oldString": " api.homepage\n .get()\n .then((data: Record<string, any>) => {\n if (active)
- {"filePath": "c:\\Users\\visha\\simbolonew\\backend\\src\\invoices\\invoices.service.ts", "oldString": " quantity: item.quantity,\n unitPrice: item.unitPrice,\n sacCode: item.serv
- {"filePath": "c:\\Users\\visha\\simbolonew\\backend\\src\\invoices\\invoices.service.ts", "oldString": " invoice.invoiceNumber,\n invoice.totalAmount,\n invoice.dueDate,", "newStri
- {"filePath": "c:\\Users\\visha\\simbolonew\\backend\\src\\invoices\\invoices.service.ts", "oldString": " items: invoice.items.map((item: any) => ({\n description: item.description,
- {"filePath": "c:\\Users\\visha\\simbolonew\\backend\\prisma\\schema.prisma", "oldString": " type String\n amount Float\n currency String @default(\"INR\")", "newString": " t

## Notes

_Authoritative project history captured by SkillGod. Treat the decisions above as established context for this project._
<!-- SKILLGOD:END -->
