'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cartSubProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // cartSubProduct.hasOne(models.SubProduct, { primary:'subProduct', foreignKey: 'id', as: 'subProductData' });

      // cartSubProduct.belongsTo(models.SubProduct, {
      //   foreignKey: 'subProduct', // This is the foreign key column in the cartSubProduct table
      //   targetKey: 'id', // This is the target key column in the SubProduct table
      //   as: 'subProductData'
      // });

      // define association here
    }
  }
  cartSubProduct.init({
    userId: DataTypes.NUMBER,
    cartId: DataTypes.NUMBER,
    subProduct: DataTypes.NUMBER,
    quantity: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'cartSubProduct',
  });
  return cartSubProduct;
};