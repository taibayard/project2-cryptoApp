var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models');
var isLoggedIn = require('../middleware/isLoggedIn');
var router = express.Router();

// router.get('/home',isLoggedIn, function(req, res){
//   res.render('profile/home');
// });
router.get('/home', function(req, res){
  res.render('profile/home');
});

module.exports = router;