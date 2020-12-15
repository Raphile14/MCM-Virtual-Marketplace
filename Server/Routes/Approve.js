"use strict";
const express = require("express");
const User = require("../Database/User");
const path = require('path');
const fs = require('fs');
const Ticket = require('../Database/Ticket.js');
const Product = require('../Database/Product.js');
const eb = require('../Classes/EmailBuyer.js');
const EmailBuyer = new eb();
const pdf = require("../Classes/PDFWriter.js");
const PDFWriter = new pdf();

let router = express.Router();

router.use(function(req, res, next) {
    // console.log(req.url, "@", Date.now());
    next();
})

// Profile Routes
router
    .route("/:id")
    .get((req, res) => {
        
        try {
            if (req.session.email == null || req.session._id == null) return res.redirect("/login");
            if (req.session.isAdmin && !req.session.isSeller) {
                Ticket.findOneAndUpdate({_id: req.params.id}, {isConfirm: true}, async (err, existingTicket) => {   
                    if (existingTicket == null || err) {
                        return res.redirect("/page_not_found");
                    }
                    Product.updateOne({_id: existingTicket._id}, {confirmed: true}, async (err, existingProduct) => {   
                        return res.adminRedirectURL  
                    });
                });
            } else {                
                Ticket.findByIdAndUpdate({_id: req.params.id}, {isSold: true}, async (err, updatedTicket) => { 
                    // Deduct Area                        
                    Product.findOne({_id: updatedTicket.productID}, async (err, existingProduct) => {
                        let currentQuantity = parseInt(existingProduct.quantity) - parseInt(updatedTicket.quantity);
                        Product.updateOne({_id: updatedTicket.productID}, { $set: {quantity: currentQuantity}}, async (err, result) => {                                
                        })                            
                    });   
                    // Buyer Email Response
                        // Get Buyer Data
                        User.findById({_id: updatedTicket.buyerID}, async (err, buyerData) => {

                            const invoice = {
                                shipping: {
                                    date: updatedTicket.date,
                                    sellerID: updatedTicket.sellerID,
                                    sellerEmail: updatedTicket.sellerEmail,
                                    buyerID: updatedTicket.buyerID,
                                    buyerEmail: updatedTicket.buyerEmail
                                    
                                },
                                items: [
                                  {
                                    item: updatedTicket.productName,
                                    category: updatedTicket.category,
                                    description: updatedTicket.description,
                                    quantity: updatedTicket.quantity,
                                    amount: updatedTicket.price
                                  }
                                ],
                                subtotal: updatedTicket.totalPrice,
                                invoice_nr: updatedTicket._id
                            };
                
                            PDFWriter.createInvoice(invoice);

                            if (err) return res.redirect("/page_not_found");
                            // Seller Data
                            Product.findOne({_id: updatedTicket.productID}, async (err, sellerData) => {
                                // let tickets = existingTicket.reverse();
                                if (err) return res.redirect("/page_not_found");                                
                                EmailBuyer.sendEmail(buyerData, sellerData, updatedTicket.quantity, updatedTicket._id);
                                return res.redirect("/tickets");
                                // return res.render(path.join(__dirname, '../../Client/ejs/pages', 'tickets.ejs'), {
                                //     errorMessage,
                                //     sessionEmail: req.session.email,
                                //     email: req.session.email, 
                                //     _id: req.session._id,
                                //     isAdmin: req.session.isAdmin,
                                //     isSeller: req.session.isSeller,
                                //     existingTicket: tickets
                                // });
                            })                            
                        }); 

   
                    // if (updatedTicket == null || err) {
                    //     return res.redirect("/page_not_found");
                    // }
                    // Ticket.find({sellerID: req.session._id}, async (err, existingTicket) => {
                    //     let errorMessage = "Order Request Tickets";
                    //     if (err) {
                    //         return res.redirect("/page_not_found");
                    //     }
                    //     if (existingTicket.length == 0 || existingTicket == null) {
                    //         errorMessage = "No Order Request Tickets as of now";
                    //     }
                                             
                    // });             
                }); 
            }
        }
        catch (e) {
            return res.redirect("/page_not_found");
        }
               
    })
    .post((req, res) => {});

module.exports = router;