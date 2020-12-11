"use strict";
const express = require("express");
const crypto = require("crypto-js");
const connection = require("../Database/Connection.js");
const path = require('path');
const User = require("../Database/User");
const er = require('../Classes/EmailRegistration');
const EmailRegistration = new er();
let router = express.Router();

router.use(function(req, res, next) {
    // console.log(req.url, "@", Date.now());
    next();
})

// Signup Routes
router
    .route("/")
    .get((req, res) => {
        let user = {};
        res.render(path.join(__dirname, '../../Client/ejs/pages', 'signup.ejs'), {errorMessage: null, user, edit: false, isRecovering: false});
    })
    .post( async (req, res) => {
        let email = req.body.email.toLowerCase();
        let user = req.body;        
        if (!email.includes("@mcm.edu.ph")) {
            return res.render(path.join(__dirname, '../../Client/ejs/pages', 'signup.ejs'), {errorMessage: "Only MCM emails are accepted!", user, edit: false, isRecovering: false});
        }
        if (req.body.password != req.body.confirmPassword) {
            return res.render(path.join(__dirname, '../../Client/ejs/pages', 'signup.ejs'), {errorMessage: "Passwords are not the same!", user, edit: false, isRecovering: false});
        }
        
        await connection().then( async () => {
            console.log(req.body);
            try {        
                User.findOne({email: req.body.email}, async (err, existingUser) => {    
                    if (err) {
                        console.log("test");
                    }              
                    if (existingUser == null) {                        
                        user.productCounter = "0";
                        user.email = email,
                        user.isAdmin = false;
                        user.confirmed = false;
                        user.isSeller = false;
                        user.password = crypto.MD5(req.body.password);
                        user.isRecovering = false;
                        let userModel = new User(user);                        
                        await userModel.save();
                        User.findOne({email: req.body.email}, async (err, addedUser) => {
                            EmailRegistration.sendEmail(user, addedUser._id);
                        });                                        
                        // TODO: redirect to page saying that the user needs to check email      
                        return res.redirect("/");
                    }
                    else {
                        console.log("User has already signed up");
                        return res.render(path.join(__dirname, '../../Client/ejs/pages', 'signup.ejs'), {errorMessage: "User has already signed up!", user, edit: false, isRecovering: false});
                    }
                })                
            }
            catch (e) {
                console.log(e);
                return res.render(path.join(__dirname, '../../Client/ejs/pages', 'signup.ejs'), {errorMessage: "Server error! Try again later!", user, edit: false, isRecovering: false});
            }
            finally {
                connection.close;
            }
        });        
    });

module.exports = router;