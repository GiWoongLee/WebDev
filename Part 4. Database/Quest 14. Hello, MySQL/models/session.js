module.exports = function(sequelize,DataTypes){
  var Session = sequelize.define("Session",{
    content : DataTypes.STRING
  },{
    classMethods : {
      associate : function(models){
        Session.belongsTo(models.User,{
          foreignKey : {
            allowNull : false
          }
        });
      }
    },
    indexes : [{fields : ['UserId']}]
  })


  return Session;
};
