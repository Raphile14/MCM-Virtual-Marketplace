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
    .route("/:type")
    .get( async (req, res) => {
        // Credibility Check
        if (req.session.email == null || req.session._id == null) return res.redirect("/login");
        if (!req.session.isAdmin) return res.redirect("/page_not_found");

        entriesRetrieve(req, res, req.params.type);     
    })
    .post( async (req, res) => {
        if (req.session.email == null || req.session._id == null) return res.redirect("/login");
        if (!req.session.isAdmin) return res.redirect("/page_not_found");

        if (req.body.btn_modify == "Promote to Seller"){
            User.updateOne({_id: req.body.userID}, { $set: {isSeller: true}}, (err, existingTicket) => {     
                entriesRetrieve(req, res, req.body.entryURL);
            });
        } else if (req.body.btn_modify == "Remove Seller") {
            User.updateOne({_id: req.body.userID}, { $set: {isSeller: false}}, (err, result) => {
                entriesRetrieve(req, res, req.body.entryURL);
            });
        }
        else return res.redirect("/page_not_found");
        
    });

async function entriesRetrieve(req, res, type){
    let entries = [];

    if (type == "all") {
        await User.find({}, (err, existingUser) => {     
            if (err) return res.redirect("/page_not_found");
            entries = existingUser;
            return res.render(path.join(__dirname, '../../Client/ejs/pages', 'permissions.ejs'), {
                type,
                email: req.session.email, 
                _id: req.session._id,
                isAdmin: req.session.isAdmin,
                isSeller: req.session.isSeller,
                entries
            });
        });
    }
    else if (type == "sellers" || type == "nonseller") {
        let status = true;
        if (type == "nonseller") status = false;
        await User.find({isSeller: status}, (err, existingUser) => {     
            if (err) return res.redirect("/page_not_found");
            entries = existingUser;
            return res.render(path.join(__dirname, '../../Client/ejs/pages', 'permissions.ejs'), {
                type,
                email: req.session.email, 
                _id: req.session._id,
                isAdmin: req.session.isAdmin,
                isSeller: req.session.isSeller,
                entries
            });
        });
    }
    else return res.redirect("/page_not_found");
}

module.exports = router;