"use strict";
const express = require("express");
const crypto = require("crypto-js");
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
        res.render(path.join(__dirname, '../../Client/ejs/pages', 'login.ejs'));
    })
    .post( async (req, res) => {
        await connection().then( async () => {
            try {
                const {email, password} = req.body;
                hashPass = crypto.MD5(password);
                User.findOne({email, hashPass}, async (err, existingUser) => {
                    
                    // Successful Login
                    if (existingUser != null) {
                        req.session.email = email;
                        // if (req.session.email) {
                        //     console.log("email detected");
                        // }
                        // else {
                        //     console.log("no email detected");
                        // }
                    }
                    // Failed Login
                    else {
                        console.log("Failed Login")
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