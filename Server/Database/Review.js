const mongoose = require('mongoose');

const requestRequired = {
    type: String,
    required: true
}

const requestRequiredInt = {
    type: Int8Array,
    required: true
}

const requestNotRequired = {
    type: String,
    required: false
}

const reviewSchema = new mongoose.Schema({
    userID: requestRequired,
    productID: requestRequired,
    comment: requestRequired,
    rating: requestRequiredInt
});

module.exports = Review = mongoose.model('tbl_reviews', reviewSchema);
