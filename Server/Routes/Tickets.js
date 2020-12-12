    "use strict";
const express = require("express");
const connection = require("../Database/Connection.js");
const path = require('path');
const Ticket = require("../Database/Ticket.js");
const User = require("../Database/User");
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
        Ticket.find({sellerID: req.session._id}, async (err, existingTicket) => {
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
                existingTicket
            });
        });        
    })
    .post( async (req, res) => {
        let sellerID = req.session.email;
        console.log("test")
    
        // Save Database
        await connection().then( async () => {
            try {
                let ticket = req.body;
                ticket.sellerID = sellerID;
                ticket.buyerEmail = req.body.email.toLowerCase();
                ticket.quantity = false;

                let ticketModel = new Ticket(ticket);
                await ticketModel.save()
                res.redirect("/");
            }
            catch (e) {
                res.render(path.join(__dirname, '../../Client/ejs/pages', 'tickets.ejs'), {
                    productError: true, 
                    data,
                    email: req.session.email, 
                    _id: req.params.id,
                    isAdmin: req.session.isAdmin,
                    isSeller: req.session.isSeller
                });
                console.log(e);
            }
            finally {
                connection.close;
            }
        } )
    });

module.exports = router;