"use strict";
const express = require("express");
const path = require('path');
let router = express.Router();

router.use(function(req, res, next) {
    // console.log(req.url, "@", Date.now());
    next();
})

// Ticket Routes
router
    .route("/")
    .get((req, res) => {
        if (req.session.email == null || req.session._id == null) {
            return res.redirect("/login");
        }
        return res.render(path.join(__dirname, '../../Client/ejs/pages', 'faq.ejs'), {
            sessionEmail: req.session.email,
            email: req.session.email, 
            _id: req.session._id,
            isAdmin: req.session.isAdmin,
            isSeller: req.session.isSeller
        });     
    })
    .post( async (req, res) => {
        
    });


module.exports = router;