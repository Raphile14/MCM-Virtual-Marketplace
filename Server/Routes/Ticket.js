"use strict";
const express = require("express");
const connection = require("../Database/Connection.js");
const path = require('path');
const Ticket = require("../Database/Ticket.js");
let router = express.Router();

router.use(function(req, res, next) {
    // console.log(req.url, "@", Date.now());
    next();
})

// Ticket Routes
router
    .route("/")
    .get((req, res) => {})
    .post( async (req, res) => {
        await connection().then( async () => {
            try {
                let ticket = req.body;
                let ticketModel = new Ticket(ticket);

                await ticketModel.save();
                // res.json(ticketModel);
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