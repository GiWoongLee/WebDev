var models = require("../models"),
  express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser');
  session = require('express-session'),
  router = express.Router();


router.post('/login',function(req,res){
	var userName = req.body.userID;
	var userPWD = req.body.userPwd;

	models.User.findOne({where : {username : userName}})
		.then(function(user){
			if(!user.authenticate(userPWD)){
				res.json({
					status: "failure",
					message : "Wrong ID/Password"
				})
			}
			else{
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
			}
		})
		.catch(function(err){
			res.json({
				status: "failure",
				content : err
			});
		});
});

router.post('/logout',function(req,res){
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

module.exports = router;
