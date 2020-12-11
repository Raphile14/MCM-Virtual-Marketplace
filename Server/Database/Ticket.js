const mongoose = require('mongoose');

const requestRequired = {
    type: String,
    required: true
}

const requestBoolean = {
    type: Boolean,
    required: true
}

const ticketSchema = new mongoose.Schema({
    sellerID: requestRequired,
    buyerEmail: requestRequired,
    quantity: requestRequired,
    productID: requestRequired,
    productName: requestRequired,
    price: requestRequired,
    description: requestRequired,
    category: requestRequired
});

module.exports = Review = mongoose.model('tbl_tickets', ticketSchema);
