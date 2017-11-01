'use strict';

const { UserAnswers } = require('./data/user-answers');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('UserAnswers', UserAnswers, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserAnswers', null, {});
  }
};

