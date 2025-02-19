"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Jedan Role može imati više User-a
      Role.hasMany(models.User, { foreignKey: "roleId" });
    }
  }

  Role.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false, // Osigurava da ime nije prazno
      },
    },
    {
      sequelize,
      modelName: "Role",
    }
  );

  return Role;
};
