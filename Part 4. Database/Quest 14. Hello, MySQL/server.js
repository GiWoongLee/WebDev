var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	cookieParser = require('cookie-parser');
	session = require('express-session'),
	models = require('./models'),
	app = express();


app.use(express.static('client'));
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

/* Have to make a new DB and grant user all privileges to change info about db  */
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/is_logged_in',function(req,res){
	if(req.session && req.session.user){
		res.json({
			status : true
		});
	}
	else{
		res.json({
			status : false
		})
	}
});

app.get('/new',function(req,res){
	res.send(null);
});

app.get('/show',function(req,res){
	if(req.session && req.session.user){
		models.Note.findAll({where : {UserId : req.session.userId}})
			.then(function(notes){
				var titles = [];
				for(var i=0;i<notes.length;i++)
					(function(j){
						titles.push(notes[j].title);
					}(i));
					res.json({
						status : "success",
						content : titles
					})
			})
			.catch(function(err){
				res.json({
					status : "failure",
					message : err
				})
			})
	}
	else{
		res.json({
			status : "failure",
			message : "You have to login first before loading messages"
		})
	}
});

app.post('/load',function(req,res){
	models.Note.findOne({where : {title : req.body.name}})
		.then(function(note){
			res.json({
				status : "success",
				content : note.content
			})
		})
		.catch(function(err){
			res.json({
				status : "failure",
				message : err
			});
		})
});

app.post('/save',function(req,res){
	if(req.session && req.session.user){
		models.User.findOne({where : { username : req.session.user} })
		.then(function(user){
			models.Note.findOne({where : {UserId : user.dataValues.id, title : req.body.name}})
			.then(function(note){
				note.content = req.body.content;
				note.save();
				res.json({
					status : "success",
					message : "Note Content Modified"
				})
			})
			.catch(function(err){
				models.Note.create({
					title : req.body.name,
					content : req.body.content,
					UserId : user.id
				})
				res.json({
					status : "success",
					message : "New Note created"
				})
			})
		})
		.catch(function(err){
			res.json({
				status : "failure",
				message : err
			})
		})
	}
	else{
		res.json({
			status : "failure",
			message : "You have to login First"
		})
	}
});

app.post('/login',function(req,res){
	var userName = req.body.userID;
	var userPWD = req.body.userPwd;

	models.User.findOne({where : {username : userName, password : userPWD }})
		.then(function(user){
			req.session.user = user.dataValues.username;
			req.session.userId = user.dataValues.id;
			models.Session.findAll({where : {UserId : user.dataValues.id}})
				.then(function(sessions){
					var session = [];
					for(var i=0;i<sessions.length;i++)
						(function(j){
							session.push(sessions[i].dataValues.content);
							sessions[i].destroy();
						})(i);
					res.json({
						status : "success",
						user : user.dataValues.username,
						content : session
					});
				})
				.catch(function(err){
					res.json({
						status: "failure",
						content : err
					})
				});
		})
		.catch(function(err){
			res.json({
				status: "failure",
				content : err
			});
		});
});

app.post('/logout',function(req,res){
	var logout_user_notes = req.body.content;
	var user_id = req.session.userId;

	for(var i=0;i<logout_user_notes.length;i++)
		(function(j){
			models.Session.create({
				content : logout_user_notes[j],
				UserId : user_id
			})
		}(i));

	req.session.destroy(function(err){
		if(err) console.log(err);
		else res.redirect('/');
	});

});

var server = app.listen(8080, function () {
	console.log('Server started!');
});
