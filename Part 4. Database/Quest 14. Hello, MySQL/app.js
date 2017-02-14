var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser');
	session = require('express-session'),
	routes = require('./routes/index.js'),
	users = require('./routes/users.js'),
	app = express();


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
		key : 'sid',
		secret : 'secret_key',
		resave : false,
		saveUninitialized: false,
		cookie : {
			maxAge : 1000 * 60 * 60
		}
}));

app.use('/',routes);
app.use('/users',users);

module.exports = app;
