'use strict';
module.exports = (sequelize, DataTypes) => {
  var cryptodata = sequelize.define('cryptodata', {
    name: DataTypes.TEXT,
    data: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return cryptodata;
};