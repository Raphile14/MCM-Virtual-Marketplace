// Requirements
const express = require("express");
const path = require('path');
const connectDB = require("./Database/Connection.js");
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');

// JS Routes
const login = require("./Routes/Login.js");
const signup = require("./Routes/Signup.js");
const product = require("./Routes/Product.js");
const profile = require("./Routes/Profile.js")
const ticket = require("./Routes/Ticket.js")
const seller = require("./Routes/Seller.js")
const confirmation = require("./Routes/Confirmation.js")
// const review = require("./Routes/Review.js");    REMOVED

// Connect to MongoDB
connectDB();

// Setting up Express
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({extended: false}));
app.use(express.static(__dirname + '../Client'));
app.use(session({
    secret: 'viva-mcm',
    resave: false,
    saveUninitialized: false
}));
app.use("/login", login);
app.use("/signup", signup);
app.use("/product", product);
app.use("/profile", profile);
app.use("/ticket", ticket);
app.use("/seller", seller);
app.use("/confirmation", confirmation);
// app.use("/review", review);  REMOVED

// Routings
app.get("/", (req, res) => {

    // Session Container
    if (!req.session.email) {
        console.log("no email in session");
        // return res.redirect(path.join(__dirname, '../Client/ejs/pages', 'login.ejs'), {loginError: false});
        return res.redirect('/login');
    }
    
    return res.render(path.join(__dirname, '../Client/ejs/pages', 'index.ejs'));
    // res.send('hello world')
});

app.listen(process.env.PORT, () => {
    console.log("Server is listening on " + process.env.PORT);
});