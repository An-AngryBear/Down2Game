'use strict';
module.exports = (sequelize, DataTypes) => {
  var Answer = sequelize.define('Answer', {
    ansContent: DataTypes.STRING,
    QuestionId: DataTypes.INTEGER
  }, {timestamps: true});

    Answer.associate= (models) => {
      Answer.belongsTo(models.Question, {
        foreignKey: 'id'
      });
      Answer.belongsToMany(models.User, {
        through: 'UserAnswers'
      });
    };
  return Answer;
};