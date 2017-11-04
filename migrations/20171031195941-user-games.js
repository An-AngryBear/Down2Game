'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserGames', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      GameId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Games',//plural required here
          key:'id'
        },
        onUpdate:'cascade',
        onDelete:'cascade'
      },
      UserId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Users',
          key:'id'
        },
        onUpdate:'cascade',
        onDelete:'cascade'
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserGames');
  }
};
