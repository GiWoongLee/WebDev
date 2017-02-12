//Make Identifier for Browser Tabs to store information on LocalStorage
var tabID = sessionStorage.tabID && sessionStorage.closedLastTab !== '2' ? sessionStorage.tabID : sessionStorage.tabID = Math.random();
sessionStorage.closedLastTab = '2';
window.addEventListener('unload beforeunload', function() {
      sessionStorage.closedLastTab = '1';
});


var Notepad = function() {
   //createButtons
   var navList = document.createElement("ul");
   var newBut = new newFunc();
   var loadBut = new loadFunc();
   var saveBut = new saveFunc();
   var loginBut = new loginFunc();
   var logoutBut = new logoutFunc();

   navList.appendChild(newBut);
   navList.appendChild(loadBut);
   navList.appendChild(saveBut);
   navList.className = "navList";

   putLoginLogout(navList,loginBut,logoutBut);

   //createTextArea
   var txtArea = new textArea();

   var main = document.querySelector(".notepad");
   main.appendChild(navList);
   main.appendChild(txtArea);
   document.title = "New Note";

};

var putLoginLogout = function(buttons,login,logout){
  if(JSON.parse(localStorage.getItem("logged_in"))== true){
    buttons.appendChild(logout);
  }
  else{
    buttons.appendChild(login);
  }
}

var textArea = function(){
  var txtArea = document.createElement("div");
  txtArea.className = "noteArea";
  var txtNode = document.createElement("textarea");
  txtArea.appendChild(txtNode);
  txtNode.id = "note";

  txtNode.addEventListener("change",function(e){
    if(JSON.parse(localStorage.getItem("logged_in"))==true){
        var txt = localStorage.getItem(tabID) || "";
        localStorage.setItem(tabID,txtNode.value);
        var sessList = [];
        if(localStorage.getItem("sessList")!=null){
          sessList = JSON.parse(localStorage.getItem("sessList"));
          if(sessList.indexOf(tabID)== -1){
            sessList.push(tabID);
          }
        }
        else{
          sessList = [tabID];
        }
        localStorage.setItem("sessList",JSON.stringify(sessList));
    }
  })
  return txtArea;
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
    var xhr = new XMLHttpRequest();
    xhr.open("GET","/new",true);
    xhr.onreadystatechange = function(){
      if(xhr.readyState==4 && xhr.status == 200){
        var newWindo = window.open("/");
        newWindo.document.title = "New Note";
      }
    }
    xhr.send(null);
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

var loginFunc = function(){
  var ele =func.call(this);
  ele.name = "SignIn";
  var txt = document.createTextNode("Sign In");
  ele.appendChild(txt);
  ele.addEventListener("click",function(){
    new loginWindo();
  });
  return ele;
}

loginFunc.prototype = Object.create(func.prototype);

loginFunc.prototype.constructor = loginFunc;

var logoutFunc = function(){
  var ele =func.call(this);
  ele.name = "LogOut";
  var txt = document.createTextNode("Log Out");
  ele.appendChild(txt);
  ele.addEventListener("click",function(){
    var xhr = new XMLHttpRequest();
    xhr.open("POST","logout",true);
    xhr.onreadystatechange = function(e){
      if(xhr.readyState==4 && xhr.status == 200){
        document.open();
        document.write(xhr.responseText);
        document.close();
      }
    }
    var content = [];
    if(localStorage.getItem("sessList")!=null){
      var sessList = JSON.parse(localStorage.getItem("sessList"));
      for(var i=0;i<sessList.length;i++){
        (function(j){
          var note = localStorage.getItem(sessList[j]);
          content.push(note);
        })(i);
      }
    }
    localStorage.clear();

    xhr.setRequestHeader("content-type","application/json");
    xhr.send(JSON.stringify({
      "content" : content
    }));
  });
  return ele;
}

logoutFunc.prototype = Object.create(func.prototype);

logoutFunc.prototype.constructor = loginFunc;


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
      var result = JSON.parse(req.responseText);
      if(result.status == "failure") {
        var main = document.querySelector(".notepad");
        main.removeChild(windo);
        alert("You have to login First!");
      }

      else{
        for(var i=0;i<result.content.length;i++){
          (function(j){
            var ele = document.createElement("li");
            ele.addEventListener("dblclick",function(e){
              var xhr = new XMLHttpRequest();
              xhr.open("POST","/load",true);
              xhr.onreadystatechange = function(){
                if(xhr.readyState==4 && xhr.status == 200){
                  var main = document.querySelector(".notepad");
                  main.removeChild(windo);
                  var result = JSON.parse(xhr.responseText);
                  if(result.status == "failure") alert(err);
                  else{
                    var newWindo = window.open("/");
                    newWindo.onload = function(){
                      newWindo.document.title = ele.textContent;
                      newWindo.document.getElementById("note").innerHTML = result.content;
                    }
                  }
                }
              }
              var fileName = ele.textContent;
              xhr.setRequestHeader("content-type","application/json");
              xhr.send(JSON.stringify({"name" : fileName}));

            });
            ele.className = "fileEle";
            var txt = document.createTextNode(result.content[j]);
            ele.appendChild(txt);
            fileList.appendChild(ele);
          })(i)
        }
      }


    }
  }
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

