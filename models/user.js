'use strict';
const {
  Model
} = require('sequelize');
const { Op } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    emailVerifiedAt: DataTypes.STRING,
    rememberToken:DataTypes.STRING
  }, 
  {    
    scopes: {
      userVerified:{
        where: {
          emailVerifiedAt: {
            [Op.not]: null,
          }
        }
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};