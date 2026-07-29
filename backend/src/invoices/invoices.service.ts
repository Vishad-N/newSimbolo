import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { EmailService } from '../shared/email/email.service';
import { CreateInvoiceDto, UpdateInvoiceStatusDto } from './dto/invoice.dto';
import { buildInvoicePdf } from './templates/invoice.pdf.builder';
import { InvoiceStatusEnum } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class InvoicesService extends BaseService {
  private readonly uploadsDir: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {
    super('InvoicesService');
    this.uploadsDir = path.join(process.cwd(), 'uploads', 'invoices');
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  private generateInvoiceNumber(): string {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `INV-${yearMonth}-${random}`;
  }

  async create(dto: CreateInvoiceDto, createdBy?: string) {
    const client = await this.prisma.clientProfile.findFirst({
      where: { id: dto.clientId, deletedAt: null },
      include: { user: true, company: true },
    });
    if (!client) throw new NotFoundException(`Client ${dto.clientId} not found`);

    const taxPct = dto.taxPercentage ?? 18;
    const subtotal = dto.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const taxAmount = parseFloat(((subtotal * taxPct) / 100).toFixed(2));
    const totalAmount = parseFloat((subtotal + taxAmount).toFixed(2));

    const invoiceNumber = this.generateInvoiceNumber();

    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber,
        status: InvoiceStatusEnum.DRAFT,
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
        pdfAsset: true,
      },
    });
    if (!invoice) throw new NotFoundException(`Invoice ${id} not found`);
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
    const order = invoice.order as any;

    const items = order?.items?.map((item: any) => ({
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

    const pdfBuffer = await buildInvoicePdf(pdfData);

    // Save to uploads dir
    const filename = `${invoice.invoiceNumber}.pdf`;
    const filePath = path.join(this.uploadsDir, filename);
    fs.writeFileSync(filePath, pdfBuffer);
    this.logger.log(`📄 Invoice PDF generated: ${filename}`);

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