var loginWindo = function(){
  var windo = document.createElement("div");
  windo.id = "loginWindo";

  var txt1 = document.createTextNode("ID: ")
  var inputId = document.createElement("input");
  inputId.id = "userID";
  inputId.name ="userID"
  inputId.type = "text";

  var txt2 = document.createTextNode("PWD: ")
  var inputPwd = document.createElement("input");
  inputPwd.id= "userPwd";
  inputPwd.name="userPwd";
  inputPwd.type = "password";

  var br =document.createElement("br");

  var submitBut = document.createElement("input");
  submitBut.className = "loginBut";
  submitBut.type = "button";
  submitBut.value = "Sign In";

  submitBut.addEventListener('click',function(event){
    var xhr = new XMLHttpRequest();
    xhr.open("POST","/login",true);
    xhr.onreadystatechange = function(e){
      if(xhr.readyState==4 && xhr.status==200){
        var info = JSON.parse(xhr.responseText);
        if(info.status=='failure') alert(info.content);
        else{
          //set logged_in status true and windows list in localStorage
          localStorage.setItem("logged_in",true);
          for(var num=0;num<info.content.length;num++){
            (function(i){
              var newWindo = window.open("/");
              var txt = info.content[num];
              newWindo.onload = function(){
                newWindo.document.getElementById("note").value = txt;
              }
            })(num);
          }
          var main = document.querySelector(".notepad");
          main.removeChild(windo);
          var nav = document.querySelector(".navList");
          var but =document.getElementsByClassName("navEle");
          nav.removeChild(but[3]);
          var logoutBut = new logoutFunc();
          nav.appendChild(logoutBut);
        }
      }
    }
    xhr.setRequestHeader("content-type","application/json");
    xhr.send(JSON.stringify({
      userID : inputId.value,
      userPwd : inputPwd.value
    }));
  })

  var cancelBut = document.createElement("input");
  cancelBut.className = "loginBut";
  cancelBut.type = "button";
  cancelBut.value = "Cancel";

  cancelBut.addEventListener('click',function(event){
    var main = document.querySelector(".notepad");
    main.removeChild(windo);
  });

  windo.appendChild(txt1);
  windo.appendChild(inputId);
  windo.appendChild(br);
  windo.appendChild(txt2);
  windo.appendChild(inputPwd);
  windo.appendChild(br);
  windo.appendChild(submitBut);
  windo.appendChild(cancelBut);

  var main = document.querySelector(".notepad");
  main.appendChild(windo);

}
