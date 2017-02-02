/*
  Reference for JavaScript Prototype vs Class Inheritance
  ES6 class Inheritnace - https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes
  Prototypal vs Class Inheritnace -https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Details_of_the_Object_Model
  https://medium.com/javascript-scene/master-the-javascript-interview-what-s-the-difference-between-class-prototypal-inheritance-e4cd0a7562e9#.cyvadvgtr

*/


var Desktop = function(iconNum,folderNum) {
  this.iconNum = Number(iconNum);
  this.folderNum = Number(folderNum);

  //추후 작업 : List를 통해서 어떻게 관리하려고 하는건지?
  this.iconList = [];
  this.folderList = [];

  for(var i=0;i<this.iconNum;i++){
    this.iconList[i] = new Icon('icon',i);
  }

  for(var j=0;j<this.folderNum;j++){
    this.folderList[j] = new Folder('folder',this.iconNum+j);
  }

  //Make Component for saving HIDDEN Folders
  var programs = document.createElement("div");
  programs.className = "progLists"
  var main = document.querySelector(".desktop");
  main.appendChild(programs);
};

var Icon = function(type,index){
  this.type = type;
  this.index = index;
  this.dom = this.makeComponent();
};

Icon.prototype.makeComponent = function(){
  var icon = document.createElement("div");

  if(this.type=='folder'){
    icon.className = "icon folder";
  }
  else{
    icon.className = "icon";
  }
  icon.id = this.index;

  function movPos(e){
    var self = this;
    e = e || event;

    var dragData = {
      x: e.pageX - self.offsetLeft,
      y: e.pageY - self.offsetTop
    };

    function drag(e){
      self.style.left = e.pageX - dragData.x + "px";
      self.style.top = e.pageY - dragData.y + "px";
    }

    document.addEventListener("mousemove",drag);

    document.addEventListener("mouseup",function(e){
      document.removeEventListener('mousemove',drag);
    });
  }


  var main = document.querySelector(".desktop");
  main.appendChild(icon);
  icon.style.top = (this.index * icon.clientHeight + (this.index+1) * 20 ) + "px";
  icon.addEventListener("mousedown",movPos);

  return icon;
}

var Folder = function(type,index) {
  //inheritance
  Icon.call(this,type,index);
  //field
  this.state = {
    fileNm : 0,
    fileList : []
  };
}
//inherit Icon
//Inheriting properties of Icon Prototype to Folder Prototype
Folder.prototype = Object.create(Icon.prototype);

//correct the constructor pointer because it points to Icon
Folder.prototype.constructor = Folder;

Folder.prototype.makeComponent = function(){
  Icon.prototype.makeComponent.call(this);
  var folder = document.getElementById(this.index);
  var index = this.index;
  folder.addEventListener("dblclick",function(){
    new Windo(index);
  });
}

var Windo = function(index){
  //field
  this.iconId = index;
  this.state = {
    isMax : false,
    originWidth : "500px",
    originHeight : "300px"
  }
  this.dom = this.makeComponent();
};

Windo.prototype.makeComponent = function(){
  var self = this;

  var windo = document.createElement("div");
  windo.className = "windo";
  var buttons = document.createElement("div");
  buttons.className = "buttons";
  windo.appendChild(buttons);

  function makeOffButton(){
    var offBut = document.createElement("span");
    offBut.className = "windoBut"
    offBut.id = "offBut"
    buttons.appendChild(offBut);

    function offWindo(){
      var main = document.querySelector(".desktop");
      main.removeChild(windo);

    }

    offBut.addEventListener("click",offWindo);

  }

  function makeHideButton(){
    var hideBut = document.createElement("span");
    hideBut.className = "windoBut"
    hideBut.id = "hideBut"

    buttons.appendChild(hideBut);
    function hideWindo(){
      var main = document.querySelector(".desktop");
      main.removeChild(windo);
      var unit = document.createElement("span");
      unit.className = "hiddenFolder";
      var progLists = document.querySelector(".progLists");
      progLists.appendChild(unit);
      unit.addEventListener("click",function(){
        progLists.removeChild(unit);
        self.makeComponent();
      });
    }

    hideBut.addEventListener("click",hideWindo);
  }

  function makeMaxButton(){
    var maxBut = document.createElement("span");
    maxBut.className = "windoBut"
    maxBut.id = "maxBut"

    buttons.appendChild(maxBut);

    function maxWindo(){
        if(self.state.isMax){
          windo.style.width = self.state.originWidth;
          windo.style.height = self.state.originHeight;
          self.state.isMax = false;
        }
        else{
          windo.style.width = document.body.clientWidth + "px";
          windo.style.height = document.body.clientWidth + "px";
          self.state.isMax = true;
        }
    }

    maxBut.addEventListener("click",maxWindo);
  }

  makeOffButton();
  makeHideButton();
  makeMaxButton();

  var main = document.querySelector(".desktop");
  main.appendChild(windo);


  return windo;
  /* 추후 작업 : Handling files with dragging */
  //var fileLists = document.createElement("div");
  //windo.appendChild(fileLists);
/*  function renderFiles(){
    var list = self.fileList;
    for(var i=0;i<list.length;i++){
      var temp = document.createElement("div");
      temp.innerHTML = list[i].name;
      fileLists.appendChild(temp);
      if(temp.type=='folder'){
        //nedd implement showFolder
        //temp.addEventListener("click",showFolder);
      }
    }
  }
*/

}
