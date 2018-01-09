require('dotenv').config();
var bodyParser = require('body-parser');
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var flash = require('connect-flash');
var passport = require('./config/passportConfig');
var isLoggedIn = require('./middleware/isLoggedIn');
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

app.get('/', isLoggedIn, function(req, res){
	res.render("index");
});

// app.get('/profile', isLoggedIn, function(req, res){
//   res.render('profile');
// });

app.use('/auth', require('./controllers/auth'));
app.use('/profile', require('./controllers/profile'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
