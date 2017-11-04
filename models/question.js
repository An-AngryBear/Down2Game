'use strict';
module.exports = (sequelize, DataTypes) => {
  var Question = sequelize.define('Question', {
    content: DataTypes.STRING,
    CategoryId: DataTypes.INTEGER
  }, {timestamps: true});
  
    Question.associate= (models) => {
      Question.belongsTo(models.Category, {
        foreign_key: 'id'
      });
      Question.hasMany(models.Answer, {
        foreign_key: 'QuestionId'
      });
    }
  return Question;
};