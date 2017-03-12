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
  res.sendFile(__dirname + "/client/app.html");
})

//Upgrade http server to socket.io server
var io = require('socket.io').listen(httpServer);
var sockets = [];
var roomInfo = {
  socketId : "",
  request : "",
  bodyPart : null
}

//클라이언트가 socket.io 채널로 접속이 되었을 때에 대한 이벤트를 정의한다.
//parameter socket은 connection이 성공했을 때 커넥션에 대한 정보를 담고 있는 변수
io.sockets.on('connection',function(socket){
  console.log("connected");

  socket.on('connected',function(data){
    console.log("CONNECTED");
  })

  socket.on('readHomeHTML',function(data){
    fs.readFile(__dirname + "/client/app.html", "utf-8", function(err,content){
      if(err) return;
      else socket.emit('loadHomeHTML',{content : content});
    });
  });

  socket.on('readFindRoomHTML',function(data){
    fs.readFile(__dirname + "/client/find_your_room.html", "utf-8", function(err,content){
      if(err) return;
      else socket.emit('loadFindRoomHTML',{content : content});
    });
  });

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
    //Store User who want to join Room to prevent problem from networking with other socket
    roomInfo.socketId = socket.id;
    roomInfo.request = "roomJoined";
    var roomName = data.roomName;
    socket.join(data.roomName);
    socket.broadcast.to(roomName).emit("loadCurrentView",{});
  })

  socket.on('findRoom',function(data){
    var roomName = data.roomName;
    if(roomExist(roomName)){
      //Store User who want to join Room to prevent problem from networking with other socket
      roomInfo.socketId = socket.id;
      roomInfo.request = "roomFound";
      var roomName = data.roomName;
      socket.join(data.roomName);
      socket.broadcast.to(roomName).emit("loadCurrentView",{});
    }
    else{
      var msg = "Cannot find room name of " + roomName;
      socket.emit("roomFound",{
        status : "failure",
        content : msg
      });
    }
  });

  socket.on("renderCurrentView",function(data){
    roomInfo.bodyPart = data.bodyPart;
    sendCanvasToClient(socket,roomInfo.request);
  })


  socket.on('drawRectangle',function(data){
    socket.broadcast.to(data.roomName).emit("drawRectangle",{
      id : data.id,
      posX : data.posX,
      posY : data.posY,
      width : data.width,
      height : data.height
    })
  })

  socket.on('drawTriangle',function(data){
    socket.broadcast.to(data.roomName).emit("drawTriangle",{
      id : data.id,
      point1 : data.point1,
      point2 : data.point2,
      point3 : data.point3,
      point4 : data.point4,
      point5 : data.point5,
      point6 : data.point6
    })
  })

  socket.on('drawCircle',function(data){
    socket.broadcast.to(data.roomName).emit("drawCircle",{
      id : data.id,
      cx : data.cx,
      cy : data.cy,
      r : data.r
    })
  })

  socket.on('moveFigure',function(data){
    socket.broadcast.to(data.roomName).emit("moveFigure",{
      id : data.id,
      translateX : data.translateX,
      translateY : data.translateY
    })
  })

  socket.on('removeFigure',function(data){
    socket.broadcast.to(data.roomName).emit("removeFigure",{
      id : data.id
    })
  })

  socket.on('disconnect',function(){
    socket.disconnect();
    socket.emit('disconnected',{});
    console.log("DISCONNECTED");
  })

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
  if(msg=="roomCreated"){
    fs.readFile(__dirname + "/client/board.html","utf-8",function(err,content){
      if(err) return;
      else {
        socket.emit(msg,{
          status : "succeed",
          content : content
        })
      }
    });
  }
  else{
    fs.readFile(__dirname + "/client/board.html","utf-8",function(err,content){
      if(err) return;
      else {
        socket.broadcast.to(roomInfo.socketId).emit(msg,{
          status : "succeed",
          content : content,
          bodyPart : roomInfo.bodyPart
        })
      }
    });
  }
}
