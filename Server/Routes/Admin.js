"use strict";
const express = require("express");
const crypto = require("crypto-js");
const connection = require("../Database/Connection.js");
const path = require('path');
const User = require("../Database/User");
const Ticket = require("../Database/Ticket");
const Product = require("../Database/Product");
let router = express.Router();

router.use(function(req, res, next) {
    next();
})

// Login Routes
router
    .route("/:type/:category")
    .get( async (req, res) => {
        // Credibility Check
        if (req.session.email == null || req.session._id == null) return res.redirect("/login");
        if (!req.session.isAdmin) return res.redirect("/page_not_found");

        entriesRetrieve(req, res, req.params.type, req.params.category);     
    })
    .post( async (req, res) => {
        if (req.session.email == null || req.session._id == null) return res.redirect("/login");
        if (!req.session.isAdmin) return res.redirect("/page_not_found");

        if (req.body.btn_modify == "approve"){
            Product.updateOne({_id: req.body.productID}, { $set: {confirmed: true}}, (err, existingTicket) => {     
                entriesRetrieve(req, res, req.body.entryURL, req.body.categoryURL);
            });
        } else if (req.body.btn_modify == "delete") {
            Product.deleteOne({_id: req.body.productID}, (err, result) => {
                entriesRetrieve(req, res, req.body.entryURL, req.body.categoryURL);
            });
        }
        else return res.redirect("/page_not_found");
        
    });

async function entriesRetrieve(req, res, type, category){
    let entries = [];

    let productCategories = ["health&beauty", "food", "digitalproducts", "electronics"];

    if (type == "products") {
        if (category == "all") {
            await Product.find({}, (err, existingProduct) => {     
                if (err) return res.redirect("/page_not_found");
                entries = existingProduct;
                return res.render(path.join(__dirname, '../../Client/ejs/pages', 'admin.ejs'), {
                    type,
                    category,
                    email: req.session.email, 
                    _id: req.session._id,
                    isAdmin: req.session.isAdmin,
                    isSeller: req.session.isSeller,
                    entries
                });
            });
        }
        else if (productCategories.includes(category)) {
            await Product.find({category}, (err, existingProduct) => {     
                if (err) return res.redirect("/page_not_found");
                entries = existingProduct;
                return res.render(path.join(__dirname, '../../Client/ejs/pages', 'admin.ejs'), {
                    type,
                    category,
                    email: req.session.email, 
                    _id: req.session._id,
                    isAdmin: req.session.isAdmin,
                    isSeller: req.session.isSeller,
                    entries
                });
            });
        }
    }
    else if (type == "confirmed" || type == "unconfirmed") {
        if (category == "all") {
            await Product.find({confirmed: type == "confirmed"}, (err, existingProduct) => {     
                if (err) return res.redirect("/page_not_found");
                entries = existingProduct;
                return res.render(path.join(__dirname, '../../Client/ejs/pages', 'admin.ejs'), {
                    type,
                    category,
                    email: req.session.email, 
                    _id: req.session._id,
                    isAdmin: req.session.isAdmin,
                    isSeller: req.session.isSeller,
                    entries
                });
            });
        }
        else if (productCategories.includes(category)) {
            await Product.find({category, confirmed: type == "confirmed"}, (err, existingProduct) => {     
                if (err) return res.redirect("/page_not_found");
                entries = existingProduct;
                return res.render(path.join(__dirname, '../../Client/ejs/pages', 'admin.ejs'), {
                    type,
                    category,
                    email: req.session.email, 
                    _id: req.session._id,
                    isAdmin: req.session.isAdmin,
                    isSeller: req.session.isSeller,
                    entries
                });
            });
        }
    }
    else if (type == "tickets") {
        if (category == "all") {
            await Ticket.find({isConfirmed: true}, (err, existingTicket) => {     
                if (err) return res.redirect("/page_not_found");
                entries = existingTicket;
                return res.render(path.join(__dirname, '../../Client/ejs/pages', 'admin.ejs'), {
                    type,
                    category,
                    email: req.session.email, 
                    _id: req.session._id,
                    isAdmin: req.session.isAdmin,
                    isSeller: req.session.isSeller,
                    entries
                });
            });
        }
        else if (productCategories.includes(category)) {
            await Ticket.find({category, isConfirmed: true}, (err, existingTicket) => {     
                if (err) return res.redirect("/page_not_found");
                entries = existingTicket;
                return res.render(path.join(__dirname, '../../Client/ejs/pages', 'admin.ejs'), {
                    type,
                    category,
                    email: req.session.email, 
                    _id: req.session._id,
                    isAdmin: req.session.isAdmin,
                    isSeller: req.session.isSeller,
                    entries
                });
            });
        }
    } 
    else {
        return res.redirect("/page_not_found");
    }
}

module.exports = router;