'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert('Users', [{
        id: 1,
        name: 'John',
        email: 'demo@demo.com',
        ip: '10.0.0.10',
        isEmail: null,
        isSubscribe: null,
        referral: null,

        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }], {}),

      queryInterface.bulkInsert('Auths', [{
        id: 1,
        type: 'local',
        userId: 1,
        password: '$2b$12$x8Y16SgWxlEhshdTDF8XbO/1RtbVcrzbCzdqjLfKE2iDx71EOiZ2a', // testtest

        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }], {}),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('Auths', null, {}),
      queryInterface.bulkDelete('Users', null, {}),
    ]);
  },
};
