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
        Product.findOne({_id: req.params.productID}, async (err, product) => {
            let data = product;
            return res.render(path.join(__dirname, '../../Client/ejs/pages', 'view_product.ejs'), {
                productError: true,
                isFull: false,
                data,
                _id: req.session._id,
                email: req.session.email,
                isAdmin: req.session.isAdmin,
                isSeller: req.session.isSeller
            });
        });
    })
    .post( async (req, res) => {
        // let productID = req.params.productID;

        // Update Database
        // const {productName, quantity, price, description, category, imagePath1, imagePath2, imagePath3, imagePath4, imagePath5, imagePath6} = req.body;
        // { $set: {name: "Mickey", address: "Canyon 123" } }
        // Product.updateOne({_id: productID}, { $set: req.body }, async (err, existingUser) => {
        //     if (err) throw err;
        //     console.log("1 document updated");
        // });

        // // Save Database
        // await connection().then( async () => {
        //     try {
        //         let product = req.body;
        //         product.userID = userID;
        //         // Product Counter
        //         User.findOne({email}, async (err, existingUser) => {
        //             if (existingUser != null) {
        //                 product.productCounter = existingUser.productCounter;
        //                 User.updateOne({email}, { $set: {name: "Mickey", address: "Canyon 123" } }, async (err, existingUser) => {
        //                     if (existingUser != null) {
        //                         product.productCounter = existingUser.productCounter;
        //                         // existingUser.productCounter = (product.productCounter + 1).toString();
        //                         let productModel = new Product(product);
        //                         console.log(req.body);
        //                         await productModel.save();
                                
        //                     }
        //                     else {
        //                         console.log("No user found!");
        //                     }
        //                 });
        //                 let productModel = new Product(product);
        //                 console.log(req.body);
        //                 await productModel.save();
                        
        //             }
        //             else {
        //                 console.log("No user found!");
        //             }
        //         });
        //     }
        //     catch (e) {
        //         res.render(path.join(__dirname, '../../Client/ejs/pages', 'product.ejs'), {
        //             productError: true, 
        //             data,
        //             email: req.session.email, 
        //             _id: req.params.id,
        //             isAdmin: req.session.isAdmin,
        //             isSeller: req.session.isSeller
        //         });
        //         console.log(e);
        //     }
        //     finally {
        //         connection.close;
        //     }
        // } )
        // res.redirect("/");
    });

module.exports = router;