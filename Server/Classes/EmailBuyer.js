const nodemailer = require('nodemailer');
const path = require('path');

module.exports = class EmailOrder {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            auth: {
                user: process.env.RECEIPT_EMAIL,
                pass: process.env.RECEIPT_PASS
            }
        });
    }
    sendEmail(buyer, product, quantity, invoiceID) {
        try {          
            let amount = (parseFloat(product.price) * parseFloat(quantity));
            let text = 
            'Hi, ' + buyer.firstName + ' ' + buyer.lastName + '!'
            + '\n\nSeller ' + product.firstName + ' ' + product.lastName + ' (' + product.email + ') has confirmed your order of ' + product.productName + ' with a quantity of ' + quantity + ' for the total price of ₱' + amount + '. '
            + 'The invoice receipt and informed consent letter are attached to this email.'
            + '\n\nThank you!';

            let message = 
            '<h1> Hi, ' + buyer.firstName + ' ' + buyer.lastName + '!</h1> <br>'
            + 'Seller ' + product.firstName + ' ' + product.lastName + ' (' + product.email + ') has confirmed your order of ' + product.productName + ' with a quantity of ' + quantity + ' for the total price of ₱' + amount + '. '
            + 'The invoice receipt and informed consent letter are attached to this email.<br> <br>'
            + 'Thank you!';

            let mailOptions = {
                from: process.env.RECEIPT_EMAIL,
                to: buyer.email,
                subject: 'MCM Virtual Marketplace Order Confirmation',
                html: message,
                text: text,
                attachments: [
                    {
                        filename: 'Informed_Consent_Virtual_Market' + '.pdf',
                        path: path.join(__dirname, '../../Server/Attachments/invoice/Informed_Consent_Virtual_Market' + '.pdf')
                    },
                    {
                        filename: 'invoice - ' + invoiceID + '.pdf',
                        path: path.join(__dirname, '../../tmp/invoice - ' + invoiceID + '.pdf')
                    }

                ]
            }
            
            this.transporter.sendMail(mailOptions, function(err, data){
                if (err) {
                    console.log(err);
                    return false;
                }
                else {
                    return true;
                }
            }); 
        }
        catch (e) {
            console.log(e);
        }


    }
}