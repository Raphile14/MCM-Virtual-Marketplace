"use strict";
const express = require("express");
const formidable = require('formidable');
const fs = require('fs');
const connection = require("../Database/Connection.js");
const path = require('path');
const Product = require("../Database/Product");
const User = require("../Database/User");
let router = express.Router();

router.use(function(req, res, next) {
    // console.log(req.url, "@", Date.now());
    next();
})

// Product Routes
router
    .route("/")
    .get((req, res) => {
        let userID = "5fd1cc9353cd1a64a8991cb9";
        // let userID = req.session._id;
        if (req.session.email == null || req.session._id == null) {
            return res.redirect("/login");
        }
        let isFull = false;
        Product.find({userID}, async (err, existingUser) => {
            if (existingUser.length == 10){
                isFull = true;
            }
        });
        res.render(path.join(__dirname, '../../Client/ejs/pages', 'product.ejs'), {
            productError: false, 
            userID, 
            isFull,
            email: req.session.email, 
            _id: req.params.id,
            isAdmin: req.session.isAdmin,
            isSeller: req.session.isSeller
        });
    })
    .post( async (req, res) => {
        let data = req.body;
        let userID = "5fd1cc9353cd1a64a8991cb9";
        let email = "bjmontes@mcm.edu.ph";
        // let userID = req.session._id;

        // // Picture Validation
        // let form = new formidable.IncomingForm();
        // form.uploadDir = 'tmp';
        // form.parse(req, function (err, fields, files) {
        //     let oldpath = files.filetoupload.path;
        //     let newpath = path.join(__dirname, '../../Client/images/products', files.filetoupload.name);
        //     fs.renameSync(oldpath, newpath, function (err) {
        //         if (err) throw err;
        //         console.log('File uploaded and moved!');
        //     });
        // });

        // Save Database
        await connection().then( async () => {
            try {
                let product = req.body;
                product.userID = userID;
                // Product Counter
                User.findOne({email}, async (err, existingUser) => {
                    if (existingUser != null) {
                        product.productCounter = existingUser.productCounter;
                        User.updateOne({email}, { $set: {name: "Mickey", address: "Canyon 123" } }, async (err, existingUser) => {
                            if (existingUser != null) {
                                product.productCounter = existingUser.productCounter;
                                // existingUser.productCounter = (product.productCounter + 1).toString();
                                let productModel = new Product(product);
                                console.log(req.body);
                                await productModel.save();
                                
                            }
                            else {
                                console.log("No user found!");
                            }
                        });
                        let productModel = new Product(product);
                        console.log(req.body);
                        await productModel.save();
                        
                    }
                    else {
                        console.log("No user found!");
                    }
                });
            }
            catch (e) {
                res.render(path.join(__dirname, '../../Client/ejs/pages', 'product.ejs'), {
                    productError: true, 
                    data,
                    email: req.session.email, 
                    _id: req.params.id,
                    isAdmin: req.session.isAdmin,
                    isSeller: req.session.isSeller
                });
                console.log(e);
            }
            finally {
                connection.close;
            }
        } )
    });

module.exports = router;