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
  ele.setAttributeNS(null,"x",originX - canvas.offsetLeft);
  ele.setAttributeNS(null,"y",originY - canvas.offsetTop);
  ele.setAttributeNS(null,"fill","#0000cc");

  document.querySelector(".svgCanvas").appendChild(ele);

  function draw(e){
    ele.setAttributeNS(null,"width",e.clientX-originX);
    ele.setAttributeNS(null,"height",e.clientY-originY);
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
  ele.setAttributeNS(null,"cx",originX - canvas.offsetLeft);
  ele.setAttributeNS(null,"cy",originY - canvas.offsetTop);
  ele.setAttributeNS(null,"fill","#cc0000");

  document.querySelector(".svgCanvas").appendChild(ele);

  function draw(e){
    ele.setAttributeNS(null,"r",e.clientX-originX);
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
  if(selectedElement.getAttribute("transform")!=null){
    transX = selectedElement.getCTM().e;
    transY = selectedElement.getCTM().f;
  }


  //up
 if(e.keyCode == 38){
    var movedX = transX;
    var movedY = transY - 10;
    selectedElement.setAttributeNS(null,"transform","translate(" + movedX + "," + movedY + ")");
  }
  //left
  else if(e.keyCode == 37){
    var movedX = transX - 10;
    var movedY = transY;
    selectedElement.setAttributeNS(null,"transform","translate(" + movedX + "," + movedY + ")");
  }
  //down
  else if(e.keyCode == 40){
    var movedX = transX;
    var movedY = transY + 10;
    selectedElement.setAttributeNS(null,"transform","translate(" + movedX + "," + movedY + ")");
  }
  //right
  else if(e.keyCode == 39){
    var movedX = transX + 10;
    var movedY = transY;
    selectedElement.setAttributeNS(null,"transform","translate(" + movedX + "," + movedY + ")");
  }

}

function removeFigure(e){
  //backspace
  if(e.keyCode == 8){
    var svg = document.querySelector(".svgCanvas");
    svg.removeChild(selectedElement);
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
  return button;
}
