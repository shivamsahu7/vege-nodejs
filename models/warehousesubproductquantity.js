'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class wareHouseSubProductQuantity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  wareHouseSubProductQuantity.init({
    wareHouseId: DataTypes.INTEGER,
    subProductId: DataTypes.INTEGER,
    totalQuantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'wareHouseSubProductQuantity',
  });
  return wareHouseSubProductQuantity;
};