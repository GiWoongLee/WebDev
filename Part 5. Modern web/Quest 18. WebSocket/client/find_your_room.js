var findRoom = findRoom || (function(){
  return {
    on : function(socket){
      $('#search_button').click(function(e){
        var roomName = $("#find_room_name").val();
        function joinRoom(data){
          if(data.status=="succeed"){
            var temp = data.content.split("<script>");
            var tempHead = temp[0].split("<head>")[1].split("</head>")[0];
            $('head').html(tempHead);
            $('body').html(data.bodyPart);
            $('#roomName').html(roomName);
          }
          else{
            var msg = data.content;
            $('body').append("<div id='msgBox'></div>");
            $('#msgBox').append("<div id='msg'>" + msg + "</div>");
            $('#msgBox').append("<div class='msgButtons'></div>")
            $('.msgButtons').append("<button id='okButton'>OK</button>");
            $('#okButton').click(function(e){
              $('#msgBox').remove();
            })
          }
          socket.removeListener('roomCreated',joinRoom);
        }
        socket.emit("findRoom",{roomName : roomName});
        socket.on("roomFound",joinRoom);
      });
    }
  }
}());
