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
      SubProduct.hasMany(models.productImages, { foreignKey: 'subProductId', as: 'productImages' });
      SubProduct.hasOne(models.productImages ,{primaryKey:'id' , foreignKey:'subProductId' , as:'productImage'})
      // SubProduct.belongsTo(models.Product,{primaryKey:'id' , foreignKey:'productId' , as: 'product' })
      SubProduct.hasMany(models.productVariants,{primaryKey:'productId' , foreignKey:'productId' , as: 'productVariants' })
      // define association here
    }
  }
  SubProduct.init({
    name:DataTypes.STRING,
    bodyHtml:DataTypes.STRING,
    slug: DataTypes.STRING,
    totalQuantity: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    data: DataTypes.JSON,
    deletedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'SubProduct',
  });
  return SubProduct;
};