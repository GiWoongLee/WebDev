var findRoom = function(){
  var socket = Canvas.getSocket();
  $('#search_button').click(function(e){
    var roomName = $("#find_room_name").val();
    function joinRoom(data){
      if(data.status=="succeed"){
        $('body').html(data.content);
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
      socket.removeListener('roomFound',joinRoom);
    }
    socket.emit("findRoom",{roomName : roomName});
    socket.on("roomFound",joinRoom);
  });
}
