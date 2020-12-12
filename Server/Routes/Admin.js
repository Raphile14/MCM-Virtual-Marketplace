"use strict";
const express = require("express");
const crypto = require("crypto-js");
const connection = require("../Database/Connection.js");
const path = require('path');
const User = require("../Database/User");
const Ticket = require("../Database/Ticket");
let router = express.Router();

router.use(function(req, res, next) {
    // console.log(req.url, "@", Date.now());
    next();
})

// Login Routes
router
    .route("/:admin/:category")
    .get((req, res) => {
        let admin = req.params.admin;
        let category = req.params.category;

        // Credibility Check
        if (req.session.email == null || req.session._id == null) return res.redirect("/login");
        User.findById(req.session._id, (err, existingUser) => {     
            if (existingUser == null) {
                return res.redirect("/page_not_found");     
            }
            else if (req.session.isAdmin) {
                let tickets = [];
                let categorySelection = ["categories"];
                let ticketSelection = ["tickets", "confirmed", "unconfirmed", "transactions"];

                // Checks if the link is viable
                if (!ticketSelection.includes(admin) || !categorySelection.includes(category)){
                    return res.redirect("/page_not_found");
                }

                Ticket.find({}, (err, existingTicket) => {     
                    tickets = existingTicket;
                });

                // Sorts the data needed
                if (admin == "tickets"){
                    if (category == "categories"){
                        Ticket.find({}, (err, existingTicket) => {     
                            tickets = existingTicket;
                        });
                    } else {
                        Ticket.find({category}, (err, existingTicket) => {     
                            tickets = existingTicket;
                        });
                    } 
                } else {
                    // Transactions tickets with categories
                    if (admin == "transactions"){
                        if (category == "categories"){
                            Ticket.find({isSold: admin == "transactions"}, (err, existingTicket) => {     
                                tickets = existingTicket;
                            });
                        } else {
                            Ticket.find({isSold: admin == "transactions", category}, (err, existingTicket) => {     
                                tickets = existingTicket;
                            });
                        } 
                    // Confirmed and unconfirmed tickets with categories    
                    } else {
                        if (category == "categories"){
                            Ticket.find({isConfirmed: admin == "confirmed"}, (err, existingTicket) => {     
                                tickets = existingTicket;
                            });
                        } else {
                            Ticket.find({isConfirmed: admin == "confirmed", category}, (err, existingTicket) => {     
                                tickets = existingTicket;
                            });
                        } 
                    }
                } 

                // Renders the page with the tickets
                return res.render(path.join(__dirname, '../../Client/ejs/pages', 'admin.ejs'), 
                    {
                        admin,
                        category,
                        email: existingUser.email, 
                        _id: req.session._id,
                        firstName: existingUser.firstName,
                        lastName: existingUser.lastName,
                        phoneNumber: existingUser.phoneNumber,
                        isAdmin: req.session.isAdmin,
                        isSeller: req.session.isSeller,
                        tickets
                    });
            }
            else {
                return res.redirect("/page_not_found");
            }
        }); 
        
    })
    .post( async (req, res) => {
        
    });

module.exports = router;