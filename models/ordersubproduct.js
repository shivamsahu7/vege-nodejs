'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orderSubProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  orderSubProduct.init({
    userId: DataTypes.INTEGER,
    cartId: DataTypes.INTEGER,
    subProductId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    status: DataTypes.TINYINT,
    amount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'orderSubProduct',
  });
  return orderSubProduct;
};