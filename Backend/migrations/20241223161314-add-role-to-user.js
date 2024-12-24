"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "roleId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Roles", // Ime tabele koja sadrži role
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "roleId");
  },
};
