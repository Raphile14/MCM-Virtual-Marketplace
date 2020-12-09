"use strict";
const express = require("express");
const crypto = require("crypto-js");
const connection = require("../Database/Connection.js");
const path = require('path');
const User = require("../Database/User");
const er = require('../Classes/EmailRegistration.js');
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
        res.render(path.join(__dirname, '../../Client/ejs/pages', 'signup.ejs'), {signupError: false, signupExist: false});
    })
    .post( async (req, res) => {
        await connection().then( async () => {
            console.log(req.body);
            
            try {    
                // if (req.body.firstName == null 
                //     // || req.body.lastName == null || req.body.email == null || req.body.phoneNumber || req.body.city == null
                //     ) {
                //     console.log("Missing Data")
                //     return res.render(path.join(__dirname, '../../Client/ejs/pages', 'signup.ejs'), {signupError: true});
                // }            
                User.findOne({email: req.body.email}, async (err, existingUser) => {    
                    if (err) {
                        console.log("test");
                    }              
                    if (existingUser == null) {                        
                        let user = req.body;
                        user.isAdmin = false;
                        user.confirmed = false;
                        user.password = crypto.MD5(req.body.password);
                        let userModel = new User(user);                        
                        await userModel.save();
                        // res.json(userModel); 
                        User.findOne({email: req.body.email}, async (err, addedUser) => {
                            EmailRegistration.sendEmail(user, addedUser._id);
                        });                                        
                        // TODO: redirect to page saying that the user needs to check email      
                        return res.render(path.join(__dirname, '../../Client/ejs/pages', 'index.ejs'), {signupError: false});
                    }
                    else {
                        console.log("User has already signed up");
                        return res.render(path.join(__dirname, '../../Client/ejs/pages', 'signup.ejs'), {signupError: false, signupExist: true});
                    }
                })                
            }
            catch (e) {
                console.log(e);
                return res.render(path.join(__dirname, '../../Client/ejs/pages', 'signup.ejs'), {signupError: true, signupExist: false});
            }
            finally {
                connection.close;
            }
        });        
    });

module.exports = router;