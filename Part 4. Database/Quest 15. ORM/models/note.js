module.exports = function(sequelize,DataTypes){
  var Note = sequelize.define("Note",{
    title : DataTypes.STRING,
    content : DataTypes.STRING,
  },{
    classMethods : {
      associate : function(models){
        Note.belongsTo(models.User,{
          foreignKey : {
            allowNull : false
          }
        })
      }
    },
    indexes : [{fields : ['UserId']}]
  })

  return Note;
};
