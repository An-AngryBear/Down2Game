'use strict';

const { UserMatches } = require('./data/user-matches');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('UserMatches', UserMatches, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserMatches', null, {});
  }
};

