const nodemailer = require('nodemailer');

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
    sendEmail(buyer, product, quantity) {
        try {          
            let amount = (parseFloat(product.price) * parseFloat(quantity));
            let text = 
            'Hi, ' + buyer.firstName + ' ' + buyer.lastName + '!'
            + '\n\nSeller ' + product.firstName + ' ' + product.lastName + ' (' + product.email + ') has confirmed your order of ' + product.productName + ' with a quantity of ' + quantity + ' for the total price of ₱' + amount + '. '
            + ''
            + '\n\nThank you!';

            let message = 
            '<h1> Hi, ' + buyer.firstName + ' ' + buyer.lastName + '!</h1> <br>'
            + 'Seller ' + product.firstName + ' ' + product.lastName + ' (' + product.email + ') has confirmed your order of ' + product.productName + ' with a quantity of ' + quantity + ' for the total price of ₱' + amount + '. '
            + '<br> <br>'
            + 'Thank you!';

            let mailOptions = {
                from: process.env.RECEIPT_EMAIL,
                to: buyer.email,
                subject: 'MCM Virtual Marketplace Order Confirmation',
                html: message,
                text: text
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