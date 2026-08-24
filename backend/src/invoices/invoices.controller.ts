import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  Request,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto, UpdateInvoiceStatusDto } from './dto/invoice.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/constants/role.constant';
import { InvoiceStatusEnum } from '@prisma/client';

@ApiTags('Invoices')
@ApiBearerAuth('JWT-auth')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.PROJECT_MANAGER)
  @ApiOperation({ summary: 'Generate a new invoice' })
  @ApiResponse({ status: 201, description: 'Invoice created successfully' })
  create(@Body() dto: CreateInvoiceDto, @Request() req: any) {
    return this.invoicesService.create(dto, req.user?.sub);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'List all invoices (admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: InvoiceStatusEnum })
  @ApiQuery({ name: 'clientId', required: false, type: String })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: InvoiceStatusEnum,
    @Query('clientId') clientId?: string,
  ) {
    return this.invoicesService.findAll(clientId, status, page, limit);
  }

  @Get('my')
  @ApiOperation({ summary: "Get current client's own invoices" })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: InvoiceStatusEnum })
  findMyInvoices(
    @Request() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: InvoiceStatusEnum,
  ) {
    return this.invoicesService.findMyInvoices(req.user?.sub, status, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice detail by ID (own invoice for clients, any for staff)' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.invoicesService.findOneForRequester(id, req.user ?? {});
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Download invoice as PDF (own invoice for clients, any for staff)' })
  @ApiResponse({ status: 200, description: 'Invoice PDF binary', content: { 'application/pdf': {} } })
  async downloadPdf(@Param('id', ParseUUIDPipe) id: string, @Request() req: any, @Res() res: Response) {
    const invoice = await this.invoicesService.findOneForRequester(id, req.user ?? {});
    const pdfBuffer = await this.invoicesService.generatePdf(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }

  @Post(':id/send')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.PROJECT_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Email invoice to client' })
  @ApiResponse({ status: 200, description: 'Invoice emailed successfully' })
  emailInvoice(@Param('id', ParseUUIDPipe) id: string) {
    return this.invoicesService.emailInvoice(id);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.PROJECT_MANAGER)
  @ApiOperation({ summary: 'Update invoice status' })
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateInvoiceStatusDto, @Request() req: any) {
    return this.invoicesService.updateStatus(id, dto, req.user?.sub);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Soft delete (cancel) invoice' })
  @HttpCode(HttpStatus.OK)
  softDelete(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.invoicesService.softDelete(id, req.user?.sub);
  }
}
