'use strict';
module.exports = (sequelize, DataTypes) => {
  var coindata = sequelize.define('coindata', {
    name: DataTypes.STRING,
    symbol: DataTypes.STRING,
    value: DataTypes.STRING,
    history: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return coindata;
};