require('dotenv').config();
var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');
//middleware
var isLoggedIn = require('../middleware/isLoggedIn');
let carrier = null;
var router = express.Router();
var request = require("request");
// 1800000 = 30minutes
var coindataUpdateTimer = (1800000) / 2; //handles when to update the coindata table with the coinmarket api (in milliseconds);
//stored when user is logged in
var userData = null;
//setting custom view instead of ejs layout
var profileView = 'profile/profileLayout.ejs';
//holds data containing the verification code
var verificationCode = "0000";
var generateCode = function () {
    let first = (Math.floor((Math.random() * 9) + 1)).toString();
    let second = (Math.floor((Math.random() * 9) + 1)).toString();
    let third = (Math.floor((Math.random() * 9) + 1)).toString();
    let fourth = (Math.floor((Math.random() * 9) + 1)).toString();
    let code = first + second + third + fourth;

    return code;
}
//ethplorer api
let ethplorer = {
    baseUrl: "https://api.ethplorer.io/",
    key: "?apiKey=" + process.env.ethplorerKey,
    getWallet: function (address) {
        return new Promise(function (resolve, reject) {
            request.get(ethplorer.baseUrl + "getAddressInfo/" + address + ethplorer.key, function (error, response, body) {
                let parsedBody = JSON.parse(body);
                if (parsedBody.ETH && (parsedBody.ETH.balance >= 0 || parsedBody.tokens)) {
                    resolve(parsedBody);
                } else {
                    reject(error);
                }
            })
        });
    },
    convertBalance: function (bal, dec) {
        bal = bal.toString();
        if (bal.indexOf("e") != -1) {
            // handles numbers like 3.3e+37 or 2e+28
            bal = bal.replace(".", "");//removes decimal from start. (ex. 3.3e+37 becomes 33e+37)
            let eOffset = bal.substring(bal.indexOf("+") + 1, bal.length);
            bal = bal.substring(0, bal.indexOf("e"));
            eOffset = parseInt(eOffset);
            let decimalLocation = (eOffset - dec) + 1; //where to put the new decimal
            bal = bal.split("");
            bal.splice(decimalLocation,0,".");
            bal = bal.join("");
        }else{
            let offset = bal.length - dec;
            if (offset > 0) {
              // coin balance is greater than 0 with a decimal 
              let temp = bal.split("");
              temp.splice(offset, 0, ".");
              bal = temp.join("");
            } else {
              //coin balance is less than 0 so it is a decimal
              offset *= -1;
              while (offset > 0) {
                  bal = "0" + bal;
                  offset--;
              }
              bal = "0." + bal;
            }
        }
        return parseFloat(bal);
    }
}
var coinmarket = {
    baseUrl: "https://api.coinmarketcap.com/v1/ticker/?start=0&limit=1001",
    getCoins: function () {
        return new Promise(function (resolve, reject) {
            request.get(coinmarket.baseUrl, function (error, response, body) {
                let parsedBody = JSON.parse(body);
                if (parsedBody) {
                    resolve(parsedBody);
                } else {
                    resolve(error);
                }
            })
        });
    }
}

