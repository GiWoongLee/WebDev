var figureNum = 0;

var Board = Board || (function(){
  return {
    makeComponent : function(){
      var desktop = new Desktop();
    },
    on : function(socket){
      socket.on('loadCurrentView',function(data){
        var roomName = $('#roomName').html();
        var content = $('body').html();
        socket.emit("renderCurrentView",{
          roomName : roomName,
          bodyPart : content
        });
      });

      socket.on("drawRectangle",function(data){
        var ele = d3.select("#"+data.id);
        if(ele.empty()){
          ele = document.createElementNS("http://www.w3.org/2000/svg","rect");
          ele.className = "figures";
          ele.id = data.id;
          figureNum++;
          document.querySelector(".svgCanvas").appendChild(ele);
          ele.setAttributeNS(null,"fill","#0000cc");
          ele.setAttributeNS(null,"x",data.posX);
          ele.setAttributeNS(null,"y",data.posY);
          ele.setAttributeNS(null,"width",data.width);
          ele.setAttributeNS(null,"height",data.height);
        }
        else{
          ele.attr('x',data.posX);
          ele.attr("y",data.posY);
          ele.attr("width",data.width);
          ele.attr("height",data.height);
        }
      })

      socket.on("drawTriangle",function(data){
        var ele = d3.select("#"+data.id);
        var newPoint = {
          a : data.point1,
          b : data.point2,
          c : data.point3,
          d : data.point4,
          e : data.point5,
          f : data.point6
        }

        if(ele.empty()){
          ele = document.createElementNS("http://www.w3.org/2000/svg","polygon");
          ele.className = "figures";
          ele.id = data.id;
          figureNum++;
          document.querySelector(".svgCanvas").appendChild(ele);
          ele.setAttributeNS(null,"fill","green");
          ele.setAttributeNS(null,"points",(newPoint.a + "," + newPoint.b + " " + newPoint.c + "," + newPoint.d + " " +newPoint.e + "," + newPoint.f));
        }
        else{
          ele.attr("points",(newPoint.a + "," + newPoint.b + " " + newPoint.c + "," + newPoint.d + " " +newPoint.e + "," + newPoint.f));
        }
      })

      socket.on("drawCircle",function(data){
        var ele = d3.select("#"+data.id);
        if(ele.empty()){
          ele = document.createElementNS("http://www.w3.org/2000/svg","circle");
          ele.className = "figures";
          ele.id = data.id;
          figureNum++;
          document.querySelector(".svgCanvas").appendChild(ele);
          ele.setAttributeNS(null,"fill","red");
          ele.setAttributeNS(null,"cx",data.cx);
          ele.setAttributeNS(null,"cy",data.cy);
          ele.setAttributeNS(null,"fill","#cc0000");
          ele.setAttributeNS(null,"r",data.r);
        }
        else{
          ele.attr("r",data.r);
        }
      })

      socket.on('moveFigure',function(data){
        var ele = d3.select("#"+data.id);
        ele.attr("transform","translate(" + data.translateX + "," + data.translateY + ")");
      })

      socket.on('removeFigure',function(data){
        var ele = d3.select("#" + data.id).remove();

      })
    }
  }
}());

var Desktop = function(){

  var buttons = new Buttons();
  var canvas = new Canvas();

};

var Buttons = function(){
  /* Make Button Lists */
  var nav = document.createElement("nav");
  var butList = document.createElement("ul");
  butList.className = "figureNav"
  nav.appendChild(butList);

  var rectButton = new Rect();
  var triButton = new Tri();
  var circleButton = new Circle();
  var roomName = new RoomName();

  butList.appendChild(rectButton);
  butList.appendChild(triButton);
  butList.appendChild(circleButton);
  butList.appendChild(roomName);

  var main = document.querySelector(".desktop");
  main.appendChild(nav);
};

var selectedElement = null;

var Figure = function(){
  var button = document.createElement("li");
  button.className = "figureButtons";

  var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("xmlns","http://www.w3.org/2000/svg");
  svg.setAttribute("class","svgButtons");

  var group = document.createElementNS("http://www.w3.org/2000/svg","g");
  group.setAttribute("class","svgGroup");

  svg.appendChild(group);
  button.appendChild(svg);
  return button;
}

