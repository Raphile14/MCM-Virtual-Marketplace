const mongoose = require('mongoose');

const requestRequired = {
    type: String,
    required: true
}

const requestNotRequired = {
    type: String,
    required: false
}

const requestBoolean = {
    type: Boolean,
    required: true
}

const ticketSchema = new mongoose.Schema({
    sellerID: requestRequired,
    sellerEmail: requestRequired,
    buyerID: requestRequired,
    buyerEmail: requestRequired,
    quantity: requestRequired,
    productID: requestRequired,
    productName: requestRequired,
    price: requestRequired,
    totalPrice: requestRequired,
    description: requestRequired,
    category: requestRequired,
    paymentMethod: requestNotRequired,
    date: requestRequired,
    isConfirmed: false,
    isSold: requestBoolean
});

module.exports = Review = mongoose.model('tbl_tickets', ticketSchema);
