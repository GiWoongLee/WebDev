var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	app = express();


app.use(express.static('client'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

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
		else res.send(data);
	})
});

app.post('/save',function(req,res){
	var newPath = __dirname + "/notes/" + req.body.name;
	fs.writeFile(newPath,req.body.content,function(err){
		if(err) return console.log(err);
	});
	res.send(null);
});


var server = app.listen(8080, function () {
	console.log('Server started!');
});
