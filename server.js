var port = process.env.PORT || 5678;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var database = require('./database')();
var passport = require('passport');
var passportLocal = require('passport-local');
var session = require('express-session');
var flash = require('connect-flash');
var session = require('express-session');

require('./app/passport')(passport);


app.use( function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5678');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader( 'Access-Control-Allow-Header', 'X-Requested-With, content-type' );
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.urlencoded({extended: true}));

app.set('trust proxy', 1); 

app.use(session({
  secret: 'secretsecretsecretpaper',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}));

app.use(flash());


app.use(passport.initialize());
app.use(passport.session());  

app.set('view engine', 'ejs');

app.use('/assets', express.static(__dirname + '/assets'));

require('./app/routes')(app, passport, database);

app.listen(port, function (err){
    if(err){
        console.log('error', err);
        console.log('Server Listening on' + port);
    }
});