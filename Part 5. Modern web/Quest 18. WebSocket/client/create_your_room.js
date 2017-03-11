var Canvas = Canvas || (function(){
  return {
    on : function(socket){
      $("#ft_button").click(function(e){
        $('body').load('./find_your_room.html',function(){});
      });
      $("#ct_button").click(function(e){
        var roomName = $('#ct_name').val();
        var counter = 0;
        function createRoom(data){
          if(data.status=="succeed"){
            $('body').html(data.content);
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
                $('body').html(data.content);
                $('#roomName').html(roomName);
                socket.removeListener("roomJoined",loadCanvas);
              }
              $('#msgBox').remove();
              socket.emit('joinRoom',{roomName :roomName});
              socket.on('roomJoined',loadCanvas);
            })
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
    getSocket : function () {
      return socket;
    }
  }
}());
