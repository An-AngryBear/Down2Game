'use strict';
module.exports = (sequelize, DataTypes) => {
  var Game = sequelize.define('Game', {
    name: DataTypes.STRING
  }, {timestamps: true});
  
    Game.associate= (models) => {
      Game.belongsToMany(models.User, {
        through: 'UserGames'
      });
    };
  return Game;
};