function sendMessage(address, code) {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });

    var mailOptions = {
        from: "test@test.com",
        to: address,
        text: 'Your cryptoapp verification code is : ' + code
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function updateCoinValues() {
    /*Updates all users coins with most recent data from Coindata table*/
    db.coin.findAll().then(function (coins) {
        //setting all coins values to data from coindata
        coins.forEach(function (coin) {
            let c = coin;
            db.coindata.findOne({
                where: {
                    symbol: coin.name
                }
            }).then(function (matchedCoinData) {
                console.log("found match in the database");
                //found match in database
                c.updateAttributes({
                    value: matchedCoinData.value
                })
            }).catch(function (err) {
                console.log("Coin was not in database");
            });
        });
    })
}

function initCoinData() {
    /*Will get data from coinmarketcap and create it in db. This is used when there is no coindata in db */
    //Getting new Coin Data from API
    let coinmarketData = coinmarket.getCoins();
    coinmarketData.then(function (response) {
        /*Successfully Called coinmarketcap API*/
        response.forEach(function (coin) {
            /*Creating Coins in coindata table based on data from API response*/
            db.coindata.create({
                name: coin.name,
                symbol: coin.symbol,
                value: coin.price_usd
            });
        })
    }).then(function (result) {
        /*coindata table is no longer empty and API call was success*/
        //update all users coin data with new values from API
        updateCoinValues();
    }).catch(function (err) {
        console.log("error in promise: Error fetching data from coinmarketcap api");
    });
}

function updateCoinData() {
    /*Updates coindata table with data from coinmarketcap API*/
    let coinmarketData = coinmarket.getCoins();
    coinmarketData.then(function (response) {
        response.forEach(function (coin) {
            db.coindata.findOne({
                where: {
                    symbol: coin.symbol
                }
            }).then(function (cdItem) {
                cdItem.updateAttributes({
                    value: coin.price_usd
                });
            });
        });
        //Updating all users coin values now that there are new values from the API
        updateCoinValues();
    }).catch(function (err) {
        console.log("error getting coin data from API");
    });
}

/*GET ROUTES*/

//gets users dashboard
router.get('/dash', isLoggedIn, function (req, res) {
    //Getting User
    userData = res.locals.currentUser.dataValues;
    //Deleting users password from locals
    delete userData.password;
    //Finding User's -> Wallets in Databse
    db.wallet.findAll({
        where: {
            userId: userData.id
        }
    }).then(function (wallets) {
        if (wallets.length > 0) {
            /*User has a Wallet saved*/
            //Checking for data in coinsdata (table that holds updated coin values)
            db.coindata.findAll().then(function (coinsdata) {
                if (coinsdata.length < 1) { // Handles no data in coindata db
                    /*coindata is empty (no data in db)*/

                    initCoinData(); //Creating first instance of coins in coindata db

                } else { //Handles existing data in coindata db
                    /*Coindata table is NOT empty (it contains some coin values )*/

                    //Check to see if BTC ( used as an validator ) exists.
                    db.coindata.findOne({
                        where: {
                            symbol: "BTC"
                        }
                    }).then(function (item) {
                        /*FOUND BTC IN coindata table*/
                        //Checking to see if data needs to be updated based on updateTimer and last updated
                        //getting dates to be compared
                        var dateCreated = new Date(item.updatedAt);
                        var ms = dateCreated.getTime(); //milliseconds
                        var now = new Date();
                        var currentMs = now.getTime(); //current milliseconds
                        //difference between current time and date created
                        var updateTimer = currentMs - ms;
                        if (updateTimer >= coindataUpdateTimer) {
                            //time to update coindata table. 
                            //after that all of the existing coins stored in wallets will be updated with the most recent values.
                            updateCoinData();
                        } else {
                            //not time to update data. Logging when next update will be pulled
                            console.log("Coindata will be updated in :", coindataUpdateTimer - updateTimer, " milliseconds");
                        }
                    }).catch(function (err) {
                        console.log("error pulling data from coindata db");
                    });
                    console.log("coindata already in database");
                }
            }).then(function (result) {
                /*Done updating / fetching coindata. time to render user's page*/
                //finding users wallet(s)
                db.wallet.findAll({
                    where: {
                        userId: userData.id
                    }
                }).then(function (wallet) {
                    /*Found wallet(s)*/
                    /*Going to handle just ONE wallet for now.*/
                    //Finding all coins in the first wallet the user has saved.
                    db.coin.findAll({
                        where: {
                            walletId: wallet[0].dataValues.id
                        }
                    }).then(function (coins) {
                        /*Found coins in wallet 0 */
                        //Rendering the user's dash
                        res.render('profile/dash', {
                            layout: profileView,
                            user: userData,
                            coins: coins
                        });
                    })
                }).catch(function (err) {
                    res.send("Error loading dash");
                })
            }).catch(function (err) {
                res.send("Error getting coin data from database");
            })
        } else {
            /* The User has no saved wallets in the database */
            //Rendering User's dash with no coins
            res.render('profile/dash', {
                layout: profileView,
                user: userData,
                coins: []
            });
        }
    }).catch(function (err) {
        console.log("error checking if user wallet exists");
    });
});
//gets users settings data
router.get("/settings", isLoggedIn, function (req, res) {
    userData = res.locals.currentUser.dataValues;
    //Getting Wallets & Coins associated with user
    db.wallet.findAll({
        where: {
            userId: userData.id
        },
        include: [{
            model: db.coin
        }]
    }).then(function (wallets) {
        res.render('profile/settings/main', {
            layout: profileView,
            user: userData,
            wallet: wallets,
            code: verificationCode
        })
    }).catch(function (err) {
        res.send(err);
    })
})

//creates wallet in db
router.post("/settings/wallet", isLoggedIn, function (req, res) {
    //pulling params from body
    let type = req.body.type.toLowerCase();
    let address = req.body.wallet;
    //checking type of coin then making api request
    switch (type) {
        case "token":
        case "ethereum":
            type = "ethereum/token";
            //handle request to ethereum based walllet
            let walletRequest = ethplorer.getWallet(address);
            walletRequest.then(function (walletData) {
                /* Sucessfully Called ethplorer API */
                if (!walletData.tokens) {
                    if (walletData.ETH.balance > 0) {
                        //do something with ether coins
                    } else {
                        //no coins in wallet
                        res.send("No coins in wallet");
                    }
                }
                //Converting all token values from API response
                for (let i = 0; i < walletData.tokens.length; i++) {
                    walletData.tokens[i].balance = ethplorer.convertBalance(walletData.tokens[i].balance, walletData.tokens[i].tokenInfo.decimals);
                }
                return walletData;
            }).then(function (result) {
                /* API response values were converted*/
                //time to create wallet and add coins
                db.wallet.findOrCreate({
                    where: {
                        address: address.toLowerCase(),
                        userId: userData.id
                    },
                    defaults: {
                        type: type
                    }
                }).spread(function (wallet, wasCreated) {
                    if (wasCreated) {
                        /*
                            Was no duplicate wallet.
                            Time to ADD coins to database
                        */
                        //add ETH to db if balance > 0 
                        if (result.ETH.balance > 0) {
                            db.coindata.findOne({
                                where: {
                                    symbol: "ETH"
                                }
                            }).then(function (storedCoin) {
                                db.coin.create({
                                    walletId: wallet.id,
                                    name: "ETH",
                                    owned: result.ETH.balance,
                                    value: storedCoin.value
                                });
                            })
                        }
                        //add tokens to db
                        result.tokens.forEach(function (coin) {
                            //api handles erc20 token symbol differently than coinmarketcap.
                            if (coin.tokenInfo.symbol === "ERC") {
                                db.coindata.findOne({
                                    where: {
                                        symbol: coin.tokenInfo.name
                                    }
                                }).then(function (storedCoin) {
                                    db.coin.create({
                                        walletId: wallet.id,
                                        name: storedCoin.symbol,
                                        owned: coin.balance,
                                        value: storedCoin.value
                                    });
                                })
                            } else {
                                db.coindata.findOne({
                                    where: {
                                        symbol: coin.tokenInfo.symbol
                                    }
                                }).then(function (storedCoin) {
                                    db.coin.create({
                                        walletId: wallet.id,
                                        name: storedCoin.symbol,
                                        owned: coin.balance,
                                        value: storedCoin.value
                                    });
                                })
                            }
                        });
                    } else {
                        //Contains duplicate wallet address ( fail )
                        res.send("wallet already exists in db")
                    }
                }).catch(function (err) {
                    res.send("Error adding wallet");
                });
                //going back to settings
                res.redirect("/profile/dash");
            }).catch(function (err) {
                res.send("Error getting wallet");
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
//post for adding a phone (notifications)
router.post("/settings/sendcode/:carrier", function (req, res) {
    carrier = req.params.carrier;
    let emailAddress = userData.phone + "@" + carrier;
    verificationCode = generateCode();
    sendMessage(emailAddress, verificationCode);
    res.send();
});
//post for verifying code (notifications)
router.post("/settings/verifycode/:code", function (req, res) {
    if (req.params.code === verificationCode) {
        //set phone is verified to true in database
        //sending confirmation message for now to verify everything works
        sendMessage(userData.phone + "@" + carrier, "CODE ENTERED WAS CORRECT");
        db.user.findOne({
            where: {
                id: userData.id
            }
        }).then(function (user) {
            user.updateAttributes({
                carrier: carrier,
                phoneverified: "true"
            })
        }).catch(function (err) {
            console.log("error matching user in verify code");
        })
    } else {
        //handle invalid code entry
        sendMessage(userData.phone + "@" + carrier, "CODE ENTERED WAS INCORRECT");
    }
    res.send();
});
//post for adding the alert (notifications)
router.post("/settings/addalert/:max&:min&:name", function (req, res) {
    let result = req.params.min + " , " + req.params.max + " , " + req.params.name;
    res.send(result);
});
/*DELETE ROUTES*/

//deletes wallet from database
router.delete("/settings/:address", function (req, res) {
    //finding users wallet
    db.wallet.findOne({
        where: {
            address: req.params.address,
            userId: userData.id
        }
    }).then(function (wallet) {
        //found wallet
        db.coin.destroy({
            where: {
                walletId: wallet.id
            }
        }).then(function (result) {
            //deleted coins
            db.wallet.destroy({
                where: {
                    address: req.params.address,
                    userId: userData.id
                }
            }).then(function (deleted) {
                //deleted wallet
                res.send("success");
            });
        });
    }).catch(function (err) {
        console.log("was error finding wallet in db");
        res.send("was error finding wallet in db");
    });
});
/*PUT ROUTES*/
router.put("/settings/changepass/:newpass&:currentpass", function (req, res) {
    let newpass = req.params.newpass;
    let currentpass = req.params.currentpass;
    if(newpass.length>8){
        db.user.findOne({
            where:{
                id:userData.id
            }
        }).then((_user_)=>{
            if(bcrypt.compareSync(currentpass, _user_.password)){
                _user_.updateAttributes({
                    password:bcrypt.hashSync(newpass, 10)
                });
                res.status(200);
                res.send("Success");
            }else{
                res.status(400);
                res.send("Invalid password");
            }
        }).catch((err)=>{
            console.log("password change error : error finding user in database.")
        })
    }else{
        res.status(400);
        res.send("Password must be longer than 8 characters.");
    }
});

//updating users password
module.exports = router;