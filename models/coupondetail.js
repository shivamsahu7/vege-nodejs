'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CouponDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CouponDetail.init({
    couponId: DataTypes.INTEGER,
    couponTypeRefId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CouponDetail',
  });
  return CouponDetail;
};