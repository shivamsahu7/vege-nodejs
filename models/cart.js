'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cart.hasMany(models.cartSubProduct,{primary:'id', foreignKey:'cartId' , as:'cartSubProducts'})
      // define association here
    }
  }
  Cart.init({
    userId: DataTypes.NUMBER,
    amount: DataTypes.NUMBER,
    totalAmount: DataTypes.NUMBER,
    couponCode: DataTypes.STRING,
    deliveryCharge: DataTypes.NUMBER,
    discountAmount:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};