"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildInvoicePdf = buildInvoicePdf;
const PDFDocument = require("pdfkit");
/**
 * Builds a GST-compliant invoice PDF using pdfkit.
 * Returns a Buffer of the rendered PDF.
 * Isolated from business logic — receives only pure data.
 */
async function buildInvoicePdf(data) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const buffers = [];
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);
        const primaryColor = '#14B8A6';
        const darkColor = '#0F172A';
        const grayColor = '#6B7280';
        const lightGray = '#F3F4F6';
        // ── Header Bar ──────────────────────────────────────────────────
        doc.rect(0, 0, doc.page.width, 80).fill(darkColor);
        doc.font('Helvetica-Bold').fontSize(22).fillColor('#FFFFFF').text('THE SIMBOLO', 50, 25);
        doc.font('Helvetica').fontSize(10).fillColor('#94A3B8').text('AI-Powered Digital Marketing Platform', 50, 52);
        // Invoice badge
        doc.font('Helvetica-Bold').fontSize(14).fillColor(primaryColor).text('TAX INVOICE', 400, 32, { align: 'right' });
        // ── Invoice Meta ─────────────────────────────────────────────────
        doc.rect(0, 80, doc.page.width, 60).fill(lightGray);
        doc.font('Helvetica-Bold').fontSize(10).fillColor(darkColor).text(`Invoice No: ${data.invoiceNumber}`, 50, 95);
        doc
            .font('Helvetica')
            .fontSize(10)
            .fillColor(grayColor)
            .text(`Issue Date: ${data.issueDate.toLocaleDateString('en-IN')}`, 50, 112)
            .text(`Due Date: ${data.dueDate.toLocaleDateString('en-IN')}`, 220, 112)
            .text(`Status: ${data.status}`, 400, 112);
        // ── Bill To ──────────────────────────────────────────────────────
        doc.moveDown(3);
        const billToY = 160;
        doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('BILL TO', 50, billToY);
        doc
            .font('Helvetica-Bold')
            .fontSize(11)
            .fillColor(darkColor)
            .text(data.companyName ? data.companyName : data.clientName, 50, billToY + 15);
        let currentY = billToY + 30;
        doc.font('Helvetica').fontSize(9).fillColor(grayColor).text(data.clientEmail, 50, currentY);
        currentY += 14;
        if (data.clientAddress) {
            doc.text(data.clientAddress, 50, currentY);
            currentY += 14;
        }
        if (data.clientStateCode) {
            doc.text(`State Code: ${data.clientStateCode}`, 50, currentY);
            currentY += 14;
        }
        if (data.gstNumber) {
            doc.font('Helvetica-Bold').text(`GSTIN: ${data.gstNumber}`, 50, currentY);
        }
        // ── Company info (right side) ─────────────────────────────────
        doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('FROM', 350, billToY);
        doc
            .font('Helvetica-Bold')
            .fontSize(11)
            .fillColor(darkColor)
            .text('The Simbolo Pvt. Ltd.', 350, billToY + 15);
        let fromY = billToY + 30;
        doc.font('Helvetica').fontSize(9).fillColor(grayColor).text('billing@simbolo.ai', 350, fromY);
        fromY += 14;
        doc.text('India', 350, fromY);
        fromY += 14;
        doc.text(`State Code: ${data.supplierStateCode || '23'}`, 350, fromY);
        fromY += 14;
        if (data.supplierGstin) {
            doc.font('Helvetica-Bold').text(`GSTIN: ${data.supplierGstin}`, 350, fromY);
        }
        // ── Line Items Table ──────────────────────────────────────────
        const tableTop = 290;
        const tableLeft = 50;
        // columns: Description(170), SAC(50), Qty(30), Price(60), Taxable(60), Tax(60), Total(60)
        const colWidths = [150, 40, 30, 60, 60, 70, 70];
        const headers = ['Description', 'SAC', 'Qty', 'Unit Price', 'Taxable', 'GST', 'Amount'];
        // Table header background
        doc.rect(tableLeft, tableTop, doc.page.width - 100, 24).fill(darkColor);
        let xPos = tableLeft + 8;
        headers.forEach((h, i) => {
            doc
                .font('Helvetica-Bold')
                .fontSize(8)
                .fillColor('#FFFFFF')
                .text(h, xPos, tableTop + 8, { width: colWidths[i], align: i > 1 ? 'right' : 'left' });
            xPos += colWidths[i];
        });
        let rowY = tableTop + 24;
        const symbol = data.currency === 'INR' ? '₹' : '$';
        data.items.forEach((item, idx) => {
            // Create new page if needed
            if (rowY > doc.page.height - 150) {
                doc.addPage();
                rowY = 50;
            }
            if (idx % 2 === 1) {
                doc.rect(tableLeft, rowY, doc.page.width - 100, 22).fill(lightGray);
            }
            xPos = tableLeft + 8;
            const desc = item.name ? item.name + (item.description ? `\n${item.description}` : '') : item.description;
            const taxable = item.taxableAmount ?? item.quantity * item.unitPrice - (item.discount || 0);
            const taxStr = item.gstRate ? `${item.gstRate}%` : '-';
            const itemTotal = item.totalAmount ?? item.total ?? 0;
            const vals = [
                desc,
                item.sacCode || '-',
                String(item.quantity),
                `${item.unitPrice.toLocaleString('en-IN')}`,
                `${taxable.toLocaleString('en-IN')}`,
                `${taxStr}`,
                `${itemTotal.toLocaleString('en-IN')}`,
            ];
            vals.forEach((v, i) => {
                doc
                    .font(i === 0 ? 'Helvetica-Bold' : 'Helvetica')
                    .fontSize(8)
                    .fillColor(darkColor)
                    .text(v, xPos, rowY + 6, { width: colWidths[i], align: i > 1 ? 'right' : 'left' });
                xPos += colWidths[i];
            });
            rowY += 22;
        });
        // ── Totals ───────────────────────────────────────────────────────
        rowY += 10;
        doc
            .moveTo(350, rowY)
            .lineTo(doc.page.width - 50, rowY)
            .strokeColor('#E5E7EB')
            .stroke();
        rowY += 8;
        const totalsRows = [['Subtotal', `${symbol}${data.subtotal.toLocaleString('en-IN')}`]];
        if (data.igstAmount && data.igstAmount > 0) {
            totalsRows.push(['IGST', `${symbol}${data.igstAmount.toLocaleString('en-IN')}`]);
        }
        else {
            if (data.cgstAmount && data.cgstAmount > 0) {
                totalsRows.push(['CGST', `${symbol}${data.cgstAmount.toLocaleString('en-IN')}`]);
            }
            if (data.sgstAmount && data.sgstAmount > 0) {
                totalsRows.push(['SGST', `${symbol}${data.sgstAmount.toLocaleString('en-IN')}`]);
            }
        }
        // fallback for legacy
        if (!data.igstAmount && !data.cgstAmount && data.taxAmount > 0) {
            totalsRows.push(['GST', `${symbol}${data.taxAmount.toLocaleString('en-IN')}`]);
        }
        totalsRows.forEach(([label, value]) => {
            doc
                .font('Helvetica')
                .fontSize(9)
                .fillColor(grayColor)
                .text(label, 350, rowY)
                .text(value, 0, rowY, { align: 'right', width: doc.page.width - 50 });
            rowY += 16;
        });
        // Total amount row
        doc.rect(350, rowY, doc.page.width - 400, 26).fill(primaryColor);
        doc
            .font('Helvetica-Bold')
            .fontSize(11)
            .fillColor('#FFFFFF')
            .text('TOTAL', 358, rowY + 7)
            .text(`${symbol}${data.totalAmount.toLocaleString('en-IN')}`, 0, rowY + 7, {
            align: 'right',
            width: doc.page.width - 50,
        });
        // ── Notes ─────────────────────────────────────────────────────
        if (data.notes) {
            doc
                .font('Helvetica-Bold')
                .fontSize(9)
                .fillColor(primaryColor)
                .text('NOTES', 50, rowY + 40);
            doc
                .font('Helvetica')
                .fontSize(9)
                .fillColor(grayColor)
                .text(data.notes, 50, rowY + 54, { width: 300 });
        }
        // ── Footer ───────────────────────────────────────────────────
        doc.rect(0, doc.page.height - 40, doc.page.width, 40).fill(darkColor);
        doc
            .font('Helvetica')
            .fontSize(8)
            .fillColor('#94A3B8')
            .text('The Simbolo Pvt. Ltd. · billing@simbolo.ai · simbolo.ai', 0, doc.page.height - 25, { align: 'center' });
        doc.end();
    });
}
//# sourceMappingURL=invoice.pdf.builder.js.map