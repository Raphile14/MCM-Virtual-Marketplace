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

const userSchema = new mongoose.Schema({
    firstName: requestRequired,
    lastName: requestRequired,
    email: requestRequired,
    password: requestRequired,
    phoneNumber: requestRequired,
    city: requestRequired,
    productCounter: requestRequired,
    messengerLink: requestNotRequired,
    twitter: requestNotRequired,
    linkedIn: requestNotRequired,
    instagram: requestNotRequired,
    confirmed: requestBoolean,
    isAdmin: requestBoolean,
    avatarPath: requestNotRequired
});

module.exports = User = mongoose.model('tbl_users', userSchema);
