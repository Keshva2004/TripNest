const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user.js");
const {redirectUrl} = require("../middleware.js");

const userController = require("../controller/user.js");


router.route("/signup")
.get(userController.renderSignup)
.post(userController.signup);


router.route("/login")
.get(userController.renderLogin)
.post(
   redirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),userController.login);


router.get("/logout" , userController.logout);


module.exports = router; 