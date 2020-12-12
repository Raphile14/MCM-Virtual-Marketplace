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
            'Hi, ' + product.firstName + ' ' + product.lastName + '!'
            + '\n\nUser ' + buyer.firstName + ' ' + buyer.lastName + ' (' + buyer.email + ') has placed an order on the product ' + product.productName + ' with a quantity of ' + quantity + ' for the total price of ₱' + amount + '. '
            + 'Check the request by logging in and navigating to the "Transaction Tickets" Page!'
            + '\n\nThank you!';

            let message = 
            '<h1> Hi, ' + product.firstName + ' ' + product.lastName + '!</h1> <br>'
            + 'User ' + buyer.firstName + ' ' + buyer.lastName + ' (' + buyer.email + ') has placed an order on the product ' + product.productName + ' with a quantity of ' + quantity + ' for the total price of ₱' + amount + '. '
            + 'Check the request by logging in and navigating to the "Transaction Tickets" Page! <br> <br>'
            + 'Thank you!';

            let mailOptions = {
                from: process.env.RECEIPT_EMAIL,
                to: product.email,
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