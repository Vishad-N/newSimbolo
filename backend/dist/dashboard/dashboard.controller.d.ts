import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getAdminOverview(): Promise<{
        metrics: {
            totalClients: number;
            activeProjects: number;
            openTickets: number;
            pendingDeliverables: number;
            upcomingMeetings: number;
            monthlyRevenue: number;
        };
        projectsByStatus: {
            status: import(".prisma/client").$Enums.ProjectStatusEnum;
            count: number;
        }[];
        recentActivity: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
            } | null;
            project: {
                id: string;
                name: string;
            } | null;
            client: ({
                user: {
                    id: string;
                    firstName: string;
                    lastName: string;
                };
            } & {
                id: string;
                createdAt: Date;
                userId: string;
                status: string;
                agencyId: string | null;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                state: string | null;
                gstNumber: string | null;
                billingAddress: string | null;
                timezone: string;
                companyId: string | null;
                accountManagerId: string | null;
                notes: string | null;
                legalName: string | null;
                stateCode: string | null;
                pincode: string | null;
                country: string | null;
                gstRegistered: boolean;
                gstinVerified: boolean;
                gstinVerifiedAt: Date | null;
            }) | null;
        } & {
            id: string;
            createdAt: Date;
            userId: string | null;
            date: Date;
            description: string | null;
            title: string;
            metadata: string | null;
            clientId: string | null;
            orderId: string | null;
            eventType: string;
            projectId: string | null;
            ticketId: string | null;
            meetingId: string | null;
            deliverableId: string | null;
        })[];
    }>;
    getAdminRevenueOverview(): Promise<{
        revenue: {
            currentMonth: number;
            lastMonth: number;
            growthPercentage: number;
            totalAllTime: number;
        };
        counts: {
            currentMonthPayments: number;
            pendingInvoices: number;
            activeSubscriptions: number;
        };
        recentPayments: ({
            order: {
                client: {
                    user: {
                        firstName: string;
                        lastName: string;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    userId: string;
                    status: string;
                    agencyId: string | null;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    createdBy: string | null;
                    updatedBy: string | null;
                    state: string | null;
                    gstNumber: string | null;
                    billingAddress: string | null;
                    timezone: string;
                    companyId: string | null;
                    accountManagerId: string | null;
                    notes: string | null;
                    legalName: string | null;
                    stateCode: string | null;
                    pincode: string | null;
                    country: string | null;
                    gstRegistered: boolean;
                    gstinVerified: boolean;
                    gstinVerifiedAt: Date | null;
                };
                orderNumber: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatusEnum;
            updatedAt: Date;
            createdBy: string | null;
            updatedBy: string | null;
            method: string | null;
            currency: string;
            orderId: string | null;
            amount: number;
            paymentNumber: string;
            gatewayProvider: string;
            gatewayTransactionId: string | null;
            gatewayOrderId: string | null;
            invoiceId: string | null;
            paidAt: Date | null;
        })[];
    }>;
    getAdminPaymentAnalytics(startDate?: string, endDate?: string): Promise<{
        byStatus: {
            status: import(".prisma/client").$Enums.PaymentStatusEnum;
            count: number;
            amount: number;
        }[];
        byProvider: {
            provider: string;
            count: number;
            amount: number;
        }[];
        dailyRevenue: {
            createdAt: Date;
            amount: number;
        }[];
    }>;
    getAdminPendingInvoices(page?: number, limit?: number): Promise<{
        data: ({
            order: {
                orderNumber: string;
            } | null;
            client: {
                user: {
                    email: string;
                    firstName: string;
                    lastName: string;
                };
            } & {
                id: string;
                createdAt: Date;
                userId: string;
                status: string;
                agencyId: string | null;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                state: string | null;
                gstNumber: string | null;
                billingAddress: string | null;
                timezone: string;
                companyId: string | null;
                accountManagerId: string | null;
                notes: string | null;
                legalName: string | null;
                stateCode: string | null;
                pincode: string | null;
                country: string | null;
                gstRegistered: boolean;
                gstinVerified: boolean;
                gstinVerifiedAt: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.InvoiceStatusEnum;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            type: import(".prisma/client").$Enums.InvoiceTypeEnum;
            currency: string;
            clientId: string;
            totalAmount: number;
            taxAmount: number;
            orderId: string | null;
            dueDate: Date;
            invoiceNumber: string;
            financialYear: string | null;
            supplyType: import(".prisma/client").$Enums.SupplyTypeEnum;
            taxTreatment: import(".prisma/client").$Enums.TaxTreatmentEnum;
            taxType: import(".prisma/client").$Enums.TaxTypeEnum;
            placeOfSupply: string | null;
            placeOfSupplyCode: string | null;
            reverseCharge: boolean;
            issueDate: Date;
            paidDate: Date | null;
            subtotal: number;
            cgstAmount: number;
            sgstAmount: number;
            igstAmount: number;
            totalTax: number;
            subscriptionId: string | null;
            pdfAssetId: string | null;
            pdfUrl: string | null;
            irn: string | null;
            irnGeneratedAt: Date | null;
            signedQrCode: string | null;
            eInvoiceStatus: string | null;
            eInvoiceError: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getAdminWidgets(): Promise<{
        revenueCard: {
            currentMonth: number;
            lastMonth: number;
            growthPercentage: number;
            totalAllTime: number;
        };
        activeProjects: number;
        pendingTasks: number;
        recentPayments: ({
            order: {
                client: {
                    user: {
                        firstName: string;
                        lastName: string;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    userId: string;
                    status: string;
                    agencyId: string | null;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    createdBy: string | null;
                    updatedBy: string | null;
                    state: string | null;
                    gstNumber: string | null;
                    billingAddress: string | null;
                    timezone: string;
                    companyId: string | null;
                    accountManagerId: string | null;
                    notes: string | null;
                    legalName: string | null;
                    stateCode: string | null;
                    pincode: string | null;
                    country: string | null;
                    gstRegistered: boolean;
                    gstinVerified: boolean;
                    gstinVerifiedAt: Date | null;
                };
                orderNumber: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatusEnum;
            updatedAt: Date;
            createdBy: string | null;
            updatedBy: string | null;
            method: string | null;
            currency: string;
            orderId: string | null;
            amount: number;
            paymentNumber: string;
            gatewayProvider: string;
            gatewayTransactionId: string | null;
            gatewayOrderId: string | null;
            invoiceId: string | null;
            paidAt: Date | null;
        })[];
        aiInsights: Record<string, unknown>[];
        notifications: {
            message: string;
            id: string;
            createdAt: Date;
            userId: string;
            updatedAt: Date;
            deletedAt: Date | null;
            type: import(".prisma/client").$Enums.NotificationTypeEnum;
            title: string;
            isRead: boolean;
            channel: import(".prisma/client").$Enums.NotificationChannelEnum;
            readAt: Date | null;
            deepLink: string | null;
        }[];
        calendar: {
            upcomingMeetings: number;
        };
        teamWorkload: never[];
        salesFunnel: {
            activeClients: number;
            openTickets: number;
        };
        pendingInvoices: {
            data: ({
                order: {
                    orderNumber: string;
                } | null;
                client: {
                    user: {
                        email: string;
                        firstName: string;
                        lastName: string;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    userId: string;
                    status: string;
                    agencyId: string | null;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    createdBy: string | null;
                    updatedBy: string | null;
                    state: string | null;
                    gstNumber: string | null;
                    billingAddress: string | null;
                    timezone: string;
                    companyId: string | null;
                    accountManagerId: string | null;
                    notes: string | null;
                    legalName: string | null;
                    stateCode: string | null;
                    pincode: string | null;
                    country: string | null;
                    gstRegistered: boolean;
                    gstinVerified: boolean;
                    gstinVerifiedAt: Date | null;
                };
            } & {
                id: string;
                createdAt: Date;
                status: import(".prisma/client").$Enums.InvoiceStatusEnum;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                type: import(".prisma/client").$Enums.InvoiceTypeEnum;
                currency: string;
                clientId: string;
                totalAmount: number;
                taxAmount: number;
                orderId: string | null;
                dueDate: Date;
                invoiceNumber: string;
                financialYear: string | null;
                supplyType: import(".prisma/client").$Enums.SupplyTypeEnum;
                taxTreatment: import(".prisma/client").$Enums.TaxTreatmentEnum;
                taxType: import(".prisma/client").$Enums.TaxTypeEnum;
                placeOfSupply: string | null;
                placeOfSupplyCode: string | null;
                reverseCharge: boolean;
                issueDate: Date;
                paidDate: Date | null;
                subtotal: number;
                cgstAmount: number;
                sgstAmount: number;
                igstAmount: number;
                totalTax: number;
                subscriptionId: string | null;
                pdfAssetId: string | null;
                pdfUrl: string | null;
                irn: string | null;
                irnGeneratedAt: Date | null;
                signedQrCode: string | null;
                eInvoiceStatus: string | null;
                eInvoiceError: string | null;
            })[];
            meta: {
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            };
        };
    }>;
    getDashboardKpis(): Promise<{
        averageOrderValue: number;
        customerLifetimeValue: number;
        projectCompletionRate: number;
        totalRevenue: number;
        totalOrders: number;
        totalClients: number;
    }>;
    getClientDashboard(clientId: string): Promise<{
        metrics: {
            activeProjects: number;
            pendingDeliverables: number;
            upcomingMeetings: number;
            openTickets: number;
        };
        projects: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.ProjectStatusEnum;
            _count: {
                deliverables: number;
                tasks: number;
            };
            progress: number;
            targetEndDate: Date | null;
        }[];
        recentActivity: {
            id: string;
            createdAt: Date;
            userId: string | null;
            date: Date;
            description: string | null;
            title: string;
            metadata: string | null;
            clientId: string | null;
            orderId: string | null;
            eventType: string;
            projectId: string | null;
            ticketId: string | null;
            meetingId: string | null;
            deliverableId: string | null;
        }[];
    }>;
    getClientBillingDashboard(clientId: string): Promise<{
        paymentHistory: ({
            order: {
                orderNumber: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatusEnum;
            updatedAt: Date;
            createdBy: string | null;
            updatedBy: string | null;
            method: string | null;
            currency: string;
            orderId: string | null;
            amount: number;
            paymentNumber: string;
            gatewayProvider: string;
            gatewayTransactionId: string | null;
            gatewayOrderId: string | null;
            invoiceId: string | null;
            paidAt: Date | null;
        })[];
        outstandingInvoices: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.InvoiceStatusEnum;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            type: import(".prisma/client").$Enums.InvoiceTypeEnum;
            currency: string;
            clientId: string;
            totalAmount: number;
            taxAmount: number;
            orderId: string | null;
            dueDate: Date;
            invoiceNumber: string;
            financialYear: string | null;
            supplyType: import(".prisma/client").$Enums.SupplyTypeEnum;
            taxTreatment: import(".prisma/client").$Enums.TaxTreatmentEnum;
            taxType: import(".prisma/client").$Enums.TaxTypeEnum;
            placeOfSupply: string | null;
            placeOfSupplyCode: string | null;
            reverseCharge: boolean;
            issueDate: Date;
            paidDate: Date | null;
            subtotal: number;
            cgstAmount: number;
            sgstAmount: number;
            igstAmount: number;
            totalTax: number;
            subscriptionId: string | null;
            pdfAssetId: string | null;
            pdfUrl: string | null;
            irn: string | null;
            irnGeneratedAt: Date | null;
            signedQrCode: string | null;
            eInvoiceStatus: string | null;
            eInvoiceError: string | null;
        }[];
        activeSubscription: ({
            package: {
                name: string;
                type: import(".prisma/client").$Enums.PackageTypeEnum;
            };
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.SubscriptionStatusEnum;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            packageId: string;
            currency: string;
            price: number;
            clientId: string;
            subscriptionNumber: string;
            interval: import(".prisma/client").$Enums.SubscriptionIntervalEnum;
            currentPeriodStart: Date;
            currentPeriodEnd: Date;
            cancelAtPeriodEnd: boolean;
            stripeSubscriptionId: string | null;
            razorpaySubscriptionId: string | null;
        }) | null;
        unreadNotificationsCount: number;
    }>;
    getClientWidgets(clientId: string): Promise<{
        activeProjects: number;
        pendingDeliverables: number;
        upcomingMeetings: number;
        projectProgress: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.ProjectStatusEnum;
            _count: {
                deliverables: number;
                tasks: number;
            };
            progress: number;
            targetEndDate: Date | null;
        }[];
        recentPayments: ({
            order: {
                orderNumber: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatusEnum;
            updatedAt: Date;
            createdBy: string | null;
            updatedBy: string | null;
            method: string | null;
            currency: string;
            orderId: string | null;
            amount: number;
            paymentNumber: string;
            gatewayProvider: string;
            gatewayTransactionId: string | null;
            gatewayOrderId: string | null;
            invoiceId: string | null;
            paidAt: Date | null;
        })[];
        invoiceSummary: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.InvoiceStatusEnum;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            type: import(".prisma/client").$Enums.InvoiceTypeEnum;
            currency: string;
            clientId: string;
            totalAmount: number;
            taxAmount: number;
            orderId: string | null;
            dueDate: Date;
            invoiceNumber: string;
            financialYear: string | null;
            supplyType: import(".prisma/client").$Enums.SupplyTypeEnum;
            taxTreatment: import(".prisma/client").$Enums.TaxTreatmentEnum;
            taxType: import(".prisma/client").$Enums.TaxTypeEnum;
            placeOfSupply: string | null;
            placeOfSupplyCode: string | null;
            reverseCharge: boolean;
            issueDate: Date;
            paidDate: Date | null;
            subtotal: number;
            cgstAmount: number;
            sgstAmount: number;
            igstAmount: number;
            totalTax: number;
            subscriptionId: string | null;
            pdfAssetId: string | null;
            pdfUrl: string | null;
            irn: string | null;
            irnGeneratedAt: Date | null;
            signedQrCode: string | null;
            eInvoiceStatus: string | null;
            eInvoiceError: string | null;
        }[];
        notifications: number;
        recentActivity: {
            id: string;
            createdAt: Date;
            userId: string | null;
            date: Date;
            description: string | null;
            title: string;
            metadata: string | null;
            clientId: string | null;
            orderId: string | null;
            eventType: string;
            projectId: string | null;
            ticketId: string | null;
            meetingId: string | null;
            deliverableId: string | null;
        }[];
    }>;
    getProjectStats(projectId: string): Promise<{
        project: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.ProjectStatusEnum;
            progress: number;
            priority: import(".prisma/client").$Enums.ProjectPriorityEnum;
        };
        counts: {
            teamMembers: number;
            deliverables: number;
            tasks: number;
        };
        tasksByStatus: {
            status: import(".prisma/client").$Enums.TaskStatusEnum;
            count: number;
        }[];
        deliverablesByStatus: {
            status: import(".prisma/client").$Enums.DeliverableStatusEnum;
            count: number;
        }[];
        milestoneProgress: {
            total: number;
            completed: number;
            percentage: number;
        };
    } | null>;
}
