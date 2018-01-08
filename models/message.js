'use strict';
module.exports = (sequelize, DataTypes) => {
  var Message = sequelize.define('Message', {
    msgContent: DataTypes.STRING,
    senderId: DataTypes.INTEGER,
    recipientId: DataTypes.INTEGER,
    request: DataTypes.BOOLEAN
  }, {timestamps: true});
  
    Message.associate= (models) => {
      Message.belongsTo(models.User, {
        foreignKey: 'id'
      });
    };
  return Message;
};