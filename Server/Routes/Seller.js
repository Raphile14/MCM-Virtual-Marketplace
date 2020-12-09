"use strict";
const express = require("express");
const connection = require("../Database/Connection.js");
const path = require('path');
const Seller = require("../Database/Product");
let router = express.Router();

router.use(function(req, res, next) {
    next();
})

// Product Routes
router
    .route("/")
    .get((req, res) => {
        let products = Seller.find({confirmed: false});
        console.log(products);
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