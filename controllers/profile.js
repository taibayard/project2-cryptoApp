var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models');
var isLoggedIn = require('../middleware/isLoggedIn');
var router = express.Router();
var profileView = { layout: 'profile/profileLayout.ejs' }

// router.get('/dash',isLoggedIn, function(req, res){
//   res.render('profile/dash');
// });
router.get('/dash', function(req, res){
  res.render('profile/dash',profileView);//rendering custom view instead of layout.ejs
});

module.exports = router;