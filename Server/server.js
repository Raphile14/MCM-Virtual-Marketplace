const express = require("express");
const path = require('path');
const connectDB = require("./Database/Connection.js");
const app = express();

// JS Routes
const login = require("./Routes/Login.js");
const signup = require("./Routes/Signup.js");
const product = require("./Routes/Product.js");
const profile = require("./Routes/Profile.js")

// Connect to MongoDB
connectDB();

// Setting up Express
app.use(express.json({extended: false}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '../Client'));
app.use("/login", login);
app.use("/signup", signup);
app.use("/signup", signup);
app.use("/product", product);
app.use("/profile", profile);

// Routings
app.get("/", (req, res) => {
    res.render(path.join(__dirname, '../Client/ejs/pages', 'index.ejs'));
    // res.send('hello world')
});

app.listen(process.env.PORT, () => {
    console.log("Server is listening on " + process.env.PORT);
});