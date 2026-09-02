export interface InvoiceLineItem {
    name?: string;
    description: string;
    sacCode?: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    taxableAmount?: number;
    gstRate?: number;
    cgstAmount?: number;
    sgstAmount?: number;
    igstAmount?: number;
    totalAmount?: number;
    total?: number;
}
export interface InvoicePdfData {
    invoiceNumber: string;
    issueDate: Date;
    dueDate: Date;
    status: string;
    clientName: string;
    clientEmail: string;
    clientAddress?: string;
    clientStateCode?: string;
    gstNumber?: string;
    companyName?: string;
    items: InvoiceLineItem[];
    subtotal: number;
    cgstAmount?: number;
    sgstAmount?: number;
    igstAmount?: number;
    taxAmount: number;
    totalAmount: number;
    currency: string;
    supplierStateCode?: string;
    supplierGstin?: string;
    notes?: string;
}
/**
 * Builds a GST-compliant invoice PDF using pdfkit.
 * Returns a Buffer of the rendered PDF.
 * Isolated from business logic — receives only pure data.
 */
export declare function buildInvoicePdf(data: InvoicePdfData): Promise<Buffer>;
