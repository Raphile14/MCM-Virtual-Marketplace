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
        res.render(path.join(__dirname, '../../Client/ejs/pages', 'product.ejs'));
    })
    .post( async (req, res) => {
        await connection().then( async () => {
            try {
                const {userID, productName, quantity, price, description, category} = req.body;
                let product = {};
                product.userID = userID;
                product.productName = productName;
                product.quantity = quantity;
                product.price = price;
                product.description = description;
                product.category = category;

                let productModel = new Product(product);

                await productModel.save();
                res.json(productModel);
            }
            catch (e) {
                console.log(e);
            }
            finally {
                connection.close;
            }
        } )
    });

module.exports = router;