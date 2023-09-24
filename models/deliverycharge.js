'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class deliveryCharge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  deliveryCharge.init({
    amount: DataTypes.INTEGER,
    charge: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'deliveryCharge',
  });
  return deliveryCharge;
};