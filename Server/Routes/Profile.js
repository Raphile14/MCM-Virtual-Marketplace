"use strict";
const express = require("express");
const User = require("../Database/User");
const path = require('path');
let router = express.Router();

router.use(function(req, res, next) {
    // console.log(req.url, "@", Date.now());
    next();
})

// Profile Routes
router
    .route("/:id")
    .get((req, res) => {
        User.findById(req.params.id, (err, existingUser) => {
            console.log(existingUser);
            if (err) {
                console.log(err);
                res.send(err);     
            }
            else if (existingUser == null) {
                console.log("None existing user");
                res.send("None existing user");        
            }
            else {
                res.render(path.join(__dirname, '../../Client/ejs/pages', 'profile.ejs'), {existingUser});
            }
        });        
    })
    .post((req, res) => {});

module.exports = router;