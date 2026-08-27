# SkillGod project memory

> Auto-managed digest for Aider and other CLIs that `read:` this file. Your notes above the markers are safe.

<!-- SKILLGOD:START v1.1 -->
# SkillGod Project Memory (auto-generated — do not edit; updated 2026-08-27 11:11)

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
- last inject: 2026-08-27T11:11:48 (runtime)
- last capture: never (-)
- markers: SKILLGOD:START v1.1

## Project memory

## Decisions
- {"stdout": "Sign in to Railway â€” also creates a new account if you don't have one.\n\nUses a single OAuth flow for both sign-in and sign-up. Brand-new accounts are detected autom
- {"stdout": "Upload and deploy project from the current directory.\n\nIf you're not signed in, signs you in or creates a Railway account (single unified OAuth flow â€” new accounts 
- {"filePath": "c:\\Users\\visha\\simbolonew\\backend\\src\\invoices\\invoices.service.ts", "oldString": " supplierStateCode: process.env.SUPPLIER_STATE_CODE || '23',\n };", "newStri
- {"filePath": "c:\\Users\\visha\\simbolonew\\backend\\src\\invoices\\invoices.service.ts", "oldString": " title: `Tax Invoice ${invoiceNumber} generated`,", "newString": " title: `T
- {"filePath": "c:\\Users\\visha\\simbolonew\\backend\\src\\invoices\\invoices.service.ts", "oldString": " const taxResult = this.taxService.calculateTax(taxParams);\n const { number
- {"mode": "content", "numFiles": 0, "filenames": [], "content": "90- featured: Boolean(pkg.isPopular),\n91- status: \"published\",\n92- displayOrder: index,\n93: buttonText: \"Choos
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\landing\\src\\components\\websiteDesign\\WebsiteDesignPage.tsx", "oldString": " <PricingSection title=\"Website Maintenance Packag

## Notes

_Authoritative project history captured by SkillGod. Treat the decisions above as established context for this project._
<!-- SKILLGOD:END -->
