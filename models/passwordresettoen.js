'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PasswordResetToen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PasswordResetToen.init({
    email: {
      type:DataTypes.STRING,
      primaryKey: true
    },
    token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PasswordResetToen',
    updatedAt: false
  });
  return PasswordResetToen;
};