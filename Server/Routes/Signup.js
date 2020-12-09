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
        res.render(path.join(__dirname, '../../Client/ejs/pages', 'signup.ejs'));
    })
    .post( async (req, res) => {
        await connection().then( async () => {
            try {
                User.findOne({email: req.body.email}, async (err, existingUser) => {
                    if (existingUser == null) {
                        let user = req.body;
                        user.password = crypto.MD5(req.body.password);
                        let userModel = new User(user);                        
                        await userModel.save();
                        res.json(userModel); 
                        User.find({email: req.body.email}, async (err, addedUser) => {
                            EmailRegistration.sendEmail(user, addedUser[0]._id);
                        });                                              
                    }
                    else {
                        console.log("User has already signed up");
                    }
                })                
            }
            catch (e) {
                console.log(e);
            }
            finally {
                connection.close;
            }
        });        
    });

module.exports = router;