'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert('users', [{
      name      : 'Yadi Apriyadi',
      email     : 'yadi@gmail.com',
      password  : '$2b$10$dP82TV/hFHRRvpWO.35H9uS9SSV45S/yZLMpEiakngqQ5qvfvFoLe', // yadiprime009
      status    : 'seller'
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
