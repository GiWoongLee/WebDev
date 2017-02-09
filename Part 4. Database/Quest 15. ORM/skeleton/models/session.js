module.exports = function(sequelize,DataTypes){
  var Session = sequelize.define("Session",{
    content : DataTypes.STRING
  },{
    classMethods : {
      associate : function(models){
        Session.belongsTo(models.User,{
          onDelete: "CASCADE",
          foreignKey : {
            allowNull : false
          }
        })
      }
    }
  });

  return Session;
};
