'use strict';
module.exports = (sequelize, DataTypes) => {
  var Answer = sequelize.define('Answer', {
    ans_content: DataTypes.STRING,
    question_id: DataTypes.INTEGER
  }, {timestamps: false});

    Answer.associate= (models) => {
      Answer.belongsTo(models.Question, {
        foreignKey: 'id'
      });
      Answer.belongsToMany(models.User, {
        through: 'UserAnswers'
      });
    }
  return Answer;
};