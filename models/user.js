'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    screenName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    language: DataTypes.STRING,
    timezone: DataTypes.STRING,
    avatar: DataTypes.STRING,
    lastLoggedIn: DataTypes.DATE,
    blurb: DataTypes.STRING
  }, {timestamps: true});

    User.associate = (models) => {
      User.hasMany(models.Message, {
        foreignKey: 'senderId'
      });
      User.belongsToMany(models.Answer, {
        through: 'UserAnswers'
      });
      User.belongsToMany(models.Game, {
        through: 'UserGames'
      });
      User.belongsToMany(models.User, {
        through: 'UserMatches',
        as: "userOneId"
      });
      User.belongsToMany(models.User, {
        through: 'UserMatches',
        as: "userTwoId"
      });
    }
  return User;
};