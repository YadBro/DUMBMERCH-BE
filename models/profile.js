'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class profile extends Model {
    static associate(models) {
      // define association here
      profile.belongsTo(models.user, {
        as  : 'user',
        foreignKey  : {
          name  : 'idUser'
        }
      });
    }
  }
  profile.init({
    phone: DataTypes.STRING,
    gender: DataTypes.STRING,
    address: DataTypes.TEXT,
    image: DataTypes.TEXT,
    idUser: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'profile',
  });
  return profile;
};