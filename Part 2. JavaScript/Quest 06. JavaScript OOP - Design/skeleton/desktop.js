/*
  Reference for JavaScript Prototype vs Class Inheritance
  ES6 class Inheritnace - https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes
  Prototypal vs Class Inheritnace -https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Details_of_the_Object_Model
  https://medium.com/javascript-scene/master-the-javascript-interview-what-s-the-difference-between-class-prototypal-inheritance-e4cd0a7562e9#.cyvadvgtr

*/


var Desktop = function(imgNum,folderNum) {
  this.imgNum = imgNum;
  this.folderNum = folderNum;
  this.imgList = new Array();
  this.folderList = new Array();

  for(var i=0;i<imgNum;i++){
    var name = Math.random().toString(36).substr(2,5) + '.jpg';
    this.imgList[i] = new Img(name,'img',i);
    this.imgList[i].makeComponent();
  }

  for(var j=0;j<folderNum;j++){
    var name = Math.random().toString(36).substr(2,5) + '.folder';
    this.folderList[j] = new Folder(name,'folder',imgNum+j);
    this.folderList[j].makeComponent();
  }

};

var Icon = function(name,type,index) {
  this.name = name;
  this.type = type;
};

Icon.prototype.makeComponent = function(){
  //constructor for Component
  var self = this;
  var icon = document.createElement("div");
  if(this.type=='folder'){
    icon.className = "icon folder"
  }
  else{
    icon.className = "icon";
  }
  var txt = document.createTextNode(this.name);
  icon.appendChild(txt);
  var main = document.querySelector(".desktop");
  main.appendChild(icon);
  icon.addEventListener("mousedown",this.movPos);
}

//Giving Property - Method - to Folder
Icon.prototype.movPos = function(e){
  e = e || event;
  var self = this;

  /* Remove offsetTop because of positioning BLOCK style*/
  var dragData = {
        x: e.pageX - self.offsetLeft,
        y: e.pageY
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


var Folder = function(name,type) {
  //inheritance
  Icon.call(this, name, type);

  //field
  this.fileNum = 0;
  this.fileList = new Array();
  this.window = new Window();
};

//inherit Icon
//Inheriting properties of Icon Prototype to Folder Prototype
Folder.prototype = Object.create(Icon.prototype);

//correct the constructor pointer because it points to Icon
Folder.prototype.constructor = Folder;


var Img = function(name,type) {
  Icon.call(this, name, type);
}

//inherit Icon
Img.prototype = new Icon();

//correct the constructor pointer because it points to Icon
Img.prototype.constructor = Img;

var Window = function() {
	/* TODO: Window 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
};
