"use strict";
const express = require("express");
const User = require("../Database/User");
const path = require('path');
const Ticket = require('../Database/Ticket.js');
const Product = require('../Database/Product.js');
const eb = require('../Classes/EmailBuyer.js');
const EmailBuyer = new eb();

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
                Ticket.updateOne({_id: req.params.id}, {isSold: true}, async (err, existingTicket) => {   
                    if (existingTicket == null || err) {
                        return res.redirect("/page_not_found");
                    }
                    Ticket.find({sellerID: req.session._id}, async (err, existingTicket) => {
                        let quantity = existingTicket.quantity;
                        let errorMessage = "Order Request Tickets";
                        if (err) {
                            return res.redirect("/page_not_found");
                        }
                        if (existingTicket.length == 0 || existingTicket == null) {
                            errorMessage = "No Order Request Tickets as of now";
                        }

                        // // Deduct Area                        
                        // Product.findOne({_id: existingTicket.productID}, async (err, existingProduct) => {
                        //     let currentQuantity = parseInt(existingProduct.quantity) - parseInt(existingTicket.quantity);
                        //     Product.updateOne({_id: existingTicket.productID}, { $set: {price: currentQuantity}}, async (err, sellerData) => {
                        //         console.log("Product Quantity have been deducted!");
                        //     })                            
                        // });   

                        // Buyer Email Response
                        // Get Buyer Data
                        // User.findOne({_id: existingTicket.buyerID}, async (err, buyerData) => {
                        //     // Seller Data
                        //     Product.findById({_id: existingTicket.productID}, async (err, sellerData) => {
                        //         console.log(buyerData)
                        //         console.log(sellerData);
                        //         EmailBuyer.sendEmail(buyerData, sellerData, quantity);
                        //     })
                        // });                      
                        return res.render(path.join(__dirname, '../../Client/ejs/pages', 'tickets.ejs'), {
                            errorMessage,
                            sessionEmail: req.session.email,
                            email: req.session.email, 
                            _id: req.session._id,
                            isAdmin: req.session.isAdmin,
                            isSeller: req.session.isSeller,
                            existingTicket
                        });
                    });             
                }); 
            }
        }
        catch (e) {
            return res.redirect("/page_not_found");
        }
               
    })
    .post((req, res) => {});

module.exports = router;