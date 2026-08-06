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
const invoice_pdf_builder_1 = require("./templates/invoice.pdf.builder");
const client_1 = require("@prisma/client");
const path = require("path");
const fs = require("fs");
let InvoicesService = class InvoicesService extends base_service_1.BaseService {
    prisma;
    emailService;
    uploadsDir;
    constructor(prisma, emailService) {
        super('InvoicesService');
        this.prisma = prisma;
        this.emailService = emailService;
        this.uploadsDir = path.join(process.cwd(), 'uploads', 'invoices');
        if (!fs.existsSync(this.uploadsDir)) {
            fs.mkdirSync(this.uploadsDir, { recursive: true });
        }
    }
    generateInvoiceNumber() {
        const now = new Date();
        const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `INV-${yearMonth}-${random}`;
    }
    async create(dto, createdBy) {
        const client = await this.prisma.clientProfile.findFirst({
            where: { id: dto.clientId, deletedAt: null },
            include: { user: true, company: true },
        });
        if (!client)
            throw new common_1.NotFoundException(`Client ${dto.clientId} not found`);
        const taxPct = dto.taxPercentage ?? 18;
        const subtotal = dto.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
        const taxAmount = parseFloat(((subtotal * taxPct) / 100).toFixed(2));
        const totalAmount = parseFloat((subtotal + taxAmount).toFixed(2));
        const invoiceNumber = this.generateInvoiceNumber();
        const invoice = await this.prisma.invoice.create({
            data: {
                invoiceNumber,
                status: client_1.InvoiceStatusEnum.DRAFT,
                issueDate: new Date(),
                dueDate: new Date(dto.dueDate),
                subtotal,
                taxAmount,
                totalAmount,
                currency: dto.currency ?? 'INR',
                clientId: dto.clientId,
                orderId: dto.orderId ?? null,
                subscriptionId: dto.subscriptionId ?? null,
                createdBy: createdBy ?? null,
            },
            include: {
                client: { include: { user: true, company: true } },
                order: { select: { orderNumber: true } },
            },
        });
        // Log timeline activity
        await this.prisma.timeline.create({
            data: {
                title: `Invoice ${invoiceNumber} generated`,
                description: `Invoice for ₹${totalAmount} generated for ${client.user.firstName} ${client.user.lastName}`,
                eventType: 'INVOICE_GENERATED',
                clientId: dto.clientId,
                orderId: dto.orderId ?? undefined,
                userId: createdBy ?? undefined,
            },
        });
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
                pdfAsset: true,
            },
        });
        if (!invoice)
            throw new common_1.NotFoundException(`Invoice ${id} not found`);
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
        const order = invoice.order;
        const items = order?.items?.map((item) => ({
            name: item.name,
            description: item.description ?? undefined,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.totalPrice,
        })) ?? [
            {
                name: 'Services',
                description: 'As per agreement',
                quantity: 1,
                unitPrice: invoice.subtotal,
                total: invoice.subtotal,
            },
        ];
        const pdfData = {
            invoiceNumber: invoice.invoiceNumber,
            issueDate: invoice.issueDate,
            dueDate: invoice.dueDate,
            status: invoice.status,
            clientName: `${client.user.firstName} ${client.user.lastName}`,
            clientEmail: client.user.email,
            clientAddress: client.billingAddress ?? undefined,
            gstNumber: client.gstNumber ?? undefined,
            companyName: client.company?.name ?? undefined,
            items,
            subtotal: invoice.subtotal,
            taxAmount: invoice.taxAmount,
            totalAmount: invoice.totalAmount,
            currency: invoice.currency,
        };
        const pdfBuffer = await (0, invoice_pdf_builder_1.buildInvoicePdf)(pdfData);
        // Save to uploads dir
        const filename = `${invoice.invoiceNumber}.pdf`;
        const filePath = path.join(this.uploadsDir, filename);
        fs.writeFileSync(filePath, pdfBuffer);
        this.logger.log(`📄 Invoice PDF generated: ${filename}`);
        return pdfBuffer;
    }
    async emailInvoice(id) {
        const invoice = await this.findOne(id);
        const client = invoice.client;
        const userEmail = client.user.email;
        const userName = `${client.user.firstName} ${client.user.lastName}`;
        await this.emailService.sendInvoiceEmail(userEmail, userName, invoice.invoiceNumber, invoice.totalAmount, invoice.dueDate, invoice.currency);
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
        email_service_1.EmailService])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map