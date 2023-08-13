'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.SubProduct, { primaryKey:'id', foreignKey: 'productId', as: 'subProducts' });
      Product.belongsTo(models.SubCategory, {primaryKey:'id', foreignKey: 'subCategoryId', as: 'subCategory' });
      Product.hasMany(models.productVariants ,{primaryKey:'id' , foreignKey:'productId', as:'productVariants'})
    }
  }
  Product.init({
    subCategoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};