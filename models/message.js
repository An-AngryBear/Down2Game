'use strict';
module.exports = (sequelize, DataTypes) => {
  var Message = sequelize.define('Message', {
    date: DataTypes.DATE,
    msg_content: DataTypes.STRING,
    sender_id: DataTypes.INTEGER,
    recipient_id: DataTypes.INTEGER,
    request: DataTypes.BOOLEAN
  }, {timestamps: false});
  
    Message.associate= (models) => {
      Message.belongsTo(models.User, {
        foreignKey: 'id'
      });
    }
  return Message;
};