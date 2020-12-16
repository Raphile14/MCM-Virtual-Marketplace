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
            + '\n\nYour order on the product "' + product.productName + '" with a quantity of ' + quantity + ' for the total price of ₱' + amount + ' is placed and the seller is notified. '
            + 'Awaiting for the confirmation of seller ' + product.firstName + ' ' + product.lastName + ' (' + product.email + ')!'
            + '\n\nThank you!';

            let message = 
            '<h1> Hi, ' + buyer.firstName + ' ' + buyer.lastName + '!</h1> <br>'
            + 'Your order on the product "' + product.productName + '" with a quantity of ' + quantity + ' for the total price of ₱' + amount + ' is placed and the seller is notified. '
            + 'Awaiting for the confirmation of seller ' + product.firstName + ' ' + product.lastName + ' (' + product.email + ')! <br> <br>'
            + 'Thank you!';

            let mailOptions = {
                from: process.env.RECEIPT_EMAIL,
                to: buyer.email,
                subject: 'MCM Virtual Marketplace Order Request',
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