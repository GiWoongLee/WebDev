var Notepad = function() {
	 //createButtons
   var navList = document.createElement("ul");
   var func1 = new newFunc();
   var func2 = new loadFunc();
   var func3 = new saveFunc();
   navList.appendChild(func1);
   navList.appendChild(func2);
   navList.appendChild(func3);
   navList.className = "navList";

   //createTextArea
   var txtArea = new textArea();

   var main = document.querySelector(".notepad");
   main.appendChild(navList);
   main.appendChild(txtArea);
   document.title = "New Note";
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

textArea.refreshText = function(content){
  var txt = document.getElementById("note");
  txt.value = content;
};

var func = function(){
  var func = document.createElement("li");
  func.className = "navEle";
  return func;
};


var newFunc = function(){
  var ele = func.call(this);
  ele.name = "new";
  var txt = document.createTextNode("New");
  ele.appendChild(txt);
  ele.addEventListener("click",function(){
    textArea.removeText();
    document.title = "New Note";
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
  ele.addEventListener("click",function(){
    new loadWindo();
  })
  return ele;
};

loadFunc.prototype = Object.create(func.prototype);

loadFunc.prototype.constructor = loadFunc;

var saveFunc = function(){
  var ele = func.call(this);
  ele.name = "save";
  var txt = document.createTextNode("Save");
  ele.appendChild(txt);
  ele.addEventListener("click",function(){
    new saveWindo();
  });
  return ele;
};

saveFunc.prototype = Object.create(func.prototype);

saveFunc.prototype.constructor = saveFunc;

var loadWindo = function(){
  var windo = document.createElement("div");
  windo.id = "loadwindo";

  var div = document.createElement("div");
  div.className = "fileTitle";
  var txt= document.createTextNode("FileName");
  div.appendChild(txt);
  windo.appendChild(div);


  var fileList = document.createElement("ul");
  fileList.id = "loadList";
  windo.appendChild(fileList);

  var req = new XMLHttpRequest();
  req.open("GET","/show",true);
  req.onreadystatechange = function(e){
    if(req.readyState==4 && req.status == 200){
      var json = JSON.parse(req.responseText);

      for(var i=0;i<json.length;i++){
        (function(j){
          var ele = document.createElement("li");

          ele.addEventListener("dblclick",function(e){
            var xhr = new XMLHttpRequest();
            xhr.open("POST","/load",true);
            xhr.onreadystatechange = function(){
              if(xhr.readyState==4 && xhr.status == 200){
                var main = document.querySelector(".notepad");
                main.removeChild(windo);
                document.title = ele.textContent;
                textArea.refreshText(xhr.responseText);
              }
            }
            var fileName = ele.textContent;
            xhr.setRequestHeader("content-type","application/json");
            xhr.send(JSON.stringify({"name" : fileName}));

          });

          ele.className = "fileEle";
          var txt = document.createTextNode(json[j]);
          ele.appendChild(txt);
          fileList.appendChild(ele);
      })(i)
      }
    }
  }
  //후에 사용자가 생기면 사용자 이름도 보내기
  req.send(null);

  var message = document.createElement("div");
  message.className = "message";
  var txt = document.createTextNode("Double Click Note you want to load");
  message.appendChild(txt);
  windo.appendChild(message);

  var main = document.querySelector(".notepad");
  main.appendChild(windo);


};


var saveWindo = function(){
  var windo = document.createElement("div");
  windo.id = "saveWindo";

  var txt = document.createTextNode("Name: ");
  var inputName = document.createElement("input");
  inputName.id = "fileName";
  inputName.type = "text";
  var br = document.createElement("br");

  var submitBut = document.createElement("input");
  submitBut.className = "fileBut";
  submitBut.type = "button";
  submitBut.value = "Save";

  submitBut.addEventListener('click',function(event){
    var content = textArea.readText();
    var req = new XMLHttpRequest();
    req.open("POST",'/save',true);
    req.onreadystatechange = function(e){
      if(req.readyState==4 && req.status == 200){
        var main = document.querySelector(".notepad");
        main.removeChild(windo);
        document.title = inputName.value;
      }
    }
    req.setRequestHeader('content-type','application/json');
    req.send(JSON.stringify({
      name : inputName.value,
      content : content
    }));
  });

  var cancelBut = document.createElement("input");
  cancelBut.className = "fileBut";
  cancelBut.type = "button";
  cancelBut.value = "Cancel";

  cancelBut.addEventListener('click',function(event){
    var main = document.querySelector(".notepad");
    main.removeChild(windo);
  })

  windo.appendChild(txt);
  windo.appendChild(inputName);
  windo.appendChild(br);
  windo.appendChild(submitBut);
  windo.appendChild(cancelBut);


  var main = document.querySelector(".notepad");
  main.appendChild(windo);
};
