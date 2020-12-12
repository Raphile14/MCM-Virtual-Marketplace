"use strict";
const express = require("express");
const User = require("../Database/User");
const path = require('path');
const Product = require('../Database/Product.js');
const Ticket = require('../Database/Ticket.js');
const eo = require('../Classes/EmailOrder.js');
const EmailOrder = new eo();
let router = express.Router();

router.use(function(req, res, next) {
    // console.log(req.url, "@", Date.now());
    next();
})

// Order Routes
router
    .route("/:id")
    .get((req, res) => {
        try {
            if (req.session.email == null || req.session._id == null) return res.redirect("/login");

            // Getting Buyer Info
            User.findOne({_id: req.session._id}, async (err, existingUser) => {
                // Specific Product
                Product.findOne({confirmed: true, _id: req.params.id}, async (err, existingProduct) => {
                    let products = existingProduct;

                    if (existingProduct == null || err) {
                        products = [];
                        return res.redirect("/page_not_found");
                    }
                    return res.render(path.join(__dirname, '../../Client/ejs/pages', 'order.ejs'), 
                    {
                        email: req.session.email, 
                        sellerEmail: existingProduct.email,
                        _id: req.session._id,
                        firstName: existingUser.firstName,
                        lastName: existingUser.lastName,
                        phoneNumber: existingUser.phoneNumber,
                        avatarPath: existingUser.avatarPath,
                        isAdmin: req.session.isAdmin,
                        isSeller: req.session.isSeller,
                        products
                    });
                }); 
            });            
        }
        catch (e) {
            return res.redirect("/page_not_found");
        }
               
    })
    .post( async (req, res) => {
        let buyer = {};
        let product = {};

        // Get Buyer Data
        User.findOne({email: req.session.email}, async (err, buyerData) => {
            buyer = buyerData;
            

            Product.findOne({_id: req.params.id} , async (err, productData) => {
                // Get Date
                let today = new Date();
                let dd = String(today.getDate()).padStart(2, '0');
                let mm = String(today.getMonth() + 1).padStart(2, '0');
                let yyyy = today.getFullYear();
                today = mm + '/' + dd + '/' + yyyy;

                product = productData;
                EmailOrder.sendEmail(buyer, product, req.body.quantity);
                let ticket = {};
                ticket.sellerID = product.userID;
                ticket.sellerEmail = product.email;
                ticket.buyerID = buyerData._id;
                ticket.buyerEmail = req.session.email;
                ticket.quantity = req.body.quantity;
                ticket.productID = req.params.id;
                ticket.productName = product.productName;
                ticket.price = product.price;
                ticket.isConfirmed = false,
                ticket.isSold = false,                
                ticket.date = today;
                ticket.description = product.description;
                ticket.description = product.description;
                ticket.category = product.category;
                ticket.totalPrice = parseFloat(product.price) * parseFloat(product.quantity);
                let ticketModel = new Ticket(ticket);
                await ticketModel.save();
                return res.redirect("/");
            });
        });
    });

module.exports = router;