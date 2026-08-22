# SkillGod project memory

> Auto-managed digest for Aider and other CLIs that `read:` this file. Your notes above the markers are safe.

<!-- SKILLGOD:START v1.1 -->
# SkillGod Project Memory (auto-generated — do not edit; updated 2026-08-22 16:07)

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
- last inject: 2026-08-22T16:07:50 (runtime)
- last capture: never (-)
- markers: SKILLGOD:START v1.1

## Project memory

## Decisions
- {"filePath": "c:\\Users\\visha\\simbolonew\\backend\\src\\payments\\payments.service.ts", "oldString": " // Program settings are read outside the transaction to keep it short.\n co
- {"questions": [{"question": "Want me to fix this now by unifying the webhook and client-verify payment paths into one shared settlement method?", "header": "Fix now?", "options": [
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\client\\src\\app\\documents\\page.tsx", "oldString": " onUpload={async (files) => {\n // Mock upload\n await new Promise(r =>
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\landing\\src\\components\\websiteDesign\\WebsiteDesignPage.tsx", "oldString": "import { PhoneNumberFields } from \"@/components/ui
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\landing\\src\\components\\websiteDesign\\WebsiteDesignPage.tsx", "oldString": " <LeadForm title=\"Request Free Consultation\" desc
- {"mode": "content", "numFiles": 0, "filenames": [], "content": "c:\\Users\\visha\\simbolonew\\apps\\landing\\src\\components\\websiteDesign\\WebsiteDesignPage.tsx:6:import { LeadFo
- {"filePath": "c:\\Users\\visha\\simbolonew\\apps\\client\\src\\components\\checkout\\RazorpayCheckout.tsx", "oldString": " setIsProcessing(true);\n setError(null);\n\n const mockKe

## Notes

_Authoritative project history captured by SkillGod. Treat the decisions above as established context for this project._
<!-- SKILLGOD:END -->
