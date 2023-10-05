'use strict';
//id, pilotId , orderId, distance, lat , long
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('pilots', 'lat', {
      allowNull: true,
      type: Sequelize.FLOAT,
    });
    await queryInterface.addColumn('pilots', 'lng', {
      allowNull: true,
      type: Sequelize.FLOAT,
    });
    await queryInterface.addColumn('pilots', 'isOnline', {
      allowNull: true,
      type: Sequelize.BOOLEAN,
    });
    await queryInterface.addColumn('pilots', 'orderAssign', {
      allowNull: true,
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn('pilots', 'deletedAt', {
      allowNull: true,
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn('pilots', 'socketId', {
      allowNull: true,
      type: Sequelize.STRING,
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
