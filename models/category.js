'use strict';
module.exports = (sequelize, DataTypes) => {
  var Category = sequelize.define('Category', {
    name: DataTypes.STRING
  }, {timestamps: true});

    Category.associate = (models) => {
      Category.hasMany(models.Question, {
        foreignKey: 'category_id'
      });
    };
  return Category;
};