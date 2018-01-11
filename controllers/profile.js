var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models');
var isLoggedIn = require('../middleware/isLoggedIn');
var router = express.Router();
//setting custom view instead of ejs layout
var userData = null;
var profileView = 'profile/profileLayout.ejs';


var tempUser = {
	username:"BobisCool1231",
	password:"t3902kdfjls039032",
	email:"bobtest@test.com",
	phone:"555-555-5555",
	firstname:"Bob",
	lastname:"Ross"
}

router.get('/dash', isLoggedIn, function(req, res) {
    // userData = res.locals.currentUser.dataValues;
    // delete userData.password;
	// res.render('profile/dash', {layout: profileView,user:userData});
	res.render('profile/dash', {layout: profileView,user:tempUser});
});
router.get("/settings", isLoggedIn, function(res,res){
	// res.render('profile/settings', {layout: profileView,user:userData});
	res.render('profile/settings', {layout: profileView,user:tempUser});
})
module.exports = router;