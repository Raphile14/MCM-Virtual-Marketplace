const mongoose = require('mongoose');

const requestRequired = {
    type: String,
    required: true
}

const requestRequiredFloat = {
    type: Float32Array,
    required: true
}

const requestRequiredInt = {
    type: Int16Array,
    required: true
}

const requestNotRequired = {
    type: String,
    required: false
}

const productSchema = new mongoose.Schema({
    id: requestRequired,
    userID: requestRequired,
    productName: requestRequired,
    quantity: requestRequiredInt,
    price: requestRequiredFloat,
    description: requestRequired,
    category: requestRequired
});

module.exports = Review = mongoose.model('tbl_products', productSchema);
