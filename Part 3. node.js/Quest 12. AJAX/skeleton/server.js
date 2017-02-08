var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	cookieParser = require('cookie-parser');
	session = require('express-session'),
	app = express();


app.use(express.static('client'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
		key : 'sid', // 세션키
		secret : 'secret_key', //비밀키
		resave : false, //request가 요청되었을 때 기존의 session이 존재하는 경우 이를 다시 저장할 필요가 있는지 확인
		saveUninitialized: false, //모든 초기화되지 않은 session을 저장할 것인지 여부
		cookie : {
			maxAge : 1000 * 60 * 60 // 유효시간 1시간
		}
}));


app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/is_logged_in',function(req,res){
	res.json({
		status : is_logged_in(req.session)
	});
});

app.get('/new',function(req,res){
	res.send(null);
});

/* 사용자와 관련된 note를 보고, 저장하는 작업은 추후에 하기 */

app.get('/show',function(req,res){
	var newPath = __dirname + "/notes/";
	fs.readdir(newPath,function(err,files){
		if(err) return console.log(err);
		else{
			res.send(files);
		}
	});
});

app.post('/load',function(req,res){
	var newPath = __dirname + "/notes/" + req.body.name;
	fs.readFile(newPath,function(err,data){
		if(err) return console.log(err);
		else {
			res.send(data);
		}
	});
});

app.post('/save',function(req,res){
	var newPath = __dirname + "/notes/" + req.body.name;
	fs.writeFile(newPath,req.body.content,function(err){
		if(err) return console.log(err);
	});
	res.send(null);
});


app.post('/login',function(req,res){
	var userID = req.body.userID;
	var userPWD = req.body.userPwd;
	var loggedIn_user = find_user(userID,userPWD);
	if(loggedIn_user==null) {
		res.json({
			status : "failure",
			content : "Wrong ID/Password"
		});
	}
	else{
		req.session.user = loggedIn_user.id;
		res.json({
			status : "success",
			user : loggedIn_user.id,
			content : loggedIn_user.sessContent
		});
	}
});

app.post('/logout',function(req,res){
	var contentArr = req.body.content;
	var user = current_user_info(req.session.user);
	user.sessContent = [];

	for(var i=0;i<contentArr.length;i++){
		user.sessContent.push(contentArr[i]);
	}

	req.session.destroy(function(err){
		if(err) console.log(err);
		else res.redirect('/');
	});


});


var server = app.listen(8080, function () {
	console.log('Server started!');
});

var is_logged_in = function(sessionInfo){
	if(sessionInfo && sessionInfo.user) return true;
	else return false;
}


var current_user_info = function(user){
	for(var i=1;i<=Object.keys(users).length;i++){
			if(users[i].id==user){
				return users[i];
			}
	}
	return null;
}

var find_user = function(userID,userPWD){
	for(var i=1;i<=Object.keys(users).length;i++){
			if(userID==users[i].id && userPWD ==users[i].pwd){
				return users[i];
			}
	}
	return null;
}


var users = {
	1 : {
		id : "woong",
		pwd : "woong1225",
		nickname : "W",
		sessContent: []
	},
	2 : {
		id : "kyuin",
		pwd : "kyuin0701",
		nickname : "K",
		sessContent : []
	},
	3 : {
		id : "sunghwan",
		pwd : "yunseon",
		nickname : "S",
		sessContent : []
	}
};
