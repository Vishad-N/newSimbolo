import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { EmailService } from '../shared/email/email.service';
import { StorageService } from '../storage/storage.service';
import { TaxService } from './tax.service';
import { CreateInvoiceDto, UpdateInvoiceStatusDto } from './dto/invoice.dto';
import { buildInvoicePdf } from './templates/invoice.pdf.builder';
import { InvoiceStatusEnum } from '@prisma/client';
import { UserRole } from '../common/constants/role.constant';

const STAFF_ROLES: string[] = [
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
  UserRole.PROJECT_MANAGER,
  UserRole.SUPPORT,
  UserRole.CONTENT_MANAGER,
  UserRole.MARKETING_MANAGER,
  UserRole.EDITOR,
];

@Injectable()
export class InvoicesService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly taxService: TaxService,
    private readonly storageService: StorageService,
  ) {
    super('InvoicesService');
  }

  private async generateInvoiceNumber(): Promise<{ number: string; fy: string }> {
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

  async create(dto: CreateInvoiceDto, createdBy?: string) {
    const client = await this.prisma.clientProfile.findFirst({
      where: { id: dto.clientId, deletedAt: null },
      include: { user: true, company: true },
    });
    if (!client) throw new NotFoundException(`Client ${dto.clientId} not found`);

    const supplierStateCode = process.env.SUPPLIER_STATE_CODE || '23'; // Madhya Pradesh
    const customerStateCode = client.stateCode || client.company?.stateCode || undefined;
    const hasGstin = !!(client.gstNumber || client.company?.gstNumber);

    const taxParams = {
      supplierStateCode,
      customerStateCode,
      items: dto.items.map((item) => ({
        description: item.name + (item.description ? ` - ${item.description}` : ''),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        gstRate: dto.taxPercentage ?? 18,
      })),
    };

    const taxResult = this.taxService.calculateTax(taxParams);
    const { number: invoiceNumber, fy } = await this.generateInvoiceNumber();

    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber,
        financialYear: fy,
        status: InvoiceStatusEnum.DRAFT,
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

    await this.prisma.timeline.create({
      data: {
        title: `Tax Invoice ${invoiceNumber} generated`,
        description: `Invoice for ₹${taxResult.totalAmount} generated for ${client.user.firstName} ${client.user.lastName}`,
        eventType: 'INVOICE_GENERATED',
        clientId: dto.clientId,
        orderId: dto.orderId ?? undefined,
        userId: createdBy ?? undefined,
      },
    });

    return invoice;
  }

  async createFromOrder(orderId: string, createdBy?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { service: true, package: true } },
      },
    });

    if (!order) throw new NotFoundException(`Order ${orderId} not found`);

    // Check if invoice already exists
    const existing = await this.prisma.invoice.findFirst({ where: { orderId, deletedAt: null } });
    if (existing) return existing;

    const dto: CreateInvoiceDto = {
      clientId: order.clientId,
      orderId: order.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      currency: order.currency,
      items: order.items.map((item) => ({
        name: item.name,
        description: item.description ?? undefined,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        sacCode: item.service?.sacCode ?? item.package?.sacCode ?? undefined,
        gstRate: item.service?.gstRate ?? item.package?.gstRate ?? 18,
      })) as any,
    };

    const invoice = await this.create(dto, createdBy);

    // PDF generation (build + upload) is deliberately NOT done here — this method
    // runs inline in the payment webhook/verify path, and generating the PDF is slow
    // enough to risk that request timing out. The client requests the PDF on demand
    // via GET /invoices/:id/pdf, which calls generatePdf() itself.
    return invoice;
  }

  async findAll(clientId?: string, status?: InvoiceStatusEnum, page = 1, limit = 20) {
    const where: any = { deletedAt: null };
    if (clientId) where.clientId = clientId;
    if (status) where.status = status;

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

  async findOne(id: string) {
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
    if (!invoice) throw new NotFoundException(`Invoice ${id} not found`);
    return invoice;
  }

  /**
   * Same as findOne, but scoped to the requester: a client can only fetch their
   * own invoices. Staff roles can fetch any invoice. Returns 404 (not 403) for a
   * non-owned invoice so a client can't use this to confirm another client's
   * invoice ID exists.
   */
  async findOneForRequester(id: string, requester: { sub?: string; role?: string }) {
    const invoice = await this.findOne(id);
    const isStaff = requester.role ? STAFF_ROLES.includes(requester.role) : false;
    if (!isStaff && invoice.client.userId !== requester.sub) {
      throw new NotFoundException(`Invoice ${id} not found`);
    }
    return invoice;
  }

  async findMyInvoices(userId: string, status?: InvoiceStatusEnum, page = 1, limit = 20) {
    const client = await this.prisma.clientProfile.findFirst({ where: { userId, deletedAt: null } });
    if (!client) throw new NotFoundException('Client profile not found');
    return this.findAll(client.id, status, page, limit);
  }

  async updateStatus(id: string, dto: UpdateInvoiceStatusDto, updatedBy?: string) {
    const invoice = await this.findOne(id);
    return this.prisma.invoice.update({
      where: { id },
      data: { status: dto.status, updatedBy: updatedBy ?? null },
    });
  }

  async generatePdf(id: string): Promise<Buffer> {
    const invoice = await this.findOne(id);
    const client = invoice.client as any;

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
      items: invoice.items.map((item: any) => ({
        description: item.description,
        sacCode: item.sacCode ?? undefined,
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
      subtotal: invoice.subtotal,
      cgstAmount: invoice.cgstAmount,
      sgstAmount: invoice.sgstAmount,
      igstAmount: invoice.igstAmount,
      taxAmount: invoice.taxAmount,
      totalAmount: invoice.totalAmount,
      currency: invoice.currency,
      supplierStateCode: process.env.SUPPLIER_STATE_CODE || '23',
    };

    const pdfBuffer = await buildInvoicePdf(pdfData);

    const file = {
      buffer: pdfBuffer,
      mimetype: 'application/pdf',
      size: pdfBuffer.length,
      originalname: `${invoice.invoiceNumber}.pdf`,
    } as any;

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

  async emailInvoice(id: string): Promise<{ sent: boolean }> {
    const invoice = await this.findOne(id);
    const client = invoice.client as any;
    const userEmail = client.user.email;
    const userName = `${client.user.firstName} ${client.user.lastName}`;

    await this.emailService.sendInvoiceEmail(
      userEmail,
      userName,
      invoice.invoiceNumber,
      invoice.totalAmount,
      invoice.dueDate,
      invoice.currency,
    );

    if (invoice.status === InvoiceStatusEnum.DRAFT) {
      await this.prisma.invoice.update({
        where: { id },
        data: { status: InvoiceStatusEnum.SENT },
      });
    }

    return { sent: true };
  }

  async softDelete(id: string, deletedBy?: string) {
    await this.findOne(id);
    await this.prisma.invoice.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: deletedBy ?? null },
    });
    return { message: `Invoice ${id} cancelled` };
  }
}
