import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ProfilesModule } from './profiles/profiles.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { MetricsInterceptor } from './common/interceptors/metrics.interceptor';
import { CustomValidationPipe } from './common/pipes/validation.pipe';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { PermissionsGuard } from './common/guards/permissions.guard';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { RequestContextMiddleware } from './common/middleware/request-context.middleware';
import { CsrfMiddleware } from './common/middleware/csrf.middleware';
import { RawBodyMiddleware } from './common/middleware/raw-body.middleware';
import { MediaModule } from './media/media.module';
import { WebsiteMediaModule } from './website-media/website-media.module';
import { CmsModule } from './cms/cms.module';
import { ServicesCatalogModule } from './services-catalog/services-catalog.module';
import { PackagesModule } from './packages/packages.module';
import { BlogsModule } from './blogs/blogs.module';
import { CaseStudiesModule } from './case-studies/case-studies.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { FaqModule } from './faq/faq.module';
import { SeoModule } from './seo/seo.module';
// Phase 7: Client Lifecycle & Agency Operations
import { ClientsModule } from './clients/clients.module';
import { CompaniesModule } from './companies/companies.module';
import { OrdersModule } from './orders/orders.module';
import { ProjectsModule } from './projects/projects.module';
import { TeamModule } from './team/team.module';
import { MilestonesModule } from './milestones/milestones.module';
import { TasksModule } from './tasks/tasks.module';
import { DeliverablesModule } from './deliverables/deliverables.module';
import { DocumentsModule } from './documents/documents.module';
import { MeetingsModule } from './meetings/meetings.module';
import { DashboardModule } from './dashboard/dashboard.module';
// Phase 8: Payments, Billing, Notifications & Real-Time Collaboration
import { PaymentsModule } from './payments/payments.module';
import { TransactionsModule } from './transactions/transactions.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { InvoicesModule } from './invoices/invoices.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ChatModule } from './chat/chat.module';
import { CommentsModule } from './comments/comments.module';
import { ActivityModule } from './activity/activity.module';
// Phase 9: AI, Analytics, Reporting & Business Intelligence
import { AnalyticsModule } from './analytics/analytics.module';
import { ReportsModule } from './reports/reports.module';
import { AiModule } from './ai/ai.module';
import { AutomationModule } from './automation/automation.module';
import { SearchModule } from './search/search.module';
import { BusinessAuditModule } from './audit/audit.module';
import { InsightsModule } from './insights/insights.module';
import { ExportsModule } from './exports/exports.module';
import { AppCacheModule } from './cache/cache.module';
import { QueuesModule } from './queues/queues.module';
import { ObservabilityModule } from './observability/observability.module';
import { StorageModule } from './storage/storage.module';
import { AssetsModule } from './assets/assets.module';
import { WebsiteTeamModule } from './website-team/website-team.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    SharedModule,
    AppCacheModule,
    QueuesModule,
    ObservabilityModule,
    StorageModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    ProfilesModule,
    HealthModule,
    MediaModule,
    WebsiteMediaModule,
    CmsModule,
    ServicesCatalogModule,
    PackagesModule,
    BlogsModule,
    CaseStudiesModule,
    PortfolioModule,
    TestimonialsModule,
    FaqModule,
    SeoModule,
    // Phase 7: Client Lifecycle & Agency Operations
    ClientsModule,
    CompaniesModule,
    OrdersModule,
    ProjectsModule,
    TeamModule,
    MilestonesModule,
    TasksModule,
    DeliverablesModule,
    DocumentsModule,
    MeetingsModule,
    DashboardModule,
    // Phase 8: Payments, Billing, Notifications & Real-Time Collaboration
    PaymentsModule,
    TransactionsModule,
    WebhooksModule,
    InvoicesModule,
    SubscriptionsModule,
    NotificationsModule,
    ChatModule,
    CommentsModule,
    ActivityModule,
    // Phase 9: AI, Analytics, Reporting & Business Intelligence
    AnalyticsModule,
    ReportsModule,
    AiModule,
    AutomationModule,
    SearchModule,
    BusinessAuditModule,
    InsightsModule,
    ExportsModule,
    ThrottlerModule.forRoot([
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
    AssetsModule,
    WebsiteTeamModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware, RequestLoggerMiddleware, CsrfMiddleware).forRoutes('*');
    // Raw body middleware for Razorpay webhook signature verification
    consumer.apply(RawBodyMiddleware).forRoutes('webhooks/razorpay');
  }
}
