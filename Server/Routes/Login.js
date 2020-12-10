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
        res.render(path.join(__dirname, '../../Client/ejs/pages', 'login.ejs'), {loginError: false});
    })
    // SOLUTION .post("/loginForm", async(req, res))
    .post( async (req, res) => {
        await connection().then( async () => {
            try {
                const {email, password} = req.body;
                let hashPass = crypto.MD5(password);
                console.log(req.body);                
                User.findOne({email: email}, async (err, existingUser) => {
                    console.log(hashPass);
                    console.log("inputted password: " + hashPass)
                    console.log(existingUser);
                    // Successful Login
                    if (existingUser != null) {
                        if (existingUser.password == hashPass) {
                            console.log("Login Success")
                            req.session.email = email;
                            // if (req.session.email) {
                            //     console.log("email detected");
                            // }
                            // else {
                            //     console.log("no email detected");
                            // }
                            return res.redirect("/");
                        }
                        else {
                            return res.render(path.join(__dirname, "../../Client/ejs/pages/login"), {loginError: true});
                        }
                        
                    }
                    // Failed Login
                    else {
                        return res.render(path.join(__dirname, "../../Client/ejs/pages/login"), {loginError: true});
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