'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    username: DataTypes.TEXT,
    firstname: DataTypes.TEXT,
    lastname: DataTypes.TEXT,
    email: DataTypes.TEXT,
    dob: DataTypes.DATE,
    bio: DataTypes.TEXT,
    phone: DataTypes.TEXT,
    following: DataTypes.TEXT,
    followers: DataTypes.TEXT,
    currencies: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return user;
};