"use strict";
const express = require("express");
const connection = require("../Database/Connection.js");
const path = require('path');
const User = require("../Database/User");
let router = express.Router();

router.use(function(req, res, next) {
    // console.log(req.url, "@", Date.now());
    next();
})

// Login Routes
router
    .route("/")
    .get((req, res) => {
        res.render(path.join(__dirname, '../../Client/ejs/pages', 'signup.ejs'));
    })
    .post( async (req, res) => {
        await connection().then( async mongoose => {
            try {
                const {firstName, lastName, email, password, phoneNumber, messengerLink, twitter, linkedIn, instagram, confirmed} = req.body;
                User.findOne({email: email}, async (err, existingUser) => {
                    if (existingUser == null) {
                        let user = {};
                        user.firstName = firstName;
                        user.lastName = lastName;
                        user.email = email;
                        user.password = password;
                        user.phoneNumber = phoneNumber;
                        user.messengerLink = messengerLink;
                        user.twitter = twitter;
                        user.linkedIn = linkedIn;
                        user.instagram = instagram;
                        user.confirmed = confirmed;

                        let userModel = new User(user);
                        
                        await userModel.save();
                        res.json(userModel);     
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