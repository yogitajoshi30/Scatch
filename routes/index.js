const express = require('express')
const router = express.Router()
const isloggedin = require('../middlewares/isLoggedIn')
const productModel = require('../models/productModel')
const userModel = require("../models/userModel")

router.get('/', function (req, res) {
    let error = req.flash("error")
    res.render("index", { error, loggedin: false })
})

router.get('/shop', isloggedin, async function (req, res) {
    let products = await productModel.find()
    let success = req.flash("success")
    res.render("shop", { products, success })
})

router.get('/cart', isloggedin, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email }).populate("cart")
    let itemBills = [];

    user.cart.forEach(item => {
        const itemTotalPrice = item.price - item.discount + 20;
        itemBills.push({
            item: item,
            bill: itemTotalPrice
        });
    });
    res.render("cart", { user, itemBills });
})

router.get('/addtocart/:productid', isloggedin, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email })
    user.cart.push(req.params.productid)
    await user.save()
    req.flash("success", "Added to Cart")
    res.redirect("/shop")
})

module.exports = router