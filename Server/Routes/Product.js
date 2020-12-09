"use strict";
const express = require("express");
const connection = require("../Database/Connection.js");
const path = require('path');
const Product = require("../Database/Product");
let router = express.Router();

router.use(function(req, res, next) {
    // console.log(req.url, "@", Date.now());
    next();
})

// Product Routes
router
    .route("/")
    .get((req, res) => {

        res.render(path.join(__dirname, '../../Client/ejs/pages', 'product.ejs'), {productError: false});
    })
    .post( async (req, res) => {
        let data = req.body;
        console.log(req.body);
        await connection().then( async () => {
            try {
                let productModel = new Product(req.body);
                console.log(req.body);
                await productModel.save();
                res.json(productModel);
            }
            catch (e) {
                res.render(path.join(__dirname, '../../Client/ejs/pages', 'product.ejs'), {productError: true, data});
                console.log(e);
            }
            finally {
                connection.close;
            }
        } )
    });

module.exports = router;