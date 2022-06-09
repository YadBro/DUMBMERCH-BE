'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    static associate(models) {
      category.belongsToMany(models.product, {
        as          : 'products',
        through     : {
          model : 'productCategory',
          as    : 'bridge'
        },
        foreignKey  : {
          name  : 'idCategory'
        }
      });
    }
  }
  category.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'category',
  });
  return category;
};