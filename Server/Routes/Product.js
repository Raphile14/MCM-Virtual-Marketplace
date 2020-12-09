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
    .route("/")
    .get((req, res) => {

        res.render(path.join(__dirname, '../../Client/ejs/pages', 'product.ejs'), {productError: false});
    })
    .post( async (req, res) => {
        let data = req.body;

        // Picture Validation
        let form = new formidable.IncomingForm();
        form.uploadDir = 'tmp';
        form.parse(req, function (err, fields, files) {
            let oldpath = files.filetoupload.path;
            let newpath = path.join(__dirname, '../../Client/images/products', files.filetoupload.name);
            fs.renameSync(oldpath, newpath, function (err) {
                if (err) throw err;
                console.log('File uploaded and moved!');
            });
        });

        // Save Database
        await connection().then( async () => {
            try {
                let productModel = new Product(req.body);
                console.log(req.body);
                await productModel.save();
                res.json(productModel);
                // User.find({email: req.body.email}, async (err, addedUser) => {
                //     EmailRegistration.sendEmail(user, addedUser[0]._id);
                // });  
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