'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('productCategories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idProduct: {
        type: Sequelize.INTEGER,
        references: {
          model : {
            tableName : 'products'
          },
          key : 'id'
        },
        onUpdate : 'CASCADE',
        onDelete : 'CASCADE'
      },
      idCategory: {
        type: Sequelize.INTEGER,
        references: {
          model : {
            tableName : 'categories'
          },
          key : 'id'
        },
        onUpdate : 'CASCADE',
        onDelete : 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('productCategories');
  }
};