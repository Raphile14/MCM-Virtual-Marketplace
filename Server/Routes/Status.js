"use strict";
const express = require("express");
const connection = require("../Database/Connection.js");
const fs = require('fs');
const path = require('path');
const Ticket = require("../Database/Ticket.js");
const pdf = require("../Classes/PDFWriter.js");
const User = require("../Database/User");
const PDFWriter = new pdf();
let router = express.Router();

router.use(function(req, res, next) {
    // console.log(req.url, "@", Date.now());
    next();
})

// Ticket Routes
router
    .route("/")
    .get((req, res) => {
        if (req.session.email == null || req.session._id == null) {
            return res.redirect("/login");
        }
        Ticket.find({buyerID: req.session._id}, async (err, existingTicket) => {
            let tickets = existingTicket.reverse();
            let errorMessage = "Order Request Tickets";
            if (err) {
                return res.redirect("/page_not_found");
            }
            if (existingTicket.length == 0) {
                errorMessage = "No Order Request Tickets as of now";
            }
            return res.render(path.join(__dirname, '../../Client/ejs/pages', 'tickets.ejs'), {
                errorMessage,
                sessionEmail: req.session.email,
                email: req.session.email, 
                _id: req.session._id,
                isAdmin: req.session.isAdmin,
                isSeller: req.session.isSeller,
                existingTicket: tickets,
                isStatus: true
            });
        });        
    })
    .post( async (req, res) => {
        Ticket.findOne({_id: req.body.ticketID}, async (err, existingTicket) => {
            const invoice = {
                shipping: {
                    date: existingTicket.date,
                    sellerID: existingTicket.sellerID,
                    sellerEmail: existingTicket.sellerEmail,
                    buyerID: existingTicket.buyerID,
                    buyerEmail: existingTicket.buyerEmail
                    
                },
                items: [
                  {
                    item: existingTicket.productName,
                    category: existingTicket.category,
                    description: existingTicket.description,
                    quantity: existingTicket.quantity,
                    amount: existingTicket.price
                  }
                ],
                subtotal: existingTicket.totalPrice,
                invoice_nr: existingTicket._id
            };

            await PDFWriter.createInvoice(invoice);


            // After Printing PDF
            Ticket.find({buyerID: req.session._id}, async (err, existingTicket) => {
                let tickets = existingTicket.reverse();
                let errorMessage = "Order Request Tickets";
                if (err) {
                    return res.redirect("/page_not_found");
                }
                if (existingTicket.length == 0) {
                    errorMessage = "No Order Request Tickets as of now";
                }
                
                let filePath = path.join(__dirname, '../../tmp/invoice - ' + invoice.invoice_nr + '.pdf');
                let pdfData;
                fs.readFile(filePath, function (err,data){
                    pdfData = data;
                    let file = fs.createReadStream(filePath);
                    let stat = fs.statSync(filePath);
                    res.setHeader('Content-Length', stat.size);
                    res.setHeader("Content-Type", "application/pdf");
                    res.setHeader('Content-Disposition', 'attachment; filename=invoice - '+ invoice.invoice_nr + '.pdf');
                    file.pipe(res);
                    // return res.send(pdfData);
                    // return res.send(pdfData);
                    // return res.render(path.join(__dirname, '../../Client/ejs/pages', 'tickets.ejs'), {
                    //     errorMessage,
                    //     sessionEmail: req.session.email,
                    //     email: req.session.email, 
                    //     _id: req.session._id,
                    //     isAdmin: req.session.isAdmin,
                    //     isSeller: req.session.isSeller,
                    //     existingTicket: tickets,
                    //     pdfData
                    // });
                });                                
            });            
        });  
        
    });


module.exports = router;