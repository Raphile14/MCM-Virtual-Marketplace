const mongoose = require('mongoose');
const URI = "mongodb+srv://mcm_virtual_marketplace_server:" + process.env.DATABASEPASS + "@clustermcmvirtualmarket.h7k3r.mongodb.net/" + process.env.DATABASENAME + "?retryWrites=true&w=majority";

// Connect to Database
const connectDB = async () => {
    console.log("Connecting to DB");
    await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
    console.log('Connected to DB');
};

module.exports = connectDB;