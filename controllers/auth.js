var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models');
var router = express.Router();

router.get('/signup', function(req, res){
  res.render('auth/signup');
});
router.get('/login', function(req, res){
  res.render('auth/login');
});
router.get("/recovery",function(req,res){
	res.render("auth/recovery");
})
router.post('/login', function(req,res){
  // res.send("post login route reached");
	res.redirect("/profile/home")
});

router.post('/signup', function(req,res){
  // res.send("post signup route reached");
  res.redirect("/profile/home")
});

router.get('/logout', function(req, res){
  res.send("router get logout route works");
});

module.exports = router;
