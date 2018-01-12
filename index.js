require('dotenv').config();
var bodyParser = require('body-parser');
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var flash = require('connect-flash');
var isLoggedIn = require('./middleware/isLoggedIn');
var passport = require('./config/passportConfig');
var session = require('express-session');
var app = express();

//setting view
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.alerts = req.flash();
  next();
});
app.use(express.static(__dirname + '/public'));

app.get('/', isLoggedIn, function(req, res){
	res.redirect("/profile/dash");
});
app.get('/privacy', function(req, res){
	res.render("privacy");
});

app.use('/auth', require('./controllers/auth'));
app.use('/profile', require('./controllers/profile'));
var server = app.listen(process.env.PORT || 3000);

module.exports = server;