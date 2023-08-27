'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Coupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Coupon.init({
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    type: DataTypes.STRING,
    discountType: DataTypes.STRING,
    discountValue: DataTypes.INTEGER,
    minAmount: DataTypes.INTEGER,
    maxDiscount: DataTypes.INTEGER,
    termAndCondition: DataTypes.TEXT,
    image: DataTypes.STRING,
    deletedAt:DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Coupon',
  });
  return Coupon;
};