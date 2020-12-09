"use strict";
const express = require("express");
const connection = require("../Database/Connection.js");
const path = require('path');
const Review = require("../Database/Review");
let router = express.Router();

router.use(function(req, res, next) {
    // console.log(req.url, "@", Date.now());
    next();
})

// Product Routes
router
    .route("/")
    .get((req, res) => {
        res.render(path.join(__dirname, '../../Client/ejs/pages', 'review.ejs'));
        // TODO: Need product profile page
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
                review.date = Date.now()

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