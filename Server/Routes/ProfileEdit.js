"use strict";
const express = require("express");
const crypto = require("crypto-js");
const connection = require("../Database/Connection.js");
const path = require('path');
const User = require("../Database/User");
const er = require('../Classes/EmailRecovery.js');
const EmailRecovery = new er();
let router = express.Router();

router.use(function(req, res, next) {
    // console.log(req.url, "@", Date.now());
    next();
})

// Signup Routes
router
    .route("/:id")
    .get((req, res) => {
        let user = {};
        User.findById(req.params.id, (err, existingUser) => {
            if (existingUser == null || err || !existingUser.isRecovering) {
                return res.redirect("/page_not_found");
            }
            else {
                user = existingUser;
                return res.render(path.join(__dirname, '../../Client/ejs/pages', 'signup.ejs'), {errorMessage: null, user, edit: true});
            }
        });         
    })
    .post( async (req, res) => {
        console.log(req.body);
        let email = req.body.email.toLowerCase();
        let user = req.body;    

        if (req.body.password != req.body.confirmPassword) {
            return res.render(path.join(__dirname, '../../Client/ejs/pages', 'signup.ejs'), {errorMessage: "Passwords are not the same!", user, edit: false});
        }
        user.email = email,
        user.isAdmin = false;
        user.confirmed = true;
        user.isSeller = false;
        user.password = crypto.MD5(req.body.password);
        user.isRecovering = false;
        User.updateOne({email}, { $set: user }, async (err, existingUser) => {
            if (err) throw err;
            console.log("1 document updated");
        });
        return res.redirect("/");
    });

module.exports = router;