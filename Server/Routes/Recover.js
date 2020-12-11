"use strict";
const express = require("express");
const crypto = require("crypto-js");
const connection = require("../Database/Connection.js");
const path = require('path');
const User = require("../Database/User");
const er = require("../Classes/EmailRecovery");
const EmailRecovery = new er();
let router = express.Router();

router.use(function(req, res, next) {
    // console.log(req.url, "@", Date.now());
    next();
})

// Login Routes
router
    .route("/")
    .get((req, res) => {
        res.render(path.join(__dirname, '../../Client/ejs/pages', 'recover.ejs'), {errorMessage: null});
    })
    .post( async (req, res) => {
        if (req.session.email != null && req.session._id != null) {
            return res.redirect("/");
        }
        await connection().then( async () => {
            try {
                let email = req.body.email.toLowerCase();
                let generatedCode = Math.floor(100000 + Math.random() * 900000);
                User.findOneAndUpdate({email}, {$set: {isRecovering: true, code: generatedCode}}, async (err, existingUser) => {
                    // Successful Login
                    if (existingUser != null) {                        
                        EmailRecovery.sendEmail(existingUser, generatedCode);
                        return res.render(path.join(__dirname, "../../Client/ejs/pages/recover"), {errorMessage: "Please check your email!"}); 
                    }
                    else {
                        return res.render(path.join(__dirname, "../../Client/ejs/pages/recover"), {errorMessage: "Email not in Database"});                        
                    }

                });
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