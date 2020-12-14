"use strict";
const express = require("express");
const User = require("../Database/User");
const path = require('path');
const Product = require('../Database/Product.js');
let router = express.Router();

router.use(function(req, res, next) {
    // console.log(req.url, "@", Date.now());
    next();
})

// Profile Routes
router
    .route("/:id")
    .get((req, res) => {
        // console.log("i was here");
        // console.log(req.params.id);
        try {
            let ownership = false;
            if (req.session.email == null || req.session._id == null) return res.redirect("/login");
            User.findById(req.params.id, (err, existingUser) => {
                if (err) {
                    return res.redirect("/page_not_found");
                }
                else if (existingUser == null) {
                    return res.redirect("/page_not_found");     
                }
                else {
                    let ownership = req.params.id == req.session._id;

                    // Products
                    Product.find({userID: req.params.id, confirmed: true}, async (err, existingProduct) => {
                        let products = existingProduct;

                        if (existingProduct == null) {
                            products = [];
                        }
                        res.render(path.join(__dirname, '../../Client/ejs/pages', 'profile.ejs'), 
                        {
                            sellerEmail: existingUser.email,
                            email: req.session.email, 
                            _id: req.session._id,
                            ownership,
                            firstName: existingUser.firstName,
                            lastName: existingUser.lastName,
                            phoneNumber: existingUser.phoneNumber,
                            avatarPath: existingUser.avatarPath,
                            messengerLink: existingUser.messengerLink,
                            twitter: existingUser.twitter,
                            linkedIn: existingUser.linkedIn,
                            instagram: existingUser.instagram,
                            isAdmin: req.session.isAdmin,
                            isSeller: req.session.isSeller,
                            products
                        });
                    });  
                }
            }); 
        }
        catch (e) {
            return res.redirect("/page_not_found");
        }
               
    })
    .post((req, res) => {});

module.exports = router;