'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      product.belongsTo(models.user, {
        as          : 'user',
        foreignKey  : {
          name  : 'idUser'
        }
      });

      product.hasMany(models.transaction, {
        as          : 'transactions',
        foreignKey  : {
          name  : 'idProduct'
        }
      });

      product.belongsToMany(models.category, {
        as          : 'categories',
        through     : {
          model : 'productCategory',
          as    : 'bridge'
        },
        foreignKey  : {
          name  : 'idProduct'
        }
      });

    }
  }
  product.init({
    title: DataTypes.STRING,
    decs: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    image: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    idUser: DataTypes.INTEGER,
    category: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'product',
  });
  return product;
};