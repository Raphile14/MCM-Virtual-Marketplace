"use strict";
const express = require("express");
const { link } = require("fs");
const path = require('path');
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
    .post((req, res) => {
        const {firstName, lastName, email, password, phoneNumber, messengerLink, twitter, linkedIn, instagram, confirmed} = req.body;
        let user = {};
        user.id = ObjectId();
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
    });

module.exports = router;