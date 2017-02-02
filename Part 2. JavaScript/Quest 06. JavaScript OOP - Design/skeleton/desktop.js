/*
  Reference for JavaScript Prototype vs Class Inheritance
  ES6 class Inheritnace - https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes
  Prototypal vs Class Inheritnace -https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Details_of_the_Object_Model
  https://medium.com/javascript-scene/master-the-javascript-interview-what-s-the-difference-between-class-prototypal-inheritance-e4cd0a7562e9#.cyvadvgtr

*/


var Desktop = function(imgNum,folderNum) {
  this.imgNum = Number(imgNum);
  this.folderNum = Number(folderNum);
  this.imgList = new Array();
  this.folderList = new Array();

  for(var i=0;i<this.imgNum;i++){
    this.imgList[i] = new Img('img',i);
    this.imgList[i].makeComponent();
  }

  for(var j=0;j<this.folderNum;j++){
    this.folderList[j] = new Folder('folder',this.imgNum+j);
    this.folderList[j].makeComponent();
  }

  var programs = document.createElement("div");
  programs.className = "progLists"
  var main = document.querySelector(".desktop");
  main.appendChild(programs);
};

var Icon = function(type,index) {
  this.type = type;
  this.index = index;
};

Icon.prototype.makeComponent = function(){
  //constructor for Component
  var self = this;
  var icon = document.createElement("div");

  if(this.type=='folder'){
    icon.className = "icon folder";
  }
  else{
    icon.className = "icon";
  }
  icon.id = self.index;

  var main = document.querySelector(".desktop");
  main.appendChild(icon);
  /* Location of Icon on Desktop
    Suppose that height of icon is 80;
  */
  var iconHeight = 50;
  icon.style.top = (this.index * iconHeight + (this.index+1) * 20 ) + "px";
  icon.addEventListener("mousedown",this.movPos);

}

//Giving Property - Method - to Folder
Icon.prototype.movPos = function(e){
  e = e || event;
  var self = this;

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


var Folder = function(type,index) {
  //inheritance
  Icon.call(this,type,index);

  //field
  this.fileNum = 0;
  this.fileList = new Array();
  this.window = new Window(this.index);

};

//inherit Icon
//Inheriting properties of Icon Prototype to Folder Prototype
Folder.prototype = Object.create(Icon.prototype);

//correct the constructor pointer because it points to Icon
Folder.prototype.constructor = Folder;

Folder.prototype.makeComponent = function(){
  Icon.prototype.makeComponent.call(this);
  var folder = document.getElementById(this.index);
  //restore info to folder which will be used on window.on method
  folder.window = this.window;
  folder.fileList = this.fileList;

  folder.addEventListener("dblclick",this.window.on);
}

var Img = function(name,type,index) {
  Icon.call(this, name, type,index);
}

//inherit Icon
Img.prototype = Object.create(Icon.prototype);

//correct the constructor pointer because it points to Icon
Img.prototype.constructor = Img;

var Window = function(index){
  //field
  this.iconId = index;
  this.isOpened = false;
  this.isMax = false;
  this.originWidth = "500px";
  this.originHeight = "300px";

};

Window.prototype.on = function(e){
  if(!this.window.isOpened){
    var self = this;
    var windo = document.createElement("div");
    windo.className = "windo";
    var buttons = document.createElement("div");
    buttons.className = "buttons";
    var fileLists = document.createElement("div");
    windo.appendChild(buttons);
    windo.appendChild(fileLists);

    function renderFiles(){
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

    function offButton(){
      var offBut = document.createElement("span");
      offBut.className = "windoBut"
      offBut.id = "offBut"
      //restoring info to button which will be used in window.off method
      offBut.window = self.window;
      buttons.appendChild(offBut);
      offBut.addEventListener("click",self.window.off);
    }

    function hideButton(){
      var hideBut = document.createElement("span");
      hideBut.className = "windoBut"
      hideBut.id = "hideBut"
      //restoring info to button which will be used in window.off method
      hideBut.window = self.window;
      hideBut.origin = document.getElementById(self.id);
      buttons.appendChild(hideBut);
      hideBut.addEventListener("click",self.window.hide);
    }

    function maxButton(){
      var maxBut = document.createElement("span");
      maxBut.className = "windoBut"
      maxBut.id = "maxBut"
      //restoring info to button which will be used in window.sizeMax method
      maxBut.window = self.window;
      buttons.appendChild(maxBut);
      maxBut.addEventListener("click",self.window.sizeMax);
    }

    //make buttons
    offButton();
    hideButton();
    maxButton();

    renderFiles();

    var main = document.querySelector(".desktop");
    main.appendChild(windo);
    this.window.isOpened = true;
  }
  else{
    return;
  }
}

Window.prototype.off = function(){
  this.window.isOpened = false;
  var main = document.querySelector(".desktop");
  main.removeChild(this.parentNode.parentNode);
}

Window.prototype.hide = function(){
  /*
  this.origin.style.width = "70px";
  this.origin.style.height = "60px"
  var progLists = document.querySelector(".progLists");
  progLists.appendChild(this.origin);
  var main = document.querySelector(".desktop");
  main.removeChild(this.parentNode.parentNode);
  var self = this.origin;
  this.origin.addEventListener("click",function(){
    self.style.width = "100px";
    self.style.height = "100px";
    main.appendChild(self);

  });
  */
}

Window.prototype.sizeMax = function(){
  //overlap하는 방법 덮기
  var windowDiv = this.parentNode.parentNode;
  if(this.window.isMax){
      windowDiv.style.width = this.window.originWidth;
      windowDiv.style.height = this.window.originHeight;
      this.window.isMax = false;
  }
  else{
    windowDiv.style.width = document.body.clientWidth + "px";
    windowDiv.style.height = document.body.clientHeight + "px";
    this.window.isMax = true;
  }

}
