var fs = require("fs"),
  path = require("path"),
  Sequelize = require("sequelize"),
  env = process.env.NODE_ENV || "development",
  db = {};

var sequelize = new Sequelize("notepad","woong","woong1225",{
  host : 'localhost',
  dialect : 'mysql',
  port : '3306'
});


fs.readdirSync(__dirname)
  .filter(function(file){
    return (file.indexOf(".") != 0) && (file != "index.js");
  })
  .forEach(function(file){
    var model = sequelize.import(path.join(__dirname,file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName){
  if("associate" in db[modelName]){
    db[modelName].associate(db);
  }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User.sync()
  .then(function(){
    db.User.create({
      username : 'woong',
      email : 'wooong1225@gmail.com',
      password: 'woong1225'
    })
    .then(function(){
      db.User.create({
        username : "kyuin",
        email : "oh@gmail.com",
        password: "ohki21"
      })
    })
    .then(function(){
        db.User.create({
          username : "sunghwan",
          email : "skcryout@gmail.com",
          password : "audghksWkd"
      })
    })
})
.then(function(){
    db.Session.sync();
    db.Note.sync();
})
.catch(function(e){
    console.log("Something went wrong on User Model", e);
});

module.exports = db;
