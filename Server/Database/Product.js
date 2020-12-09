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

const productSchema = new mongoose.Schema({
    userID: requestRequired,
    productName: requestRequired,
    quantity: requestRequired,
    price: requestRequired,
    description: requestRequired,
    category: requestRequired,
    confirmed: requestBoolean
});

module.exports = Review = mongoose.model('tbl_products', productSchema);
