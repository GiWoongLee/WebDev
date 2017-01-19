var Desktop = function(imgNum,folderNum) {
  this.imgNum = imgNum;
  this.folderNum = folderNum;
  this.imgList = new Array();
  this.folderList = new Array();

  for(var i=0;i<imgNum;i++){
    var name = Math.random().toString(36).substr(2,5) + '.jpg';
    this.imgList[i] = new Img(name,'img');
  }

  for(var j=0;j<folderNum;j++){
    var name = Math.random().toString(36).substr(2,5) + '.folder';
    this.folderList[j] = new Folder(name,'folder');
  }

};

var Icon = function(name,type) {
  this.name = name;
  this.type = type;
};


var Folder = function(name,type) {
  Icon.call(this, name, type);


  var folder = document.createElement("div");
  folder.className = "icon folder";
  var txt = document.createTextNode(this.name);
  folder.appendChild(txt);

  var main = document.querySelector(".desktop");
  main.appendChild(folder);

};


//inherit Icon
Folder.prototype = new Icon();

//correct the constructor pointer because it points to Icon
Folder.prototype.constructor = Folder;

var Img = function(name,type) {
  Icon.call(this, name, type);

  var img = document.createElement("div");
  img.className = "icon";
  var txt = document.createTextNode(this.name);
  img.appendChild(txt);

  var main = document.querySelector(".desktop");
  main.appendChild(img);

}

//inherit Icon
Img.prototype = new Icon();

//correct the constructor pointer because it points to Icon
Img.prototype.constructor = Img;

var Window = function() {
	/* TODO: Window 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
};
