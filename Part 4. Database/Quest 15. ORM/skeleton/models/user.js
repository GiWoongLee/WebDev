module.exports = function(sequelize,DataTypes){
  var User = sequelize.define("User",{
    email : DataTypes.STRING,
    password_digest : DataTypes.STRING,
    password : {
      type: DataTypes.VIRTUAL,
      set : function(val){
        this.setDataValue('password',val);
        this.setDataValue('password_hash',/*SHA Hashing*/)
      },
      validate : {
        isLongEnough : function(val){
          if(val.length < 7){
            throw new Error("Please choose a longer password");
          }
        }
      }
    }
  },{
    classMethods :{
      associate: function(models){
        User.hasMany(models.Note);
        User.hasMany(models.Session);
      }
    }
  })
  return User;
}
