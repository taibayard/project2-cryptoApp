var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models');
var isLoggedIn = require('../middleware/isLoggedIn');
var router = express.Router();
//setting custom view instead of ejs layout
var userData = null;
var profileView = 'profile/profileLayout.ejs';


router.get('/dash', isLoggedIn, function(req, res) {
    userData = res.locals.currentUser.dataValues;
    delete userData.password;
	res.render('profile/dash', {layout: profileView,user:userData});
});
router.get("/settings", isLoggedIn, function(res,res){
	res.render('profile/settings', {layout: profileView,user:userData});
})
module.exports = router;