Figure.makeComponent = function(type){
  var ele;
  if(type == "rectangle"){
    ele = document.createElementNS("http://www.w3.org/2000/svg","rect");
    ele.setAttributeNS(null,"x",45);
    ele.setAttributeNS(null,"y",15);
    ele.setAttributeNS(null,"width",50);
    ele.setAttributeNS(null,"height",50);
    ele.setAttributeNS(null,"fill","#0000cc");
  }
  else if(type == "triangle"){
    ele = document.createElementNS("http://www.w3.org/2000/svg","polygon");
    ele.setAttributeNS(null,"points",("45,65 70,15 95,65"));
    ele.setAttributeNS(null,"fill","green");
  }
  else{
    ele = document.createElementNS("http://www.w3.org/2000/svg","circle");
    ele.setAttributeNS(null,"cx",70);
    ele.setAttributeNS(null,"cy",40);
    ele.setAttributeNS(null,"r",25);
    ele.setAttributeNS(null,"fill","#cc0000");
  }
  ele.className = "draggable";
  return ele;
}

var Rect = function(){
  var button = Figure.call(this);
  var figure = Figure.makeComponent("rectangle");
  var svgArea = button.childNodes[0].childNodes[0];
  svgArea.appendChild(figure);

  button.addEventListener("click",function(){
    var canvas = document.querySelector(".canvas");
    canvas.style.cursor = "nw-resize";
    canvas.addEventListener("mousedown",drawRectangle);
    canvas.addEventListener("mouseup",function(){
      canvas.removeEventListener("mousedown",drawRectangle);
      canvas.style.cursor = "default";
    })
  });

  return button;
};


Rect.prototype = Object.create(Figure.prototype);

Rect.prototype.constructor = Rect;

var Tri = function(){
  var button = Figure.call(this);
  var figure = Figure.makeComponent("triangle");
  var svgArea = button.childNodes[0].childNodes[0];
  svgArea.appendChild(figure);

  button.addEventListener("click",function(){
    var canvas = document.querySelector(".canvas");
    canvas.style.cursor = "nw-resize";
    canvas.addEventListener("mousedown",drawTriangle);
    canvas.addEventListener("mouseup",function(){
      canvas.removeEventListener("mousedown",drawTriangle);
      canvas.style.cursor = "default";
    })
  });
  return button;
};

Tri.prototype = Object.create(Figure.prototype);

Tri.prototype.constructor = Tri;

var Circle = function(){
  var button = Figure.call(this);
  var figure = Figure.makeComponent("circle");
  var svgArea = button.childNodes[0].childNodes[0];
  svgArea.appendChild(figure);

  button.addEventListener("click",function(){
    var canvas = document.querySelector(".canvas");
    canvas.style.cursor = "nw-resize";
    canvas.addEventListener("mousedown",drawCircle);
    canvas.addEventListener("mouseup",function(){
      canvas.removeEventListener("mousedown",drawCircle);
      canvas.style.cursor = "default";
    })
  });
  return button;
};

Circle.prototype = Object.create(Figure.prototype);

Circle.prototype.constructor = Circle;

var Canvas = function(){
  var canvas = document.createElement("div");
  canvas.className = "canvas";
  var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.id = "canvasSVG";
  svg.setAttribute("xmlns","http://www.w3.org/2000/svg");
  svg.setAttribute("width","1000px");
  svg.setAttribute("height","800px");


  var group = document.createElementNS("http://www.w3.org/2000/svg","g");
  group.setAttribute("class","svgCanvas");

  svg.appendChild(group);
  canvas.appendChild(svg);

  var main = document.querySelector(".desktop");
  main.appendChild(canvas);
};

function drawRectangle(e){

  var canvas = document.querySelector(".canvas");
  var originX = e.clientX;
  var originY = e.clientY;
  var ele = document.createElementNS("http://www.w3.org/2000/svg","rect");
  ele.className = "figures";
  ele.id = "figure" + (++figureNum);
  ele.setAttributeNS(null,"x",originX - canvas.offsetLeft);
  ele.setAttributeNS(null,"y",originY - canvas.offsetTop);
  ele.setAttributeNS(null,"fill","#0000cc");

  document.querySelector(".svgCanvas").appendChild(ele);

  function draw(e){
    ele.setAttributeNS(null,"width",e.clientX-originX);
    ele.setAttributeNS(null,"height",e.clientY-originY);
    var roomName = $('#roomName').html();

    socket.emit("drawRectangle",{
      roomName : roomName,
      id : ele.id,
      posX : ele.getAttribute("x"),
      posY : ele.getAttribute("y"),
      width : ele.getAttribute("width"),
      height : ele.getAttribute("height"),
    });
  }



  canvas.addEventListener("mousemove",draw);
  canvas.addEventListener("mouseup",function(e){
    canvas.removeEventListener("mousemove",draw);
  });

  ele.addEventListener("dblclick",function(e){
    selectElement(e);
  });

};

