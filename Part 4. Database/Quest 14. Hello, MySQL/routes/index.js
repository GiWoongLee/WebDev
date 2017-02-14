var models = require("../models"),
  express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser');
  session = require('express-session'),
  router = express.Router();


router.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/is_logged_in',function(req,res){
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

router.get('/new',function(req,res){
	res.send(null);
});

router.get('/show',function(req,res){
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

router.post('/load',function(req,res){
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

router.post('/save',function(req,res){
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

module.exports = router;
