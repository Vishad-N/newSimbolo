"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const config_module_1 = require("./config/config.module");
const prisma_module_1 = require("./prisma/prisma.module");
const shared_module_1 = require("./shared/shared.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const health_module_1 = require("./health/health.module");
const roles_module_1 = require("./roles/roles.module");
const permissions_module_1 = require("./permissions/permissions.module");
const profiles_module_1 = require("./profiles/profiles.module");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const timeout_interceptor_1 = require("./common/interceptors/timeout.interceptor");
const metrics_interceptor_1 = require("./common/interceptors/metrics.interceptor");
const validation_pipe_1 = require("./common/pipes/validation.pipe");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const permissions_guard_1 = require("./common/guards/permissions.guard");
const request_logger_middleware_1 = require("./common/middleware/request-logger.middleware");
const request_context_middleware_1 = require("./common/middleware/request-context.middleware");
const csrf_middleware_1 = require("./common/middleware/csrf.middleware");
const raw_body_middleware_1 = require("./common/middleware/raw-body.middleware");
const media_module_1 = require("./media/media.module");
const cms_module_1 = require("./cms/cms.module");
const services_catalog_module_1 = require("./services-catalog/services-catalog.module");
const packages_module_1 = require("./packages/packages.module");
const blogs_module_1 = require("./blogs/blogs.module");
const case_studies_module_1 = require("./case-studies/case-studies.module");
const portfolio_module_1 = require("./portfolio/portfolio.module");
const testimonials_module_1 = require("./testimonials/testimonials.module");
const faq_module_1 = require("./faq/faq.module");
const seo_module_1 = require("./seo/seo.module");
// Phase 7: Client Lifecycle & Agency Operations
const clients_module_1 = require("./clients/clients.module");
const companies_module_1 = require("./companies/companies.module");
const orders_module_1 = require("./orders/orders.module");
const projects_module_1 = require("./projects/projects.module");
const team_module_1 = require("./team/team.module");
const milestones_module_1 = require("./milestones/milestones.module");
const tasks_module_1 = require("./tasks/tasks.module");
const deliverables_module_1 = require("./deliverables/deliverables.module");
const documents_module_1 = require("./documents/documents.module");
const meetings_module_1 = require("./meetings/meetings.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
// Phase 8: Payments, Billing, Notifications & Real-Time Collaboration
const payments_module_1 = require("./payments/payments.module");
const transactions_module_1 = require("./transactions/transactions.module");
const webhooks_module_1 = require("./webhooks/webhooks.module");
const invoices_module_1 = require("./invoices/invoices.module");
const subscriptions_module_1 = require("./subscriptions/subscriptions.module");
const notifications_module_1 = require("./notifications/notifications.module");
const chat_module_1 = require("./chat/chat.module");
const comments_module_1 = require("./comments/comments.module");
const activity_module_1 = require("./activity/activity.module");
// Phase 9: AI, Analytics, Reporting & Business Intelligence
const analytics_module_1 = require("./analytics/analytics.module");
const reports_module_1 = require("./reports/reports.module");
const ai_module_1 = require("./ai/ai.module");
const automation_module_1 = require("./automation/automation.module");
const search_module_1 = require("./search/search.module");
const audit_module_1 = require("./audit/audit.module");
const insights_module_1 = require("./insights/insights.module");
const exports_module_1 = require("./exports/exports.module");
const cache_module_1 = require("./cache/cache.module");
const queues_module_1 = require("./queues/queues.module");
const observability_module_1 = require("./observability/observability.module");
const storage_module_1 = require("./storage/storage.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(request_context_middleware_1.RequestContextMiddleware, request_logger_middleware_1.RequestLoggerMiddleware, csrf_middleware_1.CsrfMiddleware).forRoutes('*');
        // Raw body middleware for Razorpay webhook signature verification
        consumer.apply(raw_body_middleware_1.RawBodyMiddleware).forRoutes('webhooks/razorpay');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_module_1.ConfigModule,
            prisma_module_1.PrismaModule,
            shared_module_1.SharedModule,
            cache_module_1.AppCacheModule,
            queues_module_1.QueuesModule,
            observability_module_1.ObservabilityModule,
            storage_module_1.StorageModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
            profiles_module_1.ProfilesModule,
            health_module_1.HealthModule,
            media_module_1.MediaModule,
            cms_module_1.CmsModule,
            services_catalog_module_1.ServicesCatalogModule,
            packages_module_1.PackagesModule,
            blogs_module_1.BlogsModule,
            case_studies_module_1.CaseStudiesModule,
            portfolio_module_1.PortfolioModule,
            testimonials_module_1.TestimonialsModule,
            faq_module_1.FaqModule,
            seo_module_1.SeoModule,
            // Phase 7: Client Lifecycle & Agency Operations
            clients_module_1.ClientsModule,
            companies_module_1.CompaniesModule,
            orders_module_1.OrdersModule,
            projects_module_1.ProjectsModule,
            team_module_1.TeamModule,
            milestones_module_1.MilestonesModule,
            tasks_module_1.TasksModule,
            deliverables_module_1.DeliverablesModule,
            documents_module_1.DocumentsModule,
            meetings_module_1.MeetingsModule,
            dashboard_module_1.DashboardModule,
            // Phase 8: Payments, Billing, Notifications & Real-Time Collaboration
            payments_module_1.PaymentsModule,
            transactions_module_1.TransactionsModule,
            webhooks_module_1.WebhooksModule,
            invoices_module_1.InvoicesModule,
            subscriptions_module_1.SubscriptionsModule,
            notifications_module_1.NotificationsModule,
            chat_module_1.ChatModule,
            comments_module_1.CommentsModule,
            activity_module_1.ActivityModule,
            // Phase 9: AI, Analytics, Reporting & Business Intelligence
            analytics_module_1.AnalyticsModule,
            reports_module_1.ReportsModule,
            ai_module_1.AiModule,
            automation_module_1.AutomationModule,
            search_module_1.SearchModule,
            audit_module_1.BusinessAuditModule,
            insights_module_1.InsightsModule,
            exports_module_1.ExportsModule,
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'default',
                    ttl: 60000,
                    limit: 100,
                },
                {
                    name: 'chat',
                    ttl: 10000,
                    limit: 30, // Rate limit chat messages: 30 per 10 seconds
                },
            ]),
        ],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: global_exception_filter_1.GlobalExceptionFilter,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: transform_interceptor_1.TransformInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: timeout_interceptor_1.TimeoutInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: metrics_interceptor_1.MetricsInterceptor,
            },
            {
                provide: core_1.APP_PIPE,
                useClass: validation_pipe_1.CustomValidationPipe,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: permissions_guard_1.PermissionsGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map