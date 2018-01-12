require('dotenv').config();
var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models');
var isLoggedIn = require('../middleware/isLoggedIn');
var router = express.Router();
var request = require("request");
//stored when user is logged in
var userData = null;
//setting custom view instead of ejs layout
var profileView = 'profile/profileLayout.ejs';
//ethplorer api
let ethplorer = {
	baseUrl: "https://api.ethplorer.io/",
	key: "?apiKey="+process.env.ethplorerKey,
    getWallet: function(address) {
    	return new Promise(function(resolve, reject) {
    		request.get(ethplorer.baseUrl + "getAddressInfo/" + address + ethplorer.key, function(error, response, body) {
    			resolve(body);
    		});
      	});
   	}
}
    //get routes for pages.
router.get('/dash', isLoggedIn, function(req, res) {
    userData = res.locals.currentUser.dataValues;
    delete userData.password;
    res.render('profile/dash', {
        layout: profileView,
        user: userData
    });
});
router.get("/settings", isLoggedIn, function(req, res) {
    res.render('profile/settings', {
        layout: profileView,
        user: userData
    });
})

//settings posts
router.post("/settings/wallet", isLoggedIn, function(req, res) {
    //pulling params from body
    let type = req.body.type.toLowerCase();
    let address = req.body.wallet;

    switch (type) {
        case "token":
        case "ethereum":
            //handle request to ethereum based walllet
            let walletRequest = ethplorer.getWallet(address);
            //runs at end of promist (when request is done)
            walletRequest.then(function(walletData) {
                    res.send(walletData);
            })
             // res.redirect("/settings");
            break;
        case "bitcoin":
            //handle request to bitcoin based wallet
            res.send(type);
            // res.redirect("/settings");
            break;
        default:
            res.send("ERROR INVALID WALLET TYPE");
            break;
    }
});
module.exports = router;