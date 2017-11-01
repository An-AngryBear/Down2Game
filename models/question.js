'use strict';
module.exports = (sequelize, DataTypes) => {
  var Question = sequelize.define('Question', {
    content: DataTypes.STRING,
    category_id: DataTypes.INTEGER
  }, {timestamps: true});
  
    Question.associate= (models) => {
      Question.belongsTo(models.Category, {
        foreign_key: 'id'
      });
      Question.hasMany(models.Answer, {
        foreign_key: 'question_id'
      });
    }
  return Question;
};