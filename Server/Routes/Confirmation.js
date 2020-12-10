"use strict";
const express = require("express");
const User = require("../Database/User");
const path = require('path');
let router = express.Router();

router.use(function(req, res, next) {
    // console.log(req.url, "@", Date.now());
    next();
})

// COnfirmation Routes
router
    .route("/:id")
    .get((req, res) => {
        User.findById(req.params.id, (err, existingUser) => {
            console.log(existingUser);            
            if (err) {
                console.log(err);
                // res.send(err);     
            }
            if (existingUser != null) {
                User.findByIdAndUpdate({_id: req.params.id}, {confirmed: true}, (err, result) => {
                    res.redirect("/");
                })                
            }
            else {
                console.log("Confirmation Link Does Not Exist");
                res.send("Confirmation Link Does Not Exist");
            }
        });        
    })
    .post((req, res) => {});

module.exports = router;