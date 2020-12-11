"use strict";
const express = require("express");
const connection = require("../Database/Connection.js");
const path = require('path');
const Ticket = require("../Database/Ticket.js");
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
    })
    .post( async (req, res) => {
        let sellerID = req.session.email;
    
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
                res.render(path.join(__dirname, '../../Client/ejs/pages', 'product.ejs'), {
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