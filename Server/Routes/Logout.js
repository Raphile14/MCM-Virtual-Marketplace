"use strict";
const express = require("express");
let router = express.Router();

router.use(function(req, res, next) {
    // console.log(req.url, "@", Date.now());
    next();
});

// Logout Routes
router
    .route("/")
    .get((req, res) => {
        req.session.email = null;
        res.redirect("/login");
    });

module.exports = router;