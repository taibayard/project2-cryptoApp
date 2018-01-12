'use strict';
module.exports = (sequelize, DataTypes) => {
  var currencyData = sequelize.define('currencyData', {
    current: DataTypes.TEXT,
    history: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return currencyData;
};