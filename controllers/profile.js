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
    key: "?apiKey=" + process.env.ethplorerKey,
    getWallet: function(address) {
        return new Promise(function(resolve, reject) {
            request.get(ethplorer.baseUrl + "getAddressInfo/" + address + ethplorer.key, function(error, response, body) {
                let parsedBody = JSON.parse(body);
                try{
                	console.log(parsedBody.tokens.length);
                	 resolve(parsedBody);
                }catch(err){
                	resolve(error);
                }
            })
        });
    }
}

function convertBalance(bal, dec) {
    //test code
    bal = bal.toString();
    if (bal.indexOf("e") != -1) {
        // handles numbers like 3.3e+37 or 2e+28
        bal = bal.replace(".", "");
        let eOffset = bal.substring(bal.indexOf("+") + 1, bal.length);
        bal = bal.substring(0, bal.indexOf("e"));
        eOffset = parseInt(eOffset) - 1;// -1 otherwise it will add one to many zeros 
        while (eOffset > 0) {
            bal += "0";
            eOffset--;
        }
        bal.replace(".", "");
    }
    let offset = bal.length - dec;
    if (offset > 0) {
        // coin balance is greater than 0 with a decimal 
        let temp = bal.split("");
        temp.splice(offset,0,".");
        bal = temp.join("");
        console.log(temp);
    } else {
        //coin balance is less than 0 so it is a decimal
        offset *= -1;
        while (offset > 0) {
            bal = "0" + bal;
            offset--;
        }
        bal = "0." + bal;
    }
    return parseFloat(bal);
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
                for(let i =0;i<walletData.tokens.length;i++){
                	walletData.tokens[i].balance = convertBalance(walletData.tokens[i].balance,walletData.tokens[i].tokenInfo.decimals)
                }
                return walletData;
            }).then(function(result){
            	res.send(result);
            })
            walletRequest.catch(function(err) {
                    res.send(err);
            });
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