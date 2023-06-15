'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WareHouse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  WareHouse.init({
    name: DataTypes.STRING,
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'WareHouse',
  });
  return WareHouse;
};