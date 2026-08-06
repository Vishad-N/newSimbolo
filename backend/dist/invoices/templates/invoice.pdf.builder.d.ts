export interface InvoiceLineItem {
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    total: number;
}
export interface InvoicePdfData {
    invoiceNumber: string;
    issueDate: Date;
    dueDate: Date;
    status: string;
    clientName: string;
    clientEmail: string;
    clientAddress?: string;
    gstNumber?: string;
    companyName?: string;
    items: InvoiceLineItem[];
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    currency: string;
    notes?: string;
}
/**
 * Builds a professional invoice PDF using pdfkit.
 * Returns a Buffer of the rendered PDF.
 * Isolated from business logic — receives only pure data.
 */
export declare function buildInvoicePdf(data: InvoicePdfData): Promise<Buffer>;
