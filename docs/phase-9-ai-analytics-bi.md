# Phase 9: AI, Analytics, Reporting & Business Intelligence

Phase 9 adds a business intelligence layer on top of the existing operational schema. No database migration is required for this pass.

## Architecture

- `analytics/`: Admin/client analytics and KPI calculations from Prisma aggregates.
- `reports/`: Dynamic report generation for revenue, clients, projects, orders, payments, team, marketing, support, content, and website analytics.
- `exports/`: Report export formatter for PDF, CSV, and Excel-compatible SpreadsheetML.
- `ai/`: Provider abstraction with deterministic mock provider. Future OpenAI, Gemini, Claude, or other providers can implement the same provider interface.
- `insights/`: Generates operational recommendations and stores them in `GlobalSetting` records with category `AI_INSIGHT`.
- `automation/`: Stores workflow rules in `GlobalSetting` records with category `AUTOMATION_RULE`, then executes configured actions for supported triggers.
- `search/`: Enterprise search across clients, companies, projects, orders, services, packages, blogs, case studies, media, support tickets, and team members.
- `audit/`: Searchable audit and business log API over the existing `AuditLog` model.
- `dashboard/`: Phase 9 widget and KPI endpoints for admin and client dashboards.

## Storage

Existing models are reused:

- Analytics source data: `Order`, `Payment`, `Invoice`, `Project`, `Task`, `SupportTicket`, `PageView`, `EventLog`, `Timeline`.
- Search source data: major CMS, client, operations, media, and support models.
- Stored insights: `GlobalSetting.category = "AI_INSIGHT"`.
- Automation rules: `GlobalSetting.category = "AUTOMATION_RULE"`.
- Search history: `GlobalSetting.category = "SEARCH_HISTORY:{userId}"`.
- Audit logs: `AuditLog`.

## KPI Definitions

- Revenue Growth: percentage change between the latest two monthly revenue trend buckets.
- Conversion Rate: website inquiries divided by page views.
- Average Order Value: average `Order.netAmount`.
- Customer Lifetime Value: successful payment revenue divided by client count.
- Project Completion Rate: completed projects divided by total projects.
- Team Utilization: open assigned tasks with estimated and actual hours.
- Average Ticket Resolution Time: average time from ticket creation to close.
- Monthly Recurring Revenue and Client Satisfaction Score are exposed as future integration fields.

## Security

Phase 9 endpoints use existing RBAC decorators:

- `analytics.view`
- `reports.generate`
- `reports.export`
- `ai.use`
- `automation.manage`
- `audit.view`
- `dashboard.view`

`SUPER_ADMIN` keeps global access through the existing permission guard.

## Export Formats

- CSV includes branding, generation date, applied filters, rows, and totals.
- PDF includes branding, filters, first 100 rows, and totals.
- Excel export uses SpreadsheetML XML with `.xls` extension to avoid adding a runtime dependency.

## AI Integration

The AI module depends on an `AiProvider` interface. The current `MockAiProvider` is deterministic and safe for local development. A future provider can replace it by implementing:

```ts
interface AiProvider {
  readonly name: string;
  generate(dto: AiGenerationDto): Promise<AiGenerationResult>;
}
```

## Automation Workflow Engine

Supported triggers:

- `PROJECT_CREATED`
- `ORDER_PAID`
- `INVOICE_OVERDUE`
- `MILESTONE_COMPLETED`
- `DELIVERABLE_APPROVED`
- `TICKET_CLOSED`
- `NEW_CLIENT_REGISTERED`

Supported actions:

- `SEND_EMAIL`
- `CREATE_TASK`
- `ASSIGN_TEAM_MEMBER`
- `GENERATE_NOTIFICATION`
- `UPDATE_STATUS`
- `SCHEDULE_FOLLOW_UP`

Actions with no direct existing table integration are recorded to `Timeline` so execution remains auditable.
