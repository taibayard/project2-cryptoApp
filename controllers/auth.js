var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models');
var router = express.Router();

router.get('/signup', function(req, res) {
    res.render("auth/signup")
});
router.get('/login', function(req, res) {
    res.render('auth/login');
});
router.get("/recovery", function(req, res) {
    res.render("auth/recovery");
})
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile/dash',
  successFlash: 'Login Successful!',
  failureRedirect: '/auth/login',
  failureFlash: 'Invalid Credentials'
}));

router.post('/signup', function(req, res, next) {
    db.user.findOrCreate({
        where: {
            email: req.body.email
        },
        defaults: {
            username: req.body.username,
            phone: req.body.phone,
            password: req.body.password
        }
    }).spread(function(user, wasCreated) {
        if (wasCreated) {
            //Success
            passport.authenticate('local', {
                successRedirect: '/profile/dash',
                successFlash: 'Successfully logged in'
            })(req, res, next);
        } else {
            //Contains duplicate ( fail )
            req.flash('error', 'Email already exists');
            res.redirect('/auth/login');
        }
    }).catch(function(err) {
        req.flash('error', err.message);
        res.redirect('/auth/signup');
    });
});

module.exports = router;