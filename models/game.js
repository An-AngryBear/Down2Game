'use strict';
module.exports = (sequelize, DataTypes) => {
  var Game = sequelize.define('Game', {
    name: DataTypes.STRING
  }, {timestamps: false});
  
    Game.associate= (models) => {
      Game.belongsToMany(models.User, {
        through: 'UserGames'
      });
    }
  return Game;
};