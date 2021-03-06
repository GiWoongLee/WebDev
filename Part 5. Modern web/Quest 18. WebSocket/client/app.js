var App = App || (function(){
  return {
    on : function(socket){
      $("#ft_button").click(function(e){
        socket.emit('readFindRoomHTML',{});
        socket.on('loadFindRoomHTML',function(data){
          var temp = data.content.split("<body>");
          var tempHead = temp[0].split("<head>")[1].split("</head>")[0];
          var tempBody = temp[1].split("</body>")[0];
          $('head').html(tempHead);
          $('body').html(tempBody);
        })
      });
      $("#ct_button").click(function(e){
        var roomName = $('#ct_name').val();
        var counter = 0;
        function createRoom(data){
          if(data.status=="succeed"){
            var temp = data.content.split("<body>");
            var tempHead = temp[0].split("<head>")[1].split("</head>")[0];
            var tempBody = temp[1].split("</body>")[0];
            $('head').html(tempHead);
            $('body').html(tempBody);
            Board.makeComponent();
            $('#roomName').html(roomName);
          }
          else{
            var msg = data.content;
            $('body').append("<div id='msgBox'></div>");
            $('#msgBox').append("<div id='msg'>" + msg + "</div>");
            $('#msgBox').append("<div class='msgButtons'></div>")
            $('.msgButtons').append("<button id='joinButton'>Join</button>");
            $('.msgButtons').append("<button id='cancelButton'>Cancel</button>");
            $('#joinButton').click(function(e){
              function loadCanvas(data){
                var temp = data.content.split("<script>");
                var tempHead = temp[0].split("<head>")[1].split("</head>")[0];
                $('head').html(tempHead);
                $('body').html(data.bodyPart);
                $('#roomName').html(roomName);
                socket.removeListener("roomJoined",loadCanvas);
              }
              $('#msgBox').remove();
              socket.emit('joinRoom',{roomName :roomName});
              socket.on('roomJoined',loadCanvas);
            });
            $('#cancelButton').click(function(e){
              $('#msgBox').remove();
            })
          }
          socket.removeListener('roomCreated',createRoom);
        }
        socket.emit('createRoom',{roomName :roomName});
        socket.on('roomCreated',createRoom);
      })
    },
    getSocket : function(){
      return socket;
    }
  }
}());
