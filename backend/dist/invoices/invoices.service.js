"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
const email_service_1 = require("../shared/email/email.service");
const storage_service_1 = require("../storage/storage.service");
const tax_service_1 = require("./tax.service");
const invoice_pdf_builder_1 = require("./templates/invoice.pdf.builder");
const client_1 = require("@prisma/client");
const role_constant_1 = require("../common/constants/role.constant");
const MAX_INVOICE_NUMBER_RETRIES = 5;
const STAFF_ROLES = [
    role_constant_1.UserRole.ADMIN,
    role_constant_1.UserRole.SUPER_ADMIN,
    role_constant_1.UserRole.PROJECT_MANAGER,
    role_constant_1.UserRole.SUPPORT,
    role_constant_1.UserRole.CONTENT_MANAGER,
    role_constant_1.UserRole.MARKETING_MANAGER,
    role_constant_1.UserRole.EDITOR,
];
let InvoicesService = class InvoicesService extends base_service_1.BaseService {
    prisma;
    emailService;
    taxService;
    storageService;
    constructor(prisma, emailService, taxService, storageService) {
        super('InvoicesService');
        this.prisma = prisma;
        this.emailService = emailService;
        this.taxService = taxService;
        this.storageService = storageService;
    }
    async generateInvoiceNumber() {
        const now = new Date();
        // Indian Financial Year: April 1 to March 31
        const month = now.getMonth();
        const year = now.getFullYear();
        const startYear = month >= 3 ? year : year - 1;
        const fy = `${startYear.toString().slice(-2)}-${(startYear + 1).toString().slice(-2)}`;
        const lastInvoice = await this.prisma.invoice.findFirst({
            where: { financialYear: fy },
            orderBy: { invoiceNumber: 'desc' },
        });
        let nextNumber = 1;
        if (lastInvoice && lastInvoice.invoiceNumber.startsWith(`SIM/${fy}/`)) {
            const parts = lastInvoice.invoiceNumber.split('/');
            const numPart = parseInt(parts[2], 10);
            if (!isNaN(numPart)) {
                nextNumber = numPart + 1;
            }
        }
        const paddedNumber = String(nextNumber).padStart(6, '0');
        return { number: `SIM/${fy}/${paddedNumber}`, fy };
    }
    async create(dto, createdBy) {
        const client = await this.prisma.clientProfile.findFirst({
            where: { id: dto.clientId, deletedAt: null },
            include: { user: true, company: true },
        });
        if (!client)
            throw new common_1.NotFoundException(`Client ${dto.clientId} not found`);
        const supplierStateCode = process.env.SUPPLIER_STATE_CODE || '23'; // Madhya Pradesh
        const customerStateCode = client.stateCode || client.company?.stateCode || undefined;
        const hasGstin = !!(client.gstNumber || client.company?.gstNumber);
        const taxParams = {
            supplierStateCode,
            customerStateCode,
            items: dto.items.map((item) => ({
                description: item.name + (item.description ? ` - ${item.description}` : ''),
                sacCode: item.sacCode,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                gstRate: item.gstRate ?? dto.taxPercentage ?? 18,
            })),
        };
        const taxResult = this.taxService.calculateTax(taxParams);
        // generateInvoiceNumber() reads the current max and adds 1 with no row lock, so two
        // concurrent invoice creations (e.g. a Razorpay webhook and the client-side verify
        // call racing for the same payment) can compute the same number. invoiceNumber is
        // unique, so the loser's insert throws P2002 — retry with a freshly-read number
        // instead of losing the invoice silently.
        let invoice;
        let lastError;
        for (let attempt = 0; attempt < MAX_INVOICE_NUMBER_RETRIES; attempt++) {
            const { number: invoiceNumber, fy } = await this.generateInvoiceNumber();
            try {
                invoice = await this.prisma.invoice.create({
                    data: {
                        invoiceNumber,
                        financialYear: fy,
                        status: client_1.InvoiceStatusEnum.DRAFT,
                        supplyType: hasGstin ? 'B2B' : 'B2C',
                        taxTreatment: 'STANDARD',
                        taxType: taxResult.isInterState ? 'IGST' : 'CGST_SGST',
                        issueDate: new Date(),
                        dueDate: new Date(dto.dueDate),
                        subtotal: taxResult.subtotal,
                        taxAmount: taxResult.totalTax,
                        cgstAmount: taxResult.totalCgst,
                        sgstAmount: taxResult.totalSgst,
                        igstAmount: taxResult.totalIgst,
                        totalTax: taxResult.totalTax,
                        totalAmount: taxResult.totalAmount,
                        currency: dto.currency ?? 'INR',
                        clientId: dto.clientId,
                        orderId: dto.orderId ?? null,
                        subscriptionId: dto.subscriptionId ?? null,
                        createdBy: createdBy ?? null,
                        items: {
                            create: taxResult.items.map((item) => ({
                                description: item.description,
                                sacCode: item.sacCode,
                                quantity: item.quantity,
                                unitPrice: item.unitPrice,
                                discount: item.discount,
                                taxableAmount: item.taxableAmount,
                                gstRate: item.gstRate,
                                cgstAmount: item.cgstAmount,
                                sgstAmount: item.sgstAmount,
                                igstAmount: item.igstAmount,
                                totalAmount: item.totalAmount,
                            })),
                        },
                    },
                    include: {
                        client: { include: { user: true, company: true } },
                        order: { select: { orderNumber: true } },
                        items: true,
                    },
                });
                lastError = undefined;
                break;
            }
            catch (error) {
                const isDuplicateInvoiceNumber = error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                    error.code === 'P2002' &&
                    error.meta?.target?.includes('invoiceNumber');
                if (!isDuplicateInvoiceNumber)
                    throw error;
                lastError = error;
                this.logger.warn(`Invoice number ${invoiceNumber} collided, retrying (attempt ${attempt + 1})`);
            }
        }
        if (!invoice)
            throw lastError;
        await this.prisma.timeline.create({
            data: {
                title: `Tax Invoice ${invoice.invoiceNumber} generated`,
                description: `Invoice for ₹${taxResult.totalAmount} generated for ${client.user.firstName} ${client.user.lastName}`,
                eventType: 'INVOICE_GENERATED',
                clientId: dto.clientId,
                orderId: dto.orderId ?? undefined,
                userId: createdBy ?? undefined,
            },
        });
        return invoice;
    }
    async createFromOrder(orderId, createdBy) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: { include: { service: true, package: true } },
            },
        });
        if (!order)
            throw new common_1.NotFoundException(`Order ${orderId} not found`);
        // Check if invoice already exists
        const existing = await this.prisma.invoice.findFirst({ where: { orderId, deletedAt: null } });
        if (existing)
            return existing;
        const dto = {
            clientId: order.clientId,
            orderId: order.id,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            currency: order.currency,
            items: order.items.map((item) => ({
                name: item.name,
                description: item.description ?? undefined,
                quantity: item.quantity,
                unitPrice: Number(item.unitPrice),
                sacCode: item.service?.sacCode ?? item.package?.sacCode ?? undefined,
                gstRate: item.service?.gstRate ?? item.package?.gstRate ?? 18,
            })),
        };
        const invoice = await this.create(dto, createdBy);
        // PDF generation (build + upload) is deliberately NOT done here — this method
        // runs inline in the payment webhook/verify path, and generating the PDF is slow
        // enough to risk that request timing out. The client requests the PDF on demand
        // via GET /invoices/:id/pdf, which calls generatePdf() itself.
        return invoice;
    }
    async findAll(clientId, status, page = 1, limit = 20) {
        const where = { deletedAt: null };
        if (clientId)
            where.clientId = clientId;
        if (status)
            where.status = status;
        const [data, total] = await Promise.all([
            this.prisma.invoice.findMany({
                where,
                include: {
                    client: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
                    order: { select: { orderNumber: true } },
                    payments: { select: { id: true, status: true, amount: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.invoice.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(id) {
        const invoice = await this.prisma.invoice.findFirst({
            where: { id, deletedAt: null },
            include: {
                client: { include: { user: true, company: true } },
                order: { include: { items: true } },
                payments: { orderBy: { createdAt: 'desc' } },
                items: true,
                pdfAsset: true,
            },
        });
        if (!invoice)
            throw new common_1.NotFoundException(`Invoice ${id} not found`);
        return invoice;
    }
    /**
     * Same as findOne, but scoped to the requester: a client can only fetch their
     * own invoices. Staff roles can fetch any invoice. Returns 404 (not 403) for a
     * non-owned invoice so a client can't use this to confirm another client's
     * invoice ID exists.
     */
    async findOneForRequester(id, requester) {
        const invoice = await this.findOne(id);
        const isStaff = requester.role ? STAFF_ROLES.includes(requester.role) : false;
        if (!isStaff && invoice.client.userId !== requester.sub) {
            throw new common_1.NotFoundException(`Invoice ${id} not found`);
        }
        return invoice;
    }
    async findMyInvoices(userId, status, page = 1, limit = 20) {
        const client = await this.prisma.clientProfile.findFirst({ where: { userId, deletedAt: null } });
        if (!client)
            throw new common_1.NotFoundException('Client profile not found');
        return this.findAll(client.id, status, page, limit);
    }
    async updateStatus(id, dto, updatedBy) {
        const invoice = await this.findOne(id);
        return this.prisma.invoice.update({
            where: { id },
            data: { status: dto.status, updatedBy: updatedBy ?? null },
        });
    }
    async generatePdf(id) {
        const invoice = await this.findOne(id);
        const client = invoice.client;
        const pdfData = {
            invoiceNumber: invoice.invoiceNumber,
            issueDate: invoice.issueDate,
            dueDate: invoice.dueDate,
            status: invoice.status,
            clientName: client.legalName || `${client.user.firstName} ${client.user.lastName}`,
            clientEmail: client.user.email,
            clientAddress: client.billingAddress ?? undefined,
            clientStateCode: client.stateCode || client.company?.stateCode || undefined,
            gstNumber: client.gstNumber || client.company?.gstNumber || undefined,
            companyName: client.company?.name ?? undefined,
            items: invoice.items.map((item) => ({
                description: item.description,
                sacCode: item.sacCode ?? undefined,
                quantity: item.quantity,
                unitPrice: Number(item.unitPrice),
                discount: Number(item.discount),
                taxableAmount: Number(item.taxableAmount),
                gstRate: item.gstRate,
                cgstAmount: Number(item.cgstAmount),
                sgstAmount: Number(item.sgstAmount),
                igstAmount: Number(item.igstAmount),
                totalAmount: Number(item.totalAmount),
            })),
            subtotal: Number(invoice.subtotal),
            cgstAmount: Number(invoice.cgstAmount),
            sgstAmount: Number(invoice.sgstAmount),
            igstAmount: Number(invoice.igstAmount),
            taxAmount: Number(invoice.taxAmount),
            totalAmount: Number(invoice.totalAmount),
            currency: invoice.currency,
            supplierStateCode: process.env.SUPPLIER_STATE_CODE || '23',
            supplierGstin: process.env.SUPPLIER_GSTIN || undefined,
        };
        const pdfBuffer = await (0, invoice_pdf_builder_1.buildInvoicePdf)(pdfData);
        const file = {
            buffer: pdfBuffer,
            mimetype: 'application/pdf',
            size: pdfBuffer.length,
            originalname: `${invoice.invoiceNumber}.pdf`,
        };
        // invoice.invoiceNumber already embeds the financial year (e.g. "SIM/26-27/000001"),
        // so prefixing it again here would duplicate that segment in the storage path.
        const storageKey = `invoices/${invoice.invoiceNumber}.pdf`;
        const uploadResult = await this.storageService.upload(file, storageKey);
        await this.prisma.invoice.update({
            where: { id },
            data: { pdfUrl: uploadResult.url },
        });
        this.logger.log(`📄 Invoice PDF uploaded (${uploadResult.provider}): ${storageKey}`);
        return pdfBuffer;
    }
    async emailInvoice(id) {
        const invoice = await this.findOne(id);
        const client = invoice.client;
        const userEmail = client.user.email;
        const userName = `${client.user.firstName} ${client.user.lastName}`;
        await this.emailService.sendInvoiceEmail(userEmail, userName, invoice.invoiceNumber, Number(invoice.totalAmount), invoice.dueDate, invoice.currency);
        if (invoice.status === client_1.InvoiceStatusEnum.DRAFT) {
            await this.prisma.invoice.update({
                where: { id },
                data: { status: client_1.InvoiceStatusEnum.SENT },
            });
        }
        return { sent: true };
    }
    async softDelete(id, deletedBy) {
        await this.findOne(id);
        await this.prisma.invoice.update({
            where: { id },
            data: { deletedAt: new Date(), updatedBy: deletedBy ?? null },
        });
        return { message: `Invoice ${id} cancelled` };
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService,
        tax_service_1.TaxService,
        storage_service_1.StorageService])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map