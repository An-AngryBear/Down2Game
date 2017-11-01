'use strict';

const { UserGames } = require('./data/user-games');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('UserGames', UserGames, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserGames', null, {});
  }
};

