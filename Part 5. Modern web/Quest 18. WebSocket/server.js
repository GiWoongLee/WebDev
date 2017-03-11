var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var app = express();

app.use(express.static(path.join(__dirname,'client')));

var httpServer = http.createServer(app).listen(8080,function(req,res){
  console.log("Socket IO server has been started");
});

app.get('/',function(req,res){
  res.sendFile(__dirname + "/client/create_your_room.html");
})

//Upgrade http server to socket.io server
var io = require('socket.io').listen(httpServer);


//클라이언트가 socket.io 채널로 접속이 되었을 때에 대한 이벤트를 정의한다.
//parameter socket은 connection이 성공했을 때 커넥션에 대한 정보를 담고 있는 변수
io.sockets.on('connection',function(socket){
  socket.on('createRoom',function(data){
    var roomName = data.roomName;
    if(roomExist(roomName)){
      var msg = roomName + " already exists. Want to join?";
      socket.emit('roomCreated',{
        status : "failure",
        content : msg
      });
    }
    else{
      socket.join(data.roomName);
      rooms.push(data.roomName);
      sendCanvasToClient(socket,"roomCreated");
    }
  })

  socket.on('joinRoom',function(data){
    var roomName = data.roomName;
    socket.join(data.roomName);
    rooms.push(data.roomName);
    sendCanvasToClient(socket,"roomJoined");
  })

  socket.on('findRoom',function(data){
    var roomName = data.roomName;
    if(roomExist(roomName)){
      socket.join(data.roomName);
      rooms.push(data.roomName);
      sendCanvasToClient(socket,"roomFound");
    }
    else{
      var msg = "Cannot find room name of " + roomName;
      socket.emit("roomFound",{
        status : "failure",
        content : msg
      });
    }
  });

});

var rooms = [ "canvas1", "canvas2", "canvas3"];

function roomExist(roomName){
  for(var i=0;i<rooms.length;i++){
    if(rooms[i]==roomName){
      return true;
    }
  }
  return false;
}

var sendCanvasToClient = function(socket,msg){
  fs.readFile(__dirname + "/client/canvas.html","utf-8",function(err,content){
    if(err) return;
    else {
      socket.emit(msg,{
        status : "succeed",
        content : content
      })
    }
  });
}

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
