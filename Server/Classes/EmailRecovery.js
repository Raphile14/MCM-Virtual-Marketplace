const nodemailer = require('nodemailer');

module.exports = class EmailRecovery {
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
    sendEmail(user) {
        try {
            let text = 
            'Hi, ' + user.firstName + ' ' + user.lastName + '!'
            + '\n\nYou may now change your password. Please click the following link: ' 
            + 'http://localhost:5000/profileedit/' + user._id
            + '\n\nThank you!';

            let message = 
            '<h1> Hi, ' + user.firstName + ' ' + user.lastName + '!</h1> <br>'
            + '\n\nYou may now change your password. Please click the following link: ' 
            + '<a href="http://localhost:5000/profileedit/' + user._id + '"> HERE! </a> <br> <br>'
            + 'Thank you!';

            let mailOptions = {
                from: process.env.RECEIPT_EMAIL,
                to: user.email,
                subject: 'MCM Virtual Marketplace Account Recovery',
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