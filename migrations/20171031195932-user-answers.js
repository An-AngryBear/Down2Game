'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserAnswers',{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      AnswerId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Answers',
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
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserAnswers');
  }
};
