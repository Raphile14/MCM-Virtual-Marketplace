"use strict";
const express = require("express");
const User = require("../Database/User");
const path = require('path');
const Product = require('../Database/Product.js');
let router = express.Router();

router.use(function(req, res, next) {
    // console.log(req.url, "@", Date.now());
    next();
})

// Profile Routes
router
    .route("/:category")
    .get((req, res) => {
        let dict = {
            "health&beauty": "Health and Beauty",
            "food": "Food",
            "digitalproducts": "Digital Products",
            "electronics": "Electronics"
        }
        try {
            if (req.session.email == null || req.session._id == null) return res.redirect("/login");
            Product.find({confirmed: true, category: req.params.category, userID: {$ne: req.session._id}}, async (err, existingProduct) => {
                let products = existingProduct;
                if (existingProduct == null) {
                    products = [];
                }
                for (let i = products.length - 1; i > 0; i--) {
                    let counter = Math.floor(Math.random() * (i + 1));
                    let temp = products[i];
                    products[i] = products[counter];
                    products[counter] = temp;
                }
                return res.render(path.join(__dirname, '../../Client/ejs/pages', 'index.ejs'), {
                    email: req.session.email, 
                    _id: req.session._id,
                    isAdmin: req.session.isAdmin,
                    isSeller: req.session.isSeller,
                    products,
                    isSearched: false,
                    searchedKey: req.body.search,
                    placeHolder: dict[req.params.category]
                });
            }); 
        }
        catch (e) {
            return res.redirect("/page_not_found");
        }
               
    })
    .post((req, res) => {
        let dict = {
            "health&beauty": "Health and Beauty",
            "food": "Food",
            "digitalproducts": "Digital Products",
            "electronics": "Electronics"
        }
        Product.find({confirmed: true, userID: {$ne: req.session._id}, category: req.params.category}, (err, existingProduct) => {
            let products = [];
            let productsTemp = existingProduct;
            let searchedKey = req.body.search.toLowerCase();
            if (productsTemp != null){
                for (let i = 0; i < productsTemp.length; i++) {
                    if (productsTemp[i].productName.toLowerCase().includes(searchedKey)){
                        products.push(productsTemp[i]);
                    }  else if ((productsTemp[i].firstName + productsTemp[i].lastName).toLowerCase().includes(searchedKey)) {
                        products.push(productsTemp[i]);
                    }
                }
            }
            return res.render(path.join(__dirname, '../../Client/ejs/pages', 'index.ejs'), {
                sessionEmail: req.session.email,
                email: req.session.email, 
                _id: req.session._id,
                isAdmin: req.session.isAdmin,
                isSeller: req.session.isSeller,
                products,
                isSearched: true,
                searchedKey: req.body.search,
                placeHolder: dict[req.params.category]
            });     
        });    
    });

module.exports = router;