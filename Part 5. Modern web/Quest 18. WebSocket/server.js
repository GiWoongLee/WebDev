var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

app.use(express.static(path.join(__dirname,'client')));

var httpServer = http.createServer(app).listen(8080,function(req,res){
  console.log("Socket IO server has been started");
});

app.get('/',function(req,res){
  res.sendFile(__dirname + "/client/home.html");
})

//Upgrade http server to socket.io server
var io = require('socket.io').listen(httpServer);


//클라이언트가 socket.io 채널로 접속이 되었을 때에 대한 이벤트를 정의한다.
//parameter socket은 connection이 성공했을 때 커넥션에 대한 정보를 담고 있는 변수
io.sockets.on('connection',function(socket){

});

var rooms = [];

/*
//socket으로 데이터 주고받으며 처리하기
socket.on('보낼 이벤트명',데이터);
socket.on('받을 이벤트명',function(데이터){})

//방 파기
socket.join(방의 아이디)
socket.leave(방의 아이디)

//그룹 대상으로 메세지 보내기
io.sockets.to(방의 아이디).emit('이벤트명',데이터);
socket.broadcast.to(방의 아이디).emit('이벤트명',데이터)

//socket에 데이터 바인딩
socket.set('key','value',function(){});
socket.get('key',function(err,value){});
socket.del('key',function(err,value){});

io.sockets.manager.rooms => 현재 생성되어 있는 모든 room의 목록을 리턴한다
io.sockets.clients('room name') => room name의 room 안에 있는 모든 클라이언트 소켓 목록을 리턴한다

*/
