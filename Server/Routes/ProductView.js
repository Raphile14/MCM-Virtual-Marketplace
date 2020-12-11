"use strict";
const express = require("express");
const formidable = require('formidable');
const fs = require('fs');
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
    .route("/:productID")
    .get((req, res) => {
        // let userID = req.session._id;
        if (req.session.email == null || req.session._id == null) {
            return res.redirect("/login");
        }
        if (req.session.isSeller){
            Product.findOne({_id: req.params.productID}, async (err, existingUser) => {
                let data = existingUser;
                if (existingUser.userID == req.session._id){
                    return res.render(path.join(__dirname, '../../Client/ejs/pages', 'product.ejs'), {
                        productError: true,
                        isFull: false,
                        data,
                        _id: req.session._id,
                        email: req.session.email,
                        isAdmin: req.session.isAdmin,
                        isSeller: req.session.isSeller
                    });
                }
                else{
                    Product.findOne({_id: req.params.productID}, async (err, product) => {
                        let data = product;
                        return res.render(path.join(__dirname, '../../Client/ejs/pages', 'view_product.ejs'), {
                            productError: false,
                            isFull: false,
                            data,
                            _id: req.session._id,
                            email: req.session.email,
                            isAdmin: req.session.isAdmin,
                            isSeller: req.session.isSeller
                        });
                    });
                }
            });
        }
        else{
            Product.findOne({_id: req.params.productID}, async (err, product) => {
                let data = product;
                return res.render(path.join(__dirname, '../../Client/ejs/pages', 'view_product.ejs'), {
                    productError: false,
                    isFull: false,
                    data,
                    _id: req.session._id,
                    email: req.session.email,
                    isAdmin: req.session.isAdmin,
                    isSeller: req.session.isSeller
                });
            });
        }
    })
    .post( async (req, res) => {
        let productID = req.params.productID;

        // Update Database
        Product.updateOne({_id: productID}, { $set: req.body }, async (err, existingUser) => {
            if (err) throw err;
            console.log("1 document updated");
        });
        res.redirect("/");
    });

module.exports = router;