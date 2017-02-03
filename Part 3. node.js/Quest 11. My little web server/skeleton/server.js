var http = require('http');
var url = require('url');

//HTTP Server
var server = http.createServer(function(req, res){
  res.setHeader("Content-Type","text/html");
  res.writeHead(200);

  if(req.method == 'GET'){
    var query = url.parse(req.url,true).query;
    res.write("Hello " + query.bar);
    res.end();
  }

  else{
    var jsonData = "";
    req.on('data',function(chunk){
      jsonData += chunk;
    });

    req.on('end',function(){
      var reqObj = JSON.parse(jsonData);
      var resObj = {
        bar : "woong"
      };
      res.end(JSON.stringify(resObj));
    });
  }
}).listen(8080);




//HTTP Client

var option1 = {
  hostname: 'localhost',
  port : '8080',
  path : '/foo?bar=kyuin'
};

var getReq = http.request(option1,function(response){
  var responseData = "";
  response.on('data',function(chunk){
    responseData += chunk;
  });
  response.on('end',function(){
    console.log(responseData);
  });
});

getReq.end();

var option2 = {
  hostname: 'localhost',
  port: '8080',
  path: '/foo',
  method: 'POST'
};

var postReq = http.request(option2,function(response){
  var responseData = "";
  response.on('data',function(chunk){
    responseData += chunk;
  });
  response.on('end',function(){
    var dataObj = JSON.parse(responseData);
    console.log("Hello " + dataObj.bar);
  });
});

postReq.write('{"bar" : "woong" }');
postReq.end();
