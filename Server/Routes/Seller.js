"use strict";
const express = require("express");
const connection = require("../Database/Connection.js");
const path = require('path');
const Product = require("../Database/Product");
let router = express.Router();

router.use(function(req, res, next) {
    next();
})

// Product Routes
router
    .route("/:choice")
    .get((req, res) => {
        let confirmed = false;
        if (req.params.choice == "false" || req.params.choice == "true") {
            confirmed = eval(req.params.choice);
            console.log(confirmed);
            
            Product.find({confirmed}, async (err, existingUser) => {

                // Successful Login
                if (existingUser != null) {
                    console.log(existingUser);
                }
                // Failed Login
                else {
                    console.log("Failed Login")
                }
            });
        }
        else if (req.params.choice == "all") {
            Product.find(async (err, existingUser) => {

                // Successful Login
                if (existingUser != null) {
                    console.log(existingUser);
                }
                // Failed Login
                else {
                    console.log("Failed Login")
                }
            });
        }
        else {
            console.log("invalid query")
        }
        
        res.render(path.join(__dirname, '../../Client/ejs/pages', 'seller.ejs'));
        // TODO: Need Admin Seller page
    })
    .post( async (req, res) => {
        await connection().then( async () => {
            try {
                const {userID, comment, rating, productID} = req.body;
                let review = {};
                review.userID = userID;
                review.comment = comment;
                review.rating = rating;
                review.productID = productID;

                let reviewModel = new Review(review);

                await reviewModel.save();
                res.json(reviewModel);
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