function drawTriangle(e){

  var canvas = document.querySelector(".canvas");

  var mouseX = e.clientX;
  var mouseY = e.clientY;

  var originX = e.clientX - canvas.offsetLeft;
  var originY = e.clientY - canvas.offsetTop;

  var ele = document.createElementNS("http://www.w3.org/2000/svg","polygon");
  ele.className = "figures";
  ele.id = "figure" + (++figureNum);

  var point = {
    a : originX,
    b : originY - 5,
    c : originX - 5,
    d : originY + 5,
    e : originX + 5,
    f : originY + 5
  };

  ele.setAttributeNS(null,"points",(point.a + "," + point.b + " " + point.c + "," + point.d + " " + point.e + "," + point.f));
  ele.setAttributeNS(null,"fill","green");

  document.querySelector(".svgCanvas").appendChild(ele);

  function draw(e){
    var newPoint = {
      a : point.a,
      b : point.b - (e.clientY - mouseY),
      c : point.c - (e.clientX - mouseX),
      d : point.d + (e.clientY - mouseY),
      e : point.e + (e.clientX - mouseX),
      f : point.f + (e.clientY - mouseY),
    }

    ele.setAttributeNS(null,"points",(newPoint.a + "," + newPoint.b + " " + newPoint.c + "," + newPoint.d + " " +newPoint.e + "," + newPoint.f));

    var roomName = $('#roomName').html();

    socket.emit("drawTriangle",{
      roomName : roomName,
      id : ele.id,
      point1 : newPoint.a,
      point2 : newPoint.b,
      point3 : newPoint.c,
      point4 : newPoint.d,
      point5 : newPoint.e,
      point6 : newPoint.f
    });
  }

  canvas.addEventListener("mousemove",draw);
  canvas.addEventListener("mouseup",function(e){
    canvas.removeEventListener("mousemove",draw);
  });

  ele.addEventListener("dblclick",function(e){
    selectElement(e);
  });


};

function drawCircle(e){

  var canvas = document.querySelector(".canvas");
  var originX = e.clientX;
  var originY = e.clientY;

  var ele = document.createElementNS("http://www.w3.org/2000/svg","circle");
  ele.className = "figures";
  ele.id = "figure" + (++figureNum);

  ele.setAttributeNS(null,"cx",originX - canvas.offsetLeft);
  ele.setAttributeNS(null,"cy",originY - canvas.offsetTop);
  ele.setAttributeNS(null,"fill","#cc0000");

  document.querySelector(".svgCanvas").appendChild(ele);

  function draw(e){
    ele.setAttributeNS(null,"r",e.clientX-originX);
    var roomName = $('#roomName').html();

    socket.emit("drawCircle",{
      roomName : roomName,
      id : ele.id,
      cx : ele.getAttribute("cx"),
      cy : ele.getAttribute("cy"),
      r : ele.getAttribute("r")
    });
  }

  canvas.addEventListener("mousemove",draw);
  canvas.addEventListener("mouseup",function(e){
    canvas.removeEventListener("mousemove",draw);
  });

  ele.addEventListener("dblclick",function(e){
    selectElement(e);
  });

};

function selectElement(e){
  // Remove Other eventlistener
  if(selectedElement != null)
    selectedElement.removeEventListener("mousedown",moveByMouse);

  //Add eventlistener to Newly selected component
  selectedElement = e.target;
  selectedElement.addEventListener("mousedown",moveByMouse);
  window.addEventListener("keydown",moveByArrow);
  window.addEventListener("keydown",removeFigure);
  window.addEventListener("keydown",deselectElement);
}

function moveByMouse(e){
  var originX = e.clientX;
  var originY = e.clientY;
  var elementId = selectedElement.id;

  //Save translate(X,Y) to reflect original tranform position
  var transX = 0;
  var transY = 0;
  if(selectedElement.getAttribute("transform")!=null){
    transX = selectedElement.getCTM().e;
    transY = selectedElement.getCTM().f;
  }

  function drag(e){
    var movedX = e.clientX - originX;
    var movedY = e.clientY - originY;
    selectedElement.setAttributeNS(null,"transform","translate(" + (transX + movedX) + "," + (transY +movedY) + ")");
    var roomName = $('#roomName').html();
    socket.emit('moveFigure',{
      roomName : roomName,
      id : elementId,
      translateX : selectedElement.getCTM().e,
      translateY : selectedElement.getCTM().f
    })
  }

  document.addEventListener("mousemove",drag);
  document.addEventListener("mouseup",function(e){
    document.removeEventListener('mousemove',drag);
  });

}


function moveByArrow(e){
  //Save translate(X,Y) to reflect original tranform position
  var transX = 0;
  var transY = 0;
  var elementId = selectedElement.id;

  if(selectedElement.getAttribute("transform")!=null){
    transX = selectedElement.getCTM().e;
    transY = selectedElement.getCTM().f;
  }
  var movedX;
  var movedY;
  //up
 if(e.keyCode == 38){
    movedX = transX;
    movedY = transY - 10;
    selectedElement.setAttributeNS(null,"transform","translate(" + movedX + "," + movedY + ")");
  }
  //left
  else if(e.keyCode == 37){
    movedX = transX - 10;
    movedY = transY;
    selectedElement.setAttributeNS(null,"transform","translate(" + movedX + "," + movedY + ")");
  }
  //down
  else if(e.keyCode == 40){
    movedX = transX;
    movedY = transY + 10;
    selectedElement.setAttributeNS(null,"transform","translate(" + movedX + "," + movedY + ")");
  }
  //right
  else if(e.keyCode == 39){
    movedX = transX + 10;
    movedY = transY;
    selectedElement.setAttributeNS(null,"transform","translate(" + movedX + "," + movedY + ")");
  }

  var roomName = $('#roomName').html();
  socket.emit("moveFigure",{
    roomName : roomName,
    id : elementId,
    translateX : selectedElement.getCTM().e,
    translateY : selectedElement.getCTM().f
  })
}

function removeFigure(e){
  //backspace
  if(e.keyCode == 8){
    var svg = document.querySelector(".svgCanvas");
    svg.removeChild(selectedElement);
    var roomName = $('#roomName').html();
    socket.emit("removeFigure",{
      roomName : roomName,
      id : selectedElement.id
    })
  }
}

function deselectElement(e){
  if(e.keyCode == 27){
    selectedElement.removeEventListener("mousedown",moveByMouse);
    window.removeEventListener("keydown",moveByArrow);
    window.removeEventListener("keydown",removeFigure);
    window.removeEventListener("keydown",deselectElement);
    selectedElement = null;
  }
}

var RoomName = function(){
  var button = document.createElement("li");
  button.className = "figureButtons";
  button.id = "roomName";

  button.addEventListener('click',function(e){
    if($('#functionBox').length){
      $('#functionBox').remove();
    }
    else{
      $('body').append("<div id='functionBox'></div>")
      $('#functionBox').append("<button id='searchButton'>Search Room</button>");
      $('#functionBox').append("<button id='createButton'>Create Room</button>");
      $('#searchButton').click(function(e){
        socket.emit('readFindRoomHTML',{});
        socket.on('loadFindRoomHTML',function(data){
          var temp = data.content.split("<body>");
          var tempHead = temp[0].split("<head>")[1].split("</head>")[0];
          var tempBody = temp[1].split("</body>")[0];
          $('head').html(tempHead);
          $('body').html(tempBody);
        })
      });
      $('#createButton').click(function(e){
        socket.emit('readHomeHTML',{});
        socket.on('loadHomeHTML',function(data){
          socket.emit('disconnect',{});
          socket.on('disconnected',function(){});
          var temp = data.content.split("<body>");
          var tempHead = temp[0].split("<head>")[1].split("</head>")[0];
          var tempBody = temp[1].split("</body>")[0];
          $('head').html(tempHead);
          $('body').html(tempBody);
        })
      });
    }
  })

  return button;
}
