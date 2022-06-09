'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      // define association here
      user.hasOne(models.profile, {
        as          : 'profile',
        foreignKey  : {
          name  : 'idUser'
        }
      });
      
      user.hasMany(models.product, {
        as          : 'products',
        foreignKey  : {
          name  : 'idUser'
        }
      });

      user.hasMany(models.chat, {
        as          : 'senderMessage',
        foreignKey  : {
          name  : 'idSender'
        }
      });
      
      user.hasMany(models.chat, {
        as          : 'recipientMessage',
        foreignKey  : {
          name  : 'idRecipient'
        }
      });

    }
  }
  user.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};