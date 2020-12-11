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
    availability: requestBoolean,
    price: requestRequired,
    description: requestRequired,
    category: requestRequired,
    confirmed: requestBoolean,
    imagePath1: requestRequired,
    // imagePath2: requestNotRequired,
    // imagePath3: requestNotRequired,
    // imagePath4: requestNotRequired,
    // imagePath5: requestNotRequired,
    firstName: requestRequired,
    lastName: requestRequired,
    email: requestRequired
});

module.exports = Product = mongoose.model('tbl_products', productSchema);
