const mongoose = require('mongoose');

const requestRequired = {
    type: String,
    required: true
}

const requestNotRequired = {
    type: String,
    required: false
}

const productSchema = new mongoose.Schema({
    userID: requestRequired,
    productName: requestRequired,
    quantity: requestRequired,
    price: requestRequired,
    description: requestRequired,
    category: requestRequired
});

module.exports = Review = mongoose.model('tbl_products', productSchema);
