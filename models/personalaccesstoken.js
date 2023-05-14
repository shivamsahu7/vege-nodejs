'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class personalAccessToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  personalAccessToken.init({
    tokenableType: DataTypes.STRING,
    tokenableId: DataTypes.INTEGER,
    token: DataTypes.STRING,
    name: DataTypes.STRING,
    abilities: DataTypes.STRING,
    lastUsedAt: DataTypes.STRING,
    expiresAt: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'personalAccessToken',
  });
  return personalAccessToken;
};