//var bcrypt = require("bcrypt-nodejs");

module.exports = function(sequelize,DataTypes){
  var User = sequelize.define("User",{
    id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      allowNull : false,
      autoIncrement : true
    },
    username : DataTypes.STRING,
    email : {type : DataTypes.STRING, allowNull : false},
    password : DataTypes.STRING
  },{
    classMethods : {
      associate : function(models){
        User.hasMany(models.Session);
        User.hasMany(models.Note);
      }
    }
  })


  return User;
};




    /*
    password : {
      type : DataTypes.VIRTUAL,
      set : function(val){
        this.setDataValue('password',val);
        this.setDataValue('password_digest',this.getSecurePassword);
      },
      validate: {
        isEmail : true,
        isLongEnough :function(val){
          if(val.length < 7){
            throw new Error("Please choose a longer password");
          }
        }
      }
    },
    password_digest : {
      type : DataTypes.STRING,
      validate : {
        notEmpty : true
      },
      get : function(){
        return this.getDataValue(password_digest);
      }
    }
  },{
    classMethods: {
      associate : function(models){
        User.hasMany(models.Note);
        User.hasMany(models.Session);
      }
    },
    instanceMethods : {
      authenticate : function(value){
        if(bcrypt.compareSync(value,this.password_digest))
          return this;
        else {
          return false;
        }
      }
    }



User.getSecurePassword = function(val){
  bcrypt.hash(val,10,null,function(err,hash){
    if(err) return callback(err);
    return hash;
  })
}


  return User;
}
*/
