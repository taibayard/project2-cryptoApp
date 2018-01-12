'use strict';
module.exports = (sequelize, DataTypes) => {
  var coin = sequelize.define('coin', {
    walletId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    owned: DataTypes.INTEGER,
    purchaseDate: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
         models.coin.belongsTo(models.wallet);
      }
    }
  });
  return coin;
};