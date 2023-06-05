'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubProductStockHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SubProductStockHistory.init({
    subProductId: DataTypes.INTEGER,
    warehouseId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    actionType: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SubProductStockHistory',
  });
  return SubProductStockHistory;
};