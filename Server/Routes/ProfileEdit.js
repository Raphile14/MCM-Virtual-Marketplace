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
            user = existingUser;
            if (existingUser == null || err || (!existingUser.isRecovering && req.session.email == null)) {
                return res.redirect("/page_not_found");
            }
            else if (existingUser.isRecovering){
                return renderSignup(res, null, user, true, true);
            }
            else {                
                return renderSignup(res, null, user, true, false);
            }
        });         
    })
    .post( async (req, res) => {
        let email = req.body.email.toLowerCase();
        let user = req.body; 
        if (req.body.password != req.body.confirmPassword) {
            return renderSignup(res, "Passwords are not the same!", user, true, req.session.email == null);
        }
        user.password = crypto.MD5(req.body.password);        
        user.isRecovering = false;
        if (req.session.email == null || req.session._id == null){
            user.email = email;
            User.findOne({email}, async (err, existingUser) => {
                console.log(existingUser.code == req.body.code);
                console.log(req.body.code);
                if (existingUser.code == req.body.code){      
                    user.code = null;              
                    User.updateOne({email}, { $set: user }, async (err, existingUser) => {
                        if (err) throw err;
                        console.log("1 document updated");
                        return res.redirect("/");
                    });
                }
                else {
                    return renderSignup(res, "Incorrect Confirmation Code!", user, true, true);
                    // return res.render(path.join(__dirname, '../../Client/ejs/pages', 'signup.ejs'), {errorMessage: "Incorrect Confirmation Code!", user, edit: false, isRecovering: true});
                }
            });
        } else {
            email = req.session.email;
            user.email = email;
            User.updateOne({email}, { $set: user }, async (err, existingUser) => {
                if (err) throw err;
                console.log("1 document updated");                
            });
            return res.redirect("/");
        }        
    });

function renderSignup(res, errorMessage, user, edit, isRecovering) {
    return res.render(path.join(__dirname, '../../Client/ejs/pages', 'signup.ejs'), {errorMessage, user, edit, isRecovering});
}

module.exports = router;