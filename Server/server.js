// Requirements
const express = require("express");
const path = require('path');
const connectDB = require("./Database/Connection.js");
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
// const google = require("./Classes/GoogleAPI");

// JS Routes
const login = require("./Routes/Login.js");
const signup = require("./Routes/Signup.js");
const product = require("./Routes/Product.js");
const recover = require("./Routes/Recover.js");
const profileedit = require("./Routes/ProfileEdit.js");
const profile = require("./Routes/Profile.js");
const catalog = require("./Routes/Catalog.js");
const tickets = require("./Routes/Tickets.js");
const seller = require("./Routes/Seller.js");
const faq = require("./Routes/Faq.js");
const logout = require("./Routes/Logout.js");
const info = require("./Routes/ProductInfo.js");
const admin = require("./Routes/Admin.js");
const order = require("./Routes/Order.js");
const approve = require("./Routes/Approve.js");
const permissions = require("./Routes/Permissions.js");
const confirmation = require("./Routes/Confirmation.js");
const status = require("./Routes/Status.js");
const Product = require('./Database/Product.js');

// Connect to MongoDB
connectDB();

// Setting up Express
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({extended: false}));
app.use(express.static('Client'));
app.use(session({
    secret: 'viva-mcm',
    resave: false,
    saveUninitialized: false
}));
app.use("/login", login);
app.use("/signup", signup);
app.use("/product", product);
app.use("/catalog", catalog);
app.use("/profile", profile);
app.use("/profileedit", profileedit);
app.use("/recover", recover);
app.use("/tickets", tickets);
app.use("/seller", seller);
app.use("/confirmation", confirmation);
app.use("/info", info);
app.use("/faq", faq);
app.use("/admin", admin);
app.use("/logout", logout);
app.use("/order", order);
app.use("/approve", approve);
app.use("/permissions", permissions);
app.use("/status", status);

// Routings
app.get("/", (req, res) => {

    // Session Container
    if (req.session.email == null || req.session._id == null) return res.redirect('/login');   
    Product.find({confirmed: true, userID: {$ne: req.session._id}}, async (err, existingProduct) => {
        let products = existingProduct;
        if (existingProduct == null) {
            products = [];
        }        
        return res.render(path.join(__dirname, '../Client/ejs/pages', 'index.ejs'), {
            sessionEmail: req.session.email,
            email: req.session.email, 
            _id: req.session._id,
            isAdmin: req.session.isAdmin,
            isSeller: req.session.isSeller,
            products,
            isSearched: false,
            searchedKey: "",
            placeHolder: "All Products"
        });
    });     
});

app.post("/", (req, res) => {
    Product.find({confirmed: true, userID: {$ne: req.session._id}}, (err, existingProduct) => {
        let products = [];
        let productsTemp = existingProduct;
        let searchedKey = req.body.search.toLowerCase();
        if (productsTemp != null){
            for (let i = 0; i < productsTemp.length; i++) {
                if (productsTemp[i].productName.toLowerCase().includes(searchedKey)){
                    products.push(productsTemp[i]);
                }  else if ((productsTemp[i].firstName + productsTemp[i].lastName).toLowerCase().includes(searchedKey)) {
                    products.push(productsTemp[i]);
                }
            }
        }
        return res.render(path.join(__dirname, '../Client/ejs/pages', 'index.ejs'), {
            sessionEmail: req.session.email,
            email: req.session.email, 
            _id: req.session._id,
            isAdmin: req.session.isAdmin,
            isSeller: req.session.isSeller,
            products,
            isSearched: true,
            searchedKey: req.body.search,
            placeHolder: "All Products"
        });
    });    
});

app.get("/page_not_found", (req, res) => {
    return res.render(path.join(__dirname, '../Client/ejs/pages', 'page_not_found.ejs'));
});

// app.get("*", (req, res) => {
//     return res.redirect("/page_not_found");    
// });

app.listen(process.env.PORT, () => {
    console.log("Server is listening on " + process.env.PORT);
});