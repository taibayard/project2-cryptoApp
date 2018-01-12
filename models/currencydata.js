'use strict';
module.exports = (sequelize, DataTypes) => {
  var currencydata = sequelize.define('currencydata', {
    current: DataTypes.TEXT,
    history: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return currencydata;
};