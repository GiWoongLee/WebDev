var bcrypt = require("bcrypt");

module.exports = function(sequelize,DataTypes){
  var User = sequelize.define("User",{
    id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      allowNull : false,
      autoIncrement : true
    },
    username : {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notEmpty : true,
        len : [1,20]
      }
    },
    email : {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        isEmail : true,
        notEmpty : true,
        len : [1,255]
      }
    },
    password : DataTypes.VIRTUAL,
    password_confirmation : DataTypes.VIRTUAL,
    password_digest : {
      type : DataTypes.STRING,
      validate : {
        notEmpty : true
      }
    }
  },{
    classMethods : {
      associate : function(models){
        User.hasMany(models.Session);
        User.hasMany(models.Note);
      }
    },
    instanceMethods : {
      authenticate : function(value){
        if(bcrypt.compareSync(value,this.password_digest))
          return true;
        else
          return false;
      }
    }
  });

  var hasSecurePassword = function(user, options, callback){
    if(user.password != user.password_confirmation )
      throw new Error("User password and User password confirmation unmatched!");
    else{
      bcrypt.hash(user.get('password'),10,function(err,hash){
        if(err) return callback(err);
        user.set('password_digest',hash);
        return callback(null,options);
      })
    }
  }

  User.beforeCreate(function(user,options,callback){
    user.email = user.email.toLowerCase();
    if(user.password)
      hasSecurePassword(user, options, callback);
    else {
      return callback(null,options);
    }
  });

  User.beforeUpdate(function(user, options, callback){
    user.email = user.email.toLowerCase();
    if(user.password)
      hasSecurePassword(user, options,callback);
    else
      return callback(null,options);
  });

  return User;
};
