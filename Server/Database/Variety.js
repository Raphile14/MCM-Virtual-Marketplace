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

const varietySchema = new mongoose.Schema({
    productID: requestRequired,
    variety: requestRequired,
    quantity: requestRequired,
    availability: requestBoolean,
    price: requestRequired,
    description: requestRequired,

    // imagePath2: requestNotRequired,
    // imagePath3: requestNotRequired,
    // imagePath4: requestNotRequired,
    // imagePath5: requestNotRequired,
});

module.exports = Variety = mongoose.model('tbl_varieties', varietySchema);
