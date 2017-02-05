var Notepad = function() {
	 //createButtons
   var funcList = document.createElement("ul");
   var func1 = new newFunc();
   var func2 = new loadFunc();
   var func3 = new saveFunc();
   funcList.appendChild(func1);
   funcList.appendChild(func2);
   funcList.appendChild(func3);

   //createTextArea
   var txtArea = new textArea();

   var main = document.querySelector(".notepad");
   main.appendChild(funcList);
   main.appendChild(txtArea);

};

var textArea = function(){
  var txtArea = document.createElement("div");
  txtArea.className = "noteArea";
  var txtNode = document.createElement("textarea");
  txtArea.appendChild(txtNode);
  txtNode.id = "note";

  return txtArea;
};

textArea.removeText = function(){
  var txt = document.getElementById("note");
  txt.value = "";
};

textArea.readText = function(){
  var txt = document.getElementById("note");
  return txt.value;
};

textArea.refreshText = function(){
  var content = textArea.readText();
  textArea.removeText();
  return content;
};

var func = function(){
  var func = document.createElement("li");
  func.className = "funcEle";
  return func;
};


var newFunc = function(){
  var ele = func.call(this);
  ele.name = "new";
  var txt = document.createTextNode("New");
  ele.appendChild(txt);
  ele.addEventListener("click",function(){
    textArea.removeText();
  })
  return ele;
};

newFunc.prototype = Object.create(func.prototype);

newFunc.prototype.constructor = newFunc;

var loadFunc = function(){
  var ele = func.call(this);
  ele.name = "load";
  var txt = document.createTextNode("Load");
  ele.appendChild(txt);
  return ele;
};

loadFunc.prototype = Object.create(func.prototype);

loadFunc.prototype.constructor = loadFunc;

var saveFunc = function(){
  var ele = func.call(this);
  ele.name = "save";
  var txt = document.createTextNode("Save");
  ele.appendChild(txt);
  return ele;
};

saveFunc.prototype = Object.create(func.prototype);

saveFunc.prototype.constructor = saveFunc;

var loadWindo = function(){

};

var saveWindo = function(){

};
