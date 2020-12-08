"use strict";
const express = require("express");
const path = require('path');
let router = express.Router();

router.use(function(req, res, next) {
    // console.log(req.url, "@", Date.now());
    next();
})

// Profile Routes
router
    .route("/")
    .get((req, res) => {
        res.render(path.join(__dirname, '../../Client/ejs/pages', 'profile.ejs'));
    })
    .post((req, res) => {});

module.exports = router;