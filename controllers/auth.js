var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models');
var router = express.Router();

router.get('/landing', function(req, res){
  res.render('auth/landing');
});

router.post('/login', function(req,res){
  res.send("post login route reached");
});

router.post('/signup', function(req,res){
  res.send("post signup route reached");
});

router.get('/logout', function(req, res){
  res.send("router get logout route works");
});

module.exports = router;
