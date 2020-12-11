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
        if (req.session.email == null || req.session._id == null) return res.redirect("/login");
        User.findById(req.session._id, (err, existingUser) => {
            console.log(existingUser);            
            if (existingUser == null) {
                return res.redirect("/page_not_found");     
            }
            else if (req.session.isAdmin) {
                return res.render(path.join(__dirname, '../../Client/ejs/pages', 'admin.ejs'), 
                {
                    email: existingUser.email, 
                    _id: req.session._id,
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                    phoneNumber: existingUser.phoneNumber,
                    isAdmin: req.session.isAdmin,
                    isSeller: req.session.isSeller
                });
            }
            else {
                return res.redirect("/page_not_found");
            }
        }); 
        
    })
    .post( async (req, res) => {
        // if (req.session.email != null && req.session._id != null) {
        //     return res.redirect("/");
        // }
        // await connection().then( async () => {
        //     try {
        //         let email = req.body.email.toLowerCase();
        //         let hashPass = crypto.MD5(req.body.password);
        //         console.log(req.body);                
        //         User.findOne({email}, async (err, existingUser) => {
        //             console.log("Raw inputted password: " + req.body.password);
        //             console.log("inputted password: " + hashPass)
        //             console.log(existingUser);
        //             // Successful Login
        //             if (existingUser != null) {
        //                 if (existingUser.password == hashPass) {
        //                     console.log("Login Success")
        //                     req.session.email = email;                            
        //                     req.session._id = existingUser._id;
        //                     req.session.isAdmin = existingUser.isAdmin;
        //                     req.session.isSeller = existingUser.isSeller;
        //                     console.log(req.session._id);
        //                     return res.redirect("/");
        //                 }
        //                 else {
        //                     return res.render(path.join(__dirname, "../../Client/ejs/pages/login"), {loginError: true});
        //                 }
                        
        //             }
        //             // Failed Login
        //             else {
        //                 return res.render(path.join(__dirname, "../../Client/ejs/pages/login"), {loginError: true});
        //             }
        //         });
        //     }
        //     catch (e) {
        //         console.log(e);
        //     }
        //     finally {
        //         connection.close;
        //     }
        // });
    });

module.exports = router;