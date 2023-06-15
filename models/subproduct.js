'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SubProduct.init({
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    totalQuantity: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    data: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'SubProduct',
  });
  return SubProduct;
};