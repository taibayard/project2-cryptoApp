var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models');
var router = express.Router();

// create user template ?
// db.user.create({
//         username: "BobisUsername",
//         password: "bob123supersecretpass",
//         email: "bob@test.com",
//         phone: "555-555-5555",
//         firstname: "Bob",
//         lastname: "Ross",
//         dob: "9/11/1990",
//         bio: "I AM BOB",
//         currencies: "{kin:{owned:210000},bitcoin:{owned:.3049},ethereum:{owned:2.3902}}"
//     }).then(function(ceatedItem) {
//         res.render('auth/signup');
//     }).catch(function(err) {
//         res.send("error");
//     });
    
router.get('/signup', function(req, res) {
   res.render("auth/signup")
});
router.get('/login', function(req, res) {
    res.render('auth/login');
});
router.get("/recovery", function(req, res) {
    res.render("auth/recovery");
})
router.post('/login', function(req, res) {
    // res.send("post login route reached");
    res.redirect("/profile/dash")
});

router.post('/signup', function(req, res) {
    // res.send("post signup route reached");
    res.redirect("/profile/dash")
});

router.get('/logout', function(req, res) {
    res.send("router get logout route works");
});

module.exports = router;