const mongoose = require('mongoose');

const requestRequired = {
    type: String,
    required: true
}

const requestNotRequired = {
    type: String,
    required: false
}

const userSchema = new mongoose.Schema({
    id: requestRequired,
    firstName: requestRequired,
    lastName: requestRequired,
    email: requestRequired,
    password: requestRequired
});

module.exports = User = mongoose.model('tbl_users', userSchema);
