'use strict';
module.exports = (sequelize, DataTypes) => {
  var Message = sequelize.define('Message', {
    msg_content: DataTypes.STRING,
    sender_id: DataTypes.INTEGER,
    recipient_id: DataTypes.INTEGER,
    request: DataTypes.BOOLEAN
  }, {timestamps: true});
  
    Message.associate= (models) => {
      Message.belongsTo(models.User, {
        foreignKey: 'id'
      });
    }
  return Message;
};