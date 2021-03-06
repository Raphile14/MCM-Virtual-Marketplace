"use strict";
const express = require("express");
const formidable = require('formidable');
const fs = require('fs');
const connection = require("../Database/Connection.js");
const path = require('path');
const Product = require("../Database/Product");
const User = require("../Database/User");
let router = express.Router();

router.use(function(req, res, next) {
    // console.log(req.url, "@", Date.now());
    next();
})

// Product Routes
router
    .route("/")
    .get((req, res) => {
        let isFull = false;

        // User Validation
        if (req.session.email == null || req.session._id == null) return res.redirect("/login");
        if (!req.session.isSeller) return res.redirect("/");

        Product.find({userID: req.session._id}, async (err, existingProducts) => {
            if (err) {
                return res.redirect("/");
            }
            // if (existingProducts.length == 10){
            //     isFull = true;
            //     // Show page where list of selling items is full
            //     return res.redirect("/");
            // }
            else {
                res.render(path.join(__dirname, '../../Client/ejs/pages', 'product.ejs'), {
                    data: {},
                    productError: false, 
                    isFull,
                    email: req.session.email, 
                    _id: req.session._id,
                    isAdmin: req.session.isAdmin,
                    isSeller: req.session.isSeller
                });
            }
        });        
    })
    .post( async (req, res) => {
        let data = req.body;
        let ticket;

        // Save Database
        await connection().then( async () => {
            try {
                let product = req.body;
                product.userID = req.session._id;
                product.category = req.body.category.toLowerCase().replace(/\s/g, '');
                product.confirmed = false;                
                User.findById({_id: product.userID}, async (err, existingUser) => {                    
                    product.firstName = existingUser.firstName;
                    product.lastName = existingUser.lastName;
                    product.email = existingUser.email;
                    product.parentID = null;

                    let productModel = new Product(product);
                    await productModel.save();
                    // await productModel.save();
                    
                    // ticket.sellerID = product.userID;
                    // ticket.sellerEmail = productSaved.emailID;
                    // ticket.buyerID = "";
                    // ticket.buyerEmail = "";
                    // ticket.quantity = productSaved.quantity;
                    // ticket.productID = productSaved._id;
                    // ticket.productName = productSaved.productName;
                    // ticket.price = productSaved.price;
                    // ticket.totalPrice = "";
                    // ticket.description = productSaved.description;
                    // ticket.category = productSaved.category;
                    // ticket.paymentMethod = "";
                    // ticket.date = "";
                    // ticket.isConfirmed = false;
                    // ticket.isSold = false;

                    // let ticketModel = new Ticket(ticket);
                    // await ticketModel.save();

                    res.redirect("/");
                });
                
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