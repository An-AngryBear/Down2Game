'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    screen_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    language: DataTypes.STRING,
    timezone: DataTypes.STRING,
    avatar: DataTypes.STRING,
    last_logged_in: DataTypes.DATE,
    blurb: DataTypes.STRING
  }, {timestamps: false});

    User.associate = (models) => {
      User.hasMany(models.Message, {
        foreignKey: 'sender_id'
      });
      User.belongsToMany(models.Answer, {
        through: 'UserAnswers'
      });
      User.belongsToMany(models.Game, {
        through: 'UserGames'
      });
      User.belongsToMany(models.User, {
        through: 'UserMatches',
        as: "user_one_id"
      });
      User.belongsToMany(models.User, {
        through: 'UserMatches',
        as: "user_two_id"
      });
    }
  return User;
};