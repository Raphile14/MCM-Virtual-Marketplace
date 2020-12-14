const fs = require("fs");
const path = require('path');
const PDFDocument = require("pdfkit");

module.exports = class PDFWrite {
    constructor () {

    }

    createInvoice(invoice) {
        let doc = new PDFDocument({ margin: 50 });
        
        this.generateHeader(doc);
        this.generateCustomerInformation(doc, invoice);
        this.generateInvoiceTable(doc, invoice);
        this.generateFooter(doc);
        
        doc.end();
        doc.pipe(fs.createWriteStream(path.join(__dirname, '../../tmp/invoice - ' + invoice.invoice_nr + '.pdf')));
    }
    
    generateHeader(doc) {
        doc
            .image(path.join(__dirname, '../../Client/images/logo.png'), 50, 45, { width: 50 })
            .fillColor("#444444")
            .fontSize(20)
            .text("MCM Virtual Marketplace", 110, 57)
            .fontSize(10)
            .text("Malayan Colleges Mindanao", 200, 65, { align: "right" })
            .text("Virtual Marketplace", 200, 80, { align: "right" })
            .moveDown();
    }
      
    generateFooter(doc) {
        doc
            .fontSize(10)
            .text(
            "© Copyright 2020 - The Coding Catharsis",
            50,
            700,
            { align: "center", width: 500 }
            );
    }
    
    generateCustomerInformation(doc, invoice) {
        const shipping = invoice.shipping;
    
        doc
            .text(`Ticket Number: ${invoice.invoice_nr}`, 50, 120)
            .text(`Transaction Date: ${invoice.shipping.date}`, 50, 135)
            .text(`Invoice Document Creation Date: ${Date.now()}`, 50, 150)
            .text(`Total Amount: ${invoice.subtotal} PHP`, 50, 165)
    
            .text(`Buyer ID: ${shipping.buyerID}`, 300, 200)
            .text(`Buyer Email: ${shipping.buyerEmail}`, 300, 215)
            .text(`Seller ID: ${shipping.sellerID}`, 50, 200)
            .text(`Seller Email: ${shipping.sellerEmail}`, 50, 215)
            .moveDown();
    }    
    
    generateTableRow(doc, y, c1, c2, c3, c4, c5, c6) {
        doc
            .fontSize(10)
            .text(`===== PRODUCT DETAILS =====`, 50, 260, { align: "center", width: 500 })
            .text("Product Name", 50, 275)
            .text("Category", 150, 275)
            .text("Price", 250, 275)
            .text("Quantity", 350, 275)
            .text("Total Price", 450, 275)
            .text("===== PRODUCT DESCRIPTION =====", 50, 345, { align: "center", width: 500 })
            .text(c1, 50, 300)        
            .text(c2, 150, 300)
            .text(c3 + 'PHP', 250, 300)
            .text(c4, 350, 300)
            .text(c5 + 'PHP', 450, 300)
            .text(c6, 50, 360, { align: "justify", width: 500 });
    }
    
    generateInvoiceTable(doc, invoice) {
        let i,
            invoiceTableTop = 330;
    
        for (i = 0; i < invoice.items.length; i++) {
            const item = invoice.items[i];
            const position = invoiceTableTop + (i + 1) * 30;
            this.generateTableRow(
            doc,
            position,
            item.item,
            item.category,
            item.amount,
            item.quantity,
            invoice.subtotal,
            item.description
            );
        }
    }
}