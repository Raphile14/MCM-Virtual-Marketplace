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
        let ownership = false;
        if (req.session.email == null || req.session._id == null) return res.redirect("/login");
        User.findById(req.params.id, (err, existingUser) => {
            console.log(existingUser);
            if (err) {
                console.log(err);
                res.send(err);     
            }
            else if (existingUser == null) {
                console.log("None existing user");
                res.send("None existing user");        
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
                        email: req.session.email, 
                        _id: req.session._id,
                        ownership,
                        firstName: existingUser.firstName,
                        lastName: existingUser.lastName,
                        phoneNumber: existingUser.phoneNumber,
                        isAdmin: req.session.isAdmin,
                        isSeller: req.session.isSeller,
                        products
                    });
                });
 
                
            }
        });        
    })
    .post((req, res) => {});

module.exports